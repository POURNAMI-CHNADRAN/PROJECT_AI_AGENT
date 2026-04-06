import mongoose from "mongoose";
import Allocation from "../models/Allocation.js";

const MONTHLY_CAPACITY = 160;

/* =========================================================
   ✅ UTILIZATION ENGINE (SINGLE SOURCE OF TRUTH)
========================================================= */
const getUtilization = (totalFTE) => {
  if (totalFTE < MONTHLY_CAPACITY) {
    return {
      status: "Underutilized",
      remainingHours: MONTHLY_CAPACITY - totalFTE,
      overHours: 0,
    };
  }

  if (totalFTE === MONTHLY_CAPACITY) {
    return {
      status: "Optimal",
      remainingHours: 0,
      overHours: 0,
    };
  }

  return {
    status: "Overutilized",
    remainingHours: 0,
    overHours: totalFTE - MONTHLY_CAPACITY,
  };
};

/* =========================================================
   ✅ CREATE ALLOCATION (TRANSACTION SAFE)
========================================================= */
export const createAllocation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      employee,
      project,
      fte,
      month,
      year,
      isBillable = false,
    } = req.body;

    if (!employee || !project || !fte || !month || !year) {
      throw new Error("employee, project, fte, month, year are required");
    }

    if (fte < 1 || fte > MONTHLY_CAPACITY) {
      throw new Error("FTE must be between 1 and 160");
    }

    if (month < 1 || month > 12) {
      throw new Error("Invalid month");
    }

    if (year < 2020 || year > 2100) {
      throw new Error("Invalid year");
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const existing = await Allocation.find({ employee, month, year }).session(
      session
    );

    const used = existing.reduce((s, a) => s + a.fte, 0);
    const totalFTE = used + fte;

    if (totalFTE > MONTHLY_CAPACITY) {
      throw new Error("Monthly capacity exceeded");
    }

    const duplicate = await Allocation.findOne({
      employee,
      project,
      month,
      year,
    }).session(session);

    if (duplicate) {
      throw new Error("Allocation already exists for this project/month");
    }

    const allocation = new Allocation({
      employee,
      project,
      fte,
      month,
      year,
      isBillable,
      startDate,
      endDate,
    });

    await allocation.save({ session });
    await session.commitTransaction();

    res.status(201).json({
      allocation,
      totalFTE,
      ...getUtilization(totalFTE),
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

/* =========================================================
   ✅ UPDATE ALLOCATION (FTE ONLY)
========================================================= */
export const updateAllocation = async (req, res) => {
  if (!["Admin", "Finance"].includes(req.user.role)) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  try {
    const allocation = await Allocation.findById(req.params.id);
    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    const { fte } = req.body;

    if (fte < 1 || fte > MONTHLY_CAPACITY) {
      return res.status(400).json({
        message: "FTE must be between 1 and 160",
      });
    }

    const others = await Allocation.find({
      employee: allocation.employee,
      month: allocation.month,
      year: allocation.year,
      _id: { $ne: allocation._id },
    });

    const totalFTE =
      others.reduce((s, a) => s + a.fte, 0) + Number(fte);

    if (totalFTE > MONTHLY_CAPACITY) {
      return res.status(400).json({
        message: "Monthly capacity exceeded",
      });
    }

    allocation.fte = fte;
    await allocation.save();

    res.json({
      allocation,
      totalFTE,
      ...getUtilization(totalFTE),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   ✅ MOVE ALLOCATION (PROJECT ONLY)
========================================================= */
export const moveAllocation = async (req, res) => {
  if (!["Admin", "Finance"].includes(req.user.role)) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  try {
    const { allocationId, newProjectId } = req.body;

    const allocation = await Allocation.findById(allocationId);
    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    const exists = await Allocation.findOne({
      employee: allocation.employee,
      project: newProjectId,
      month: allocation.month,
      year: allocation.year,
    });

    if (exists) {
      return res
        .status(409)
        .json({ message: "Allocation already exists for this project/month" });
    }

    allocation.project = newProjectId;
    await allocation.save();

    res.json({ allocation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   ✅ DELETE ALLOCATION
========================================================= */
export const deleteAllocation = async (req, res) => {
  if (!["Admin", "Finance"].includes(req.user.role)) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  await Allocation.findByIdAndDelete(req.params.id);
  res.json({ message: "Allocation deleted" });
};

/* =========================================================
   ✅ GET ALLOCATIONS FOR EMPLOYEE
========================================================= */
export const getMyAllocations = async (req, res) => {
  const employee =
    req.query.employee ||
    req.query.employeeId ||
    req.user?._id ||
    req.user?.id;

  if (!employee) {
    return res.status(400).json({ message: "employee is required" });
  }

  const allocations = await Allocation.find({ employee })
    .populate("project", "name")
    .sort({ year: -1, month: -1 });

  res.json(allocations);
};

/* =========================================================
   ✅ UTILIZATION SUMMARY
========================================================= */
export const getUtilizationSummary = async (req, res) => {
  const { employee, month, year } = req.query;

  if (!employee || !month || !year) {
    return res
      .status(400)
      .json({ message: "employee, month, year are required" });
  }

  const allocations = await Allocation.find({
    employee,
    month: Number(month),
    year: Number(year),
  });

  const totalFTE = allocations.reduce((s, a) => s + a.fte, 0);

  res.json({
    employee,
    month,
    year,
    totalFTE,
    ...getUtilization(totalFTE),
  });
};

/* =========================================================
   ✅ GET YEARLY ALLOCATIONS (HEATMAP)
========================================================= */
export const getYearlyAllocations = async (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({ message: "year is required" });
  }

  const allocations = await Allocation.find({ year: Number(year) })
    .populate("employee", "name departmentId ratePerHour")
    .populate("project", "name")
    .sort({ month: 1 });

  res.json(allocations);
};