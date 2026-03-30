import Billing from "../models/Billing.js";
import Allocation from "../models/Allocation.js";

/* =========================================================
   ✅ GENERATE BILLING (FINAL REAL-WORLD VERSION)
========================================================= */
export const generateBilling = async (req, res) => {
  try {
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({
        message: "month and year are required",
      });
    }

    const allocations = await Allocation.find({ month, year })
      .populate("employee")
      .populate("project");

    if (!allocations.length) {
      return res.json({ message: "No Allocations Found" });
    }

    const billingMap = new Map();

    let skipped = 0;
    let totalProcessed = 0;

    /* -----------------------------------------------------
       🔥 GROUPING LOGIC
    ----------------------------------------------------- */
    for (const a of allocations) {
      if (!a.employee || !a.project) continue;

      // ❗ Skip non-billable
      if (!a.isBillable) {
        skipped++;
        continue;
      }

      totalProcessed++;

      const key = `${a.employee._id}_${a.project._id}`;

      const rate =
        a.employee.costPerMonth && a.employee.costPerMonth > 0
          ? a.employee.costPerMonth / 160
          : 500; // fallback

      if (!billingMap.has(key)) {
        billingMap.set(key, {
          employee_id: a.employee._id,
          project_id: a.project._id,
          total_hours: 0,
          rate_per_hour: rate,
        });
      }

      billingMap.get(key).total_hours += a.fte || 0;
    }

    const results = [];
    let totalRevenue = 0;
    let totalHours = 0;

    /* -----------------------------------------------------
       🔥 SAVE BILLING
    ----------------------------------------------------- */
    for (const billData of billingMap.values()) {
    const bill = await Billing.findOneAndUpdate(
      {
        employee_id: billData.employee_id,
        project_id: billData.project_id,
        month,
        year,
      },
      {
        ...billData,
        month,
        year,
        total_revenue: billData.total_hours * billData.rate_per_hour, // ✅ ADD THIS
      },
      { upsert: true, new: true }
    );

      totalRevenue += bill.total_revenue || 0;
      totalHours += bill.total_hours || 0;

      results.push(bill);
    }

    /* -----------------------------------------------------
       🔥 FINAL RESPONSE
    ----------------------------------------------------- */
    res.json({
      message: "Billing Generated Successfully",
      summary: {
        totalBillingRecords: results.length,

        totalEmployees: new Set(
          results.map(r => r.employee_id.toString())
        ).size,

        totalProjects: new Set(
          results.map(r => r.project_id.toString())
        ).size,

        totalHours,
        totalRevenue,

        avgRate: totalRevenue / totalHours,

        processedAllocations: totalProcessed,
        skippedNonBillable: skipped,
      },
      data: results,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   ✅ GET BILLING
========================================================= */
export const getBilling = async (req, res) => {
  try {
    const data = await Billing.find()
      .populate("employee_id", "name employeeId")
      .populate("project_id", "name");

    res.json({
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};