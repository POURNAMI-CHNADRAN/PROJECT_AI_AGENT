import Employee from "../models/Employee.js";
import Allocation from "../models/Allocation.js";
import Project from "../models/Project.js";
import {
  getMonthData,
  getRevenueSummary,
  getUtilizationTrend,
} from "../services/analyticsService.js";

const MONTHLY_CAPACITY = 160;
const toNumber = (value, fallback) => Number(value || fallback);

/* =========================================================
   UTILIZATION API
   GET /api/utilization?month=MM&year=YYYY
========================================================= */
export const getUtilization = async (req, res) => {
  try {
    const month = toNumber(req.query.month, new Date().getMonth() + 1);
    const year = toNumber(req.query.year, new Date().getFullYear());
    const { employeeMetrics } = await getMonthData({ month, year });

    res.json({
      success: true,
      count: employeeMetrics.length,
      data: employeeMetrics.map((item) => ({
        employeeId: item.employeeId,
        employeeCode: item.employeeCode,
        name: item.name,
        billableHours: item.billableHours,
        utilizationPct: item.utilizationPct,
        utilizationBand: item.utilizationBand,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const month = toNumber(req.query.month, new Date().getMonth() + 1);
    const year = toNumber(req.query.year, new Date().getFullYear());
    const { employeeMetrics, allocations } = await getMonthData({ month, year });
    const revenueSummary = await getRevenueSummary({ month, year });
    const trend = await getUtilizationTrend(6);

    const billableEmployees = employeeMetrics.filter((item) => item.billableHours > 0);
    const benchEmployees = employeeMetrics.filter((item) => item.billableHours === 0);
    const averageUtilization =
      employeeMetrics.length > 0
        ? Number(
            (
              employeeMetrics.reduce((sum, item) => sum + item.utilizationPct, 0) /
              employeeMetrics.length
            ).toFixed(2)
          )
        : 0;

    const projectAllocationMap = new Map();
    for (const allocation of allocations) {
      const projectName = allocation.projectId?.name || "Unknown";
      const entry = projectAllocationMap.get(projectName) || 0;
      projectAllocationMap.set(projectName, entry + Number(allocation.allocatedHours || 0));
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalEmployees: employeeMetrics.length,
          billableEmployees: billableEmployees.length,
          benchCount: benchEmployees.length,
          averageUtilizationPct: averageUtilization,
          revenueForecast: Number(
            revenueSummary.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)
          ),
        },
        charts: {
          billableVsNonBillable: [
            { label: "Billable", value: billableEmployees.length },
            { label: "Non-Billable", value: benchEmployees.length },
          ],
          projectAllocation: [...projectAllocationMap.entries()].map(([project, hours]) => ({
            project,
            hours,
          })),
          revenueTrend: trend,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   BENCH API
   GET /api/bench?month=MM&year=YYYY
========================================================= */
export const getBench = async (req, res) => {
  try {
    const month = toNumber(req.query.month, new Date().getMonth() + 1);
    const year = toNumber(req.query.year, new Date().getFullYear());
    const { employeeMetrics } = await getMonthData({ month, year });
    const benchData = employeeMetrics
      .filter((item) => item.isBench)
      .map((item) => ({
        employeeId: item.employeeId,
        employeeCode: item.employeeCode,
        name: item.name,
        benchHours: MONTHLY_CAPACITY - item.billableHours,
        reason: item.totalAllocatedHours > 0 ? "Shadow/Internal only" : "No allocation",
      }));

    res.json({
      success: true,
      count: benchData.length,
      data: benchData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* =========================================================
   REVENUE API
   GET /api/revenue?month=MM&year=YYYY
========================================================= */
export const getRevenue = async (req, res) => {
  try {
    const month = toNumber(req.query.month, new Date().getMonth() + 1);
    const year = toNumber(req.query.year, new Date().getFullYear());
    const summary = await getRevenueSummary({ month, year });

    res.json({
      success: true,
      month,
      year,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   PROJECT HEALTH API
   GET /api/projects/health?month=MM&year=YYYY
========================================================= */
export const getProjectHealth = async (req, res) => {
  try {
    const month = toNumber(req.query.month, new Date().getMonth() + 1);
    const year = toNumber(req.query.year, new Date().getFullYear());
    const projects = await Project.find();
    const allocations = await Allocation.find({ month, year }).populate("projectId");
    const revenueByProject = await getRevenueSummary({ month, year });
    const revenueMap = new Map(revenueByProject.map((item) => [item.projectId, item]));

    const health = projects.map((project) => {
      const projectAllocs = allocations.filter(
        (a) => a.projectId && a.projectId._id.toString() === project._id.toString()
      );
      const totalHours = projectAllocs.reduce((sum, a) => sum + Number(a.allocatedHours || 0), 0);
      const financial = revenueMap.get(project._id.toString()) || {
        revenue: 0,
        cost: 0,
        margin: 0,
      };

      return {
        projectId: project._id,
        project: project.name,
        status: project.status,
        totalHours,
        revenue: financial.revenue,
        cost: financial.cost,
        margin: financial.margin,
        marginPct:
          financial.revenue > 0
            ? Number(((financial.margin / financial.revenue) * 100).toFixed(2))
            : 0,
      };
    });

    res.json({ success: true, count: health.length, data: health });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   FORECAST BENCH API
   GET /api/forecast/bench?month=MM&year=YYYY
========================================================= */
export const getBenchForecast = async (req, res) => {
  try {
    const startMonth = toNumber(req.query.month, new Date().getMonth() + 1);
    const startYear = toNumber(req.query.year, new Date().getFullYear());
    const horizon = Math.max(1, Math.min(12, toNumber(req.query.horizon, 3)));
    const pipelineDemandHours = toNumber(req.query.pipelineDemandHours, 0);

    const employees = await Employee.find({ status: "Active" });
    const forecast = [];

    for (let i = 1; i <= horizon; i++) {
      const date = new Date(startYear, startMonth - 1 + i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const { employeeMetrics } = await getMonthData({ month, year });

      const benchEmployees = employeeMetrics.filter((item) => item.billableHours === 0);
      const demandCoverage = Math.min(
        benchEmployees.length,
        Math.floor(pipelineDemandHours / MONTHLY_CAPACITY)
      );

      forecast.push({
        month,
        year,
        employeesBecomingNonBillable: benchEmployees.map((item) => item.name),
        benchCount: benchEmployees.length,
        potentialRedeployCount: demandCoverage,
      });
    }

    res.json({ success: true, data: forecast });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   MOVE SUGGESTIONS API
   GET /api/suggestions/moves
========================================================= */
export const getMoveSuggestions = async (req, res) => {
  try {
    const month = toNumber(req.query.month, new Date().getMonth() + 1);
    const year = toNumber(req.query.year, new Date().getFullYear());
    const projects = await Project.find({ status: "ACTIVE" });
    const { employeeMetrics } = await getMonthData({ month, year });

    const candidates = employeeMetrics.filter((item) => item.billableHours < 80);
    const suggestions = [];

    for (const candidate of candidates) {
      for (const project of projects) {
        const freeHours = Math.max(0, 160 - candidate.totalAllocatedHours);
        if (freeHours === 0) continue;

        suggestions.push({
          employeeId: candidate.employeeId,
          employee: candidate.name,
          projectId: project._id,
          project: project.name,
          suggestedHours: Math.min(40, freeHours),
          reason: "Underutilized billable capacity",
        });
        break;
      }
    }

    res.json({ success: true, count: suggestions.length, data: suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};