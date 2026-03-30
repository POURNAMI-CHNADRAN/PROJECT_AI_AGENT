import Allocation from "../models/Allocation.js";

/* =========================================================
   🔥 HELPER: UTILIZATION ENGINE (CORE RM LOGIC)
========================================================= */
const getUtilizationData = (totalFTE) => {
  let status = "Optimal";
  let riskLevel = "Normal";

  if (totalFTE === 0) {
    status = "Bench";
    riskLevel = "High";
  } else if (totalFTE < 160) {
    status = "Underutilized";
    if (totalFTE < 120) riskLevel = "Medium";
  } else if (totalFTE === 160) {
    status = "Optimal";
  } else {
    status = "Overutilized";
    riskLevel = "High";
  }

  return {
    totalFTE,
    remainingHours: Math.max(0, 160 - totalFTE),
    overHours: Math.max(0, totalFTE - 160),
    status,
    riskLevel,
    canMove: true,
  };
};

/* =========================================================
   ✅ CREATE ALLOCATION
========================================================= */
export const createAllocation = async (req, res) => {
  try {
    const { employee, fte, month, year } = req.body;

    if (!employee || !fte || !month || !year) {
      return res.status(400).json({
        message: "employee, fte, month, year are required",
      });
    }

    if (fte <= 0) {
      return res.status(400).json({
        message: "FTE must be greater than 0",
      });
    }

    if (fte > 160) {
      return res.status(400).json({
        message: "Single allocation cannot exceed 160 hrs",
      });
    }

    const existing = await Allocation.find({ employee, month, year });

    const existingTotal = existing.reduce(
      (sum, a) => sum + (a.fte || 0),
      0
    );

    const totalFTE = existingTotal + fte;
    const utilization = getUtilizationData(totalFTE);

    let warning = null;
    if (totalFTE > 160) {
      warning = "Employee is overutilized";
    }

    const allocation = new Allocation({
      ...req.body,
      status: utilization.status,
    });

    await allocation.save();

    // 🔥 Update all allocations status (important)
    await Allocation.updateMany(
      { employee, month, year },
      { status: utilization.status }
    );

    res.status(201).json({
      allocation,
      warning,
      ...utilization,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   ✅ GET ALL ALLOCATIONS
========================================================= */
export const getAllocations = async (req, res) => {
  try {
    const data = await Allocation.find()
      .populate("employee", "name employeeId")
      .populate("project", "name type");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   ✅ UPDATE ALLOCATION (FIXED LOGIC)
========================================================= */
export const updateAllocation = async (req, res) => {
  try {
    const allocation = await Allocation.findById(req.params.id);

    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    const { fte } = req.body;

    if (fte !== undefined) {
      if (fte <= 0) {
        return res.status(400).json({
          message: "FTE must be greater than 0",
        });
      }

      if (fte > 160) {
        return res.status(400).json({
          message: "Single allocation cannot exceed 160 hrs",
        });
      }

      // 🔥 FIXED CALCULATION
      const existing = await Allocation.find({
        employee: allocation.employee,
        month: allocation.month,
        year: allocation.year,
        _id: { $ne: allocation._id },
      });

      const existingTotal = existing.reduce(
        (sum, a) => sum + (a.fte || 0),
        0
      );

      const newTotalFTE = existingTotal + fte;

      allocation.fte = fte;

      const utilization = getUtilizationData(newTotalFTE);

      allocation.status = utilization.status;

      await allocation.save();

      // 🔥 Update all related allocations
      await Allocation.updateMany(
        {
          employee: allocation.employee,
          month: allocation.month,
          year: allocation.year,
        },
        { status: utilization.status }
      );

      return res.json({
        allocation,
        ...utilization,
      });
    }

    Object.assign(allocation, req.body);
    await allocation.save();

    res.json({ allocation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   ✅ MOVE EMPLOYEE (SMART RM LOGIC)
========================================================= */
export const moveAllocation = async (req, res) => {
  try {
    const { allocationId, newProjectId } = req.body;

    const allocation = await Allocation.findById(allocationId);

    if (!allocation) {
      return res.status(404).json({ message: "Allocation not found" });
    }

    const allocations = await Allocation.find({
      employee: allocation.employee,
      month: allocation.month,
      year: allocation.year,
    });

    const totalFTE = allocations.reduce(
      (sum, a) => sum + (a.fte || 0),
      0
    );

    const utilization = getUtilizationData(totalFTE);

    allocation.project = newProjectId;
    await allocation.save();

    res.json({
      message: "Moved successfully",
      allocation,
      ...utilization,
      movementType:
        totalFTE === 160
          ? "Planned Rotation"
          : totalFTE < 160
          ? "Partial Allocation Shift"
          : "Overload Redistribution",
      note:
        utilization.remainingHours > 0
          ? "Employee still has free capacity"
          : "Fully utilized resource moved strategically",
    });
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
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   ✅ GET MY ALLOCATIONS
========================================================= */
export const getMyAllocations = async (req, res) => {
  try {
    const employeeId = req.query.employeeId || req.user.id;

    const allocations = await Allocation.find({ employee: employeeId })
      .populate("project", "name type");

    res.json(allocations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   ✅ GET ACTIVE ALLOCATIONS
========================================================= */
export const getActiveAllocations = async (req, res) => {
  try {
    const today = new Date();

    const allocations = await Allocation.find({
      startDate: { $lte: today },
      endDate: { $gte: today },
    })
      .populate("employee", "name employeeId")
      .populate("project", "name type");

    res.json(allocations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   ✅ UTILIZATION API (FINAL DASHBOARD ENGINE)
========================================================= */
export const getUtilization = async (req, res) => {
  try {
    const employeeId = req.query.employeeId || req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "month and year are required",
      });
    }

    const allocations = await Allocation.find({
      employee: employeeId,
      month,
      year,
    });

    const totalFTE = allocations.reduce(
      (sum, a) => sum + (a.fte || 0),
      0
    );

    const utilization = getUtilizationData(totalFTE);

    res.json({
      employeeId,
      month,
      year,
      ...utilization,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};