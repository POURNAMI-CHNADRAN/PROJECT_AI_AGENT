import Allocation from "../models/Allocation.js";
import Employee from "../models/Employee.js";
import "../models/Project.js";

const MONTHLY_CAPACITY = 160;

const normalizeBillingType = (allocation) => {
  if (allocation.billingType) return allocation.billingType;
  return allocation.isBillable ? "Billable" : "Non-Billable";
};

export const calculateEmployeeMetrics = (employee, allocations = []) => {
  let totalAllocatedHours = 0;
  let billableHours = 0;
  let revenue = 0;

  for (const allocation of allocations) {
    const hours = Number(allocation.allocatedHours || 0);
    totalAllocatedHours += hours;

    const billingType = normalizeBillingType(allocation);
    if (billingType === "Billable") {
      billableHours += hours;

      if (allocation.projectId?.billingModel === "Hourly") {
        revenue += hours * Number(allocation.rateSnapshot || allocation.projectId?.billingRate || 0);
      } else {
        const fixedMonthlyRevenue = Number(
          allocation.projectId?.fixedMonthlyRevenue || allocation.rateSnapshot || 0
        );
        revenue += fixedMonthlyRevenue * (hours / MONTHLY_CAPACITY);
      }
    }
  }

  const utilizationPct = Number(((billableHours / MONTHLY_CAPACITY) * 100).toFixed(2));
  const hourlyCost = Number(employee.hourlyCost || 0);
  const monthlySalary = Number(employee.monthlySalary || 0);
  const allocatedCost =
    monthlySalary > 0
      ? Number((monthlySalary * (totalAllocatedHours / MONTHLY_CAPACITY)).toFixed(2))
      : Number((hourlyCost * totalAllocatedHours).toFixed(2));

    let utilizationBand;

    if (billableHours === 0) {
    utilizationBand = "BENCH";
    } else if (totalAllocatedHours > MONTHLY_CAPACITY) {
    utilizationBand = "OVERBILLED";
    } else if (billableHours < MONTHLY_CAPACITY * 0.5) {
    utilizationBand = "UNDERUTILIZED";
    } else if (billableHours === MONTHLY_CAPACITY) {
    utilizationBand = "PERFECT_UTILIZATION";
    } else {
    utilizationBand = "PARTIALLY_UTILIZED";
    }

  return {
    employeeId: employee._id,
    employeeCode: employee.employeeCode,
    name: employee.name,
    totalAllocatedHours,
    billableHours,
    nonBillableHours: Number((totalAllocatedHours - billableHours).toFixed(2)),
    utilizationPct,
    allocatedCost,
    revenue: Number(revenue.toFixed(2)),
    margin: Number((revenue - allocatedCost).toFixed(2)),
    isBench: billableHours === 0,
    utilizationBand,
  };
};

export const getMonthData = async ({ month, year }) => {
  const employees = await Employee.find({ status: "Active" });
  const allocations = await Allocation.find({ month, year })
    .populate("projectId");

  const byEmployee = new Map();
  for (const allocation of allocations) {
    const key = allocation.employeeId.toString();
    const existing = byEmployee.get(key) || [];
    existing.push(allocation);
    byEmployee.set(key, existing);
  }

  const employeeMetrics = employees.map((employee) =>
    calculateEmployeeMetrics(employee, byEmployee.get(employee._id.toString()) || [])
  );

  return { employees, allocations, employeeMetrics };
};

export const getImpendingBench = async ({ month, year }) => {
  const { employeeMetrics } = await getMonthData({ month, year });
  return employeeMetrics.filter((item) => item.isBench);
};

export const getUtilizationTrend = async (limit = 6) => {
  return Allocation.aggregate([
    {
      $group: {
        _id: { month: "$month", year: "$year" },
        totalBillableHours: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $eq: ["$billingType", "Billable"] },
                  {
                    $and: [
                      { $eq: ["$billingType", null] },
                      { $eq: ["$isBillable", true] },
                    ],
                  },
                ],
              },
              "$allocatedHours",
              0,
            ],
          },
        },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: limit },
    {
      $project: {
        period: {
          $concat: [
            { $toString: "$_id.month" },
            "/",
            { $toString: "$_id.year" },
          ],
        },
        totalBillableHours: 1,
      },
    },
  ]);
};

export const getRevenueSummary = async ({ month, year }) => {
  const allocations = await Allocation.find({ month, year })
    .populate("projectId")
    .populate("employeeId");

  const projectAgg = new Map();

  for (const allocation of allocations) {
    const project = allocation.projectId;
    if (!project) continue;

    const key = project._id.toString();
    const existing =
      projectAgg.get(key) ||
      {
        projectId: key,
        project: project.name,
        revenue: 0,
        cost: 0,
      };

    const billingType = normalizeBillingType(allocation);
    const hours = Number(allocation.allocatedHours || 0);
    const employeeHourlyCost = Number(allocation.employeeId?.hourlyCost || 0);

    if (billingType === "Billable") {
      if (project.billingModel === "Fixed") {
        existing.revenue += Number(project.fixedMonthlyRevenue || allocation.rateSnapshot || 0) * (hours / MONTHLY_CAPACITY);
      } else {
        existing.revenue += Number(allocation.rateSnapshot || project.billingRate || 0) * hours;
      }
    }

    existing.cost += employeeHourlyCost * hours;
    projectAgg.set(key, existing);
  }

  return [...projectAgg.values()]
    .map((item) => ({
      ...item,
      revenue: Number(item.revenue.toFixed(2)),
      cost: Number(item.cost.toFixed(2)),
      margin: Number((item.revenue - item.cost).toFixed(2)),
    }))
    .sort((a, b) => b.revenue - a.revenue);
};
