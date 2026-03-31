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
   ✅ CREATE ALLOCATION
========================================================= */
export const createAllocation = async (req, res) => {
  try {
    const {
      employee,
      project,
      fte,
      month,
      year,
      isBillable,
      startDate,
      endDate,
    } = req.body;

    if (!employee || !project || !fte || !month || !year) {
      return res.status(400).json({
        message: "employee, project, fte, month, year are required",
      });
    }

    if (fte < 1 || fte > MONTHLY_CAPACITY) {
      return res.status(400).json({
        message: "FTE must be between 1 and 160 hours",
      });
    }

    // ✅ Calculate current utilization
    const existing = await Allocation.find({ employee, month, year });
    const used = existing.reduce((s, a) => s + a.fte, 0);
    const totalFTE = used + fte;

    const utilization = getUtilization(totalFTE);

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

    await allocation.save();

    res.status(201).json({
      allocation,
      totalFTE,
      ...utilization,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Allocation already exists for this project/month",
      });
    }
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   ✅ UPDATE ALLOCATION (ONLY HOURS)
========================================================= */
export const updateAllocation = async (req, res) => {
  try {
    const allocation = await Allocation.findById(req.params.id);
    if (!allocation) {
      return res.status(404).json({ message: "Allocation NOT Found" });
    }

    const { fte } = req.body;

    if (fte === undefined || fte < 1 || fte > MONTHLY_CAPACITY) {
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

    const totalFTE = others.reduce((s, a) => s + a.fte, 0) + fte;

    allocation.fte = fte;
    await allocation.save();

    const utilization = getUtilization(totalFTE);

    res.json({
      allocation,
      totalFTE,
      ...utilization,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   ✅ MOVE ALLOCATION (PROJECT CHANGE ONLY)
========================================================= */
export const moveAllocation = async (req, res) => {
  try {
    const { allocationId, newProjectId } = req.body;

    const allocation = await Allocation.findById(allocationId);
    if (!allocation) {
      return res.status(404).json({ message: "Allocation NOT Found" });
    }

    const exists = await Allocation.findOne({
      employee: allocation.employee,
      project: newProjectId,
      month: allocation.month,
      year: allocation.year,
    });

    if (exists) {
      return res.status(409).json({
        message: "Allocation already exists for target project",
      });
    }

    allocation.project = newProjectId;
    await allocation.save();

    res.json({ allocation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   ✅ DELETE
========================================================= */
export const deleteAllocation = async (req, res) => {
  try {
    await Allocation.findByIdAndDelete(req.params.id);
    res.json({ message: "Allocation Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyAllocations = async (req, res) => {
  try {
    // ✅ FIX: support both query and token-based calls
    const employee =
      req.query.employee ||
      req.query.employeeId ||
      req.user?.id;

    if (!employee) {
      return res.status(400).json({ message: "employee is required" });
    }

    const allocations = await Allocation.find({ employee })
      .populate("project", "name")
      .sort({ year: -1, month: -1 });

    res.json(allocations);
  } catch (err) {
    console.error("Get Allocations Error:", err);
    res.status(500).json({ message: "Failed to fetch allocations" });
  }
};

/* =========================================================
   ✅ UTILIZATION SUMMARY (DASHBOARD)
========================================================= */
export const getUtilizationSummary = async (req, res) => {
  try {
    const { employee, month, year } = req.query;

    if (!employee || !month || !year) {
      return res.status(400).json({
        message: "employee, month, year are required",
      });
    }

    const allocations = await Allocation.find({ employee, month, year });
    const totalFTE = allocations.reduce((s, a) => s + a.fte, 0);

    const utilization = getUtilization(totalFTE);

    res.json({
      employee,
      month,
      year,
      totalFTE,
      ...utilization,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


