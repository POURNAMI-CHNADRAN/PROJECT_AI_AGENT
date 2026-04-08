import Employee from "../models/Employee.js";
import Allocation from "../models/Allocation.js";
import Project from "../models/Project.js";

// Engines
import { calculateUtilization } from "../engines/Utilization.js";
import { calculateBench } from "../engines/Bench.js";
import { calculateRevenue } from "../engines/Revenue.js";
import { evaluateProjectHealth } from "../engines/ProjectHealth.js";
import { forecastBench } from "../engines/Forecast.js";
import { suggestMoves } from "../engines/Suggestion.js";

/* =========================================================
   UTILIZATION API
   GET /api/utilization?month=MM&year=YYYY
========================================================= */
export const getUtilization = async (req, res) => {
  const { month, year } = req.query;

  const employees = await Employee.find();
  const allocations = await Allocation.find({ month, year })
    .populate("projectId");

  const response = employees.map(emp => {
    const empAllocs = allocations.filter(
      a => a.employeeId.toString() === emp._id.toString()
    );

    const utilization = calculateUtilization(empAllocs);

    return {
      employeeId: emp._id,
      employeeCode: emp.employeeCode,
      name: emp.name,
      ...utilization,
    };
  });

  res.json({
    success: true,
    count: response.length,
    data: response,
  });
};

/* =========================================================
   BENCH API
   GET /api/bench?month=MM&year=YYYY
========================================================= */
export const getBench = async (req, res) => {
  const { month, year } = req.query;

  const employees = await Employee.find();

  const allocations = await Allocation.find({
    month,
    year,
  }).populate("projectId");

  const benchData = employees.map(emp => {
    const empAllocs = allocations.filter(
      a => a.employeeId.toString() === emp._id.toString()
    );

    const bench = calculateBench(empAllocs);

    return {
      employeeId: emp._id,
      employeeCode: emp.employeeCode,
      name: emp.name,
      benchHours: bench.benchHours,
      risk: bench.risk,
    };
  });

  res.json({
    success: true,
    count: benchData.length,
    data: benchData,
  });
};
/* =========================================================
   REVENUE API
   GET /api/revenue?month=MM&year=YYYY
========================================================= */
export const getRevenue = async (req, res) => {
  const { month, year } = req.query;

  const employees = await Employee.find();
  const allocations = await Allocation.find({ month, year })
    .populate("projectId");

  const response = employees.map(emp => {
    const empAllocs = allocations.filter(
      a => a.employeeId.toString() === emp._id.toString()
    );

    const revenue = calculateRevenue(empAllocs, emp);

    return {
      employeeId: emp._id,
      employeeCode: emp.employeeCode,
      name: emp.name,
      ...revenue,
    };
  });

  res.json({
    success: true,
    data: response,
  });
};

/* =========================================================
   PROJECT HEALTH API
   GET /api/projects/health?month=MM&year=YYYY
========================================================= */
export const getProjectHealth = async (req, res) => {
  const { month, year } = req.query;

  const projects = await Project.find();
  const allocations = await Allocation.find({ month, year })
    .populate("projectId");

  const health = evaluateProjectHealth(projects, allocations);

  res.json({
    success: true,
    count: health.length,
    data: health,
  });
};

/* =========================================================
   FORECAST BENCH API
   GET /api/forecast/bench?month=MM&year=YYYY
========================================================= */
export const getBenchForecast = async (req, res) => {
  const employees = await Employee.find();
  const allocations = await Allocation.find()
    .populate("projectId");

  const grouped = employees.map(emp => ({
    employeeId: emp._id,
    name: emp.name,
    allocations: allocations.filter(
      a => a.employeeId.toString() === emp._id.toString()
    ),
  }));

  const forecast = forecastBench(grouped);

  res.json({
    success: true,
    data: forecast,
  });
};

/* =========================================================
   MOVE SUGGESTIONS API
   GET /api/suggestions/moves
========================================================= */
export const getMoveSuggestions = async (req, res) => {
  const employees = await Employee.find();
  const projects = await Project.find({ status: "ACTIVE" });
  const allocations = await Allocation.find()
    .populate("projectId");

  // Enrich employees with utilization + bench
  const enrichedEmployees = employees.map(emp => {
    const empAllocs = allocations.filter(
      a => a.employeeId.toString() === emp._id.toString()
    );

    return {
      _id: emp._id,
      name: emp.name,
      skills: emp.skills,
      utilization: calculateUtilization(empAllocs),
      bench: calculateBench(empAllocs),
    };
  });

  const suggestions = suggestMoves({
    employees: enrichedEmployees,
    projects,
  });

  res.json({
    success: true,
    count: suggestions.length,
    data: suggestions,
  });
};