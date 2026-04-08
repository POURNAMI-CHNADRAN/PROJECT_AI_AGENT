import Allocation from "../models/Allocation.js";
import Employee from "../models/Employee.js";

const MONTHLY_CAPACITY = 160;

export const createAllocation = async (req, res) => {
  try {
    const {
      employeeId,
      projectId,
      workCategoryId,
      month,
      year,
      allocatedHours,
      isBillable,
    } = req.body;

    // ✅ Fetch employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee NOT Found" });
    }

    // ✅ Calculate existing allocation for month
    const existing = await Allocation.find({
      employeeId,
      month,
      year,
    });

    const totalAllocated = existing.reduce(
      (s, a) => s + a.allocatedHours,
      0
    );

    if (totalAllocated + allocatedHours > MONTHLY_CAPACITY) {
      return res.status(400).json({
        message: "Allocation Exceeds Monthly Capacity (160h)",
      });
    }

    const allocation = await Allocation.create({
      employeeId,
      projectId,
      workCategoryId,
      month,
      year,
      allocatedHours,
      isBillable,
      rateSnapshot: employee.hourlyCost,
    });

    res.status(201).json({ success: true, data: allocation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -----------------------------------------------------------------------------------
export const updateAllocation = async (req, res) => {
  const { allocatedHours, isBillable } = req.body;
  const allocationId = req.params.id;

  const allocation = await Allocation.findById(allocationId);
  if (!allocation) {
    return res.status(404).json({ message: "Allocation NOT Found" });
  }

  // ✅ Capacity validation
  const others = await Allocation.find({
    employeeId: allocation.employeeId,
    month: allocation.month,
    year: allocation.year,
    _id: { $ne: allocationId },
  });

  const otherHours = others.reduce(
    (s, a) => s + a.allocatedHours,
    0
  );

  if (otherHours + allocatedHours > 160) {
    return res.status(400).json({
      message: "Allocation Exceeds Monthly Capacity (160h)",
    });
  }

  allocation.allocatedHours = allocatedHours;
  allocation.isBillable = isBillable;
  await allocation.save();

  res.json({ success: true, data: allocation });
};

// -----------------------------------------------------------------------
export const moveAllocation = async (req, res) => {
  const session = await Allocation.startSession();
  session.startTransaction();

  try {
    const { newProjectId, moveHours } = req.body;
    const allocationId = req.params.id;

    if (!newProjectId || !moveHours || moveHours <= 0) {
      return res.status(400).json({
        message: "Invalid Move Request",
      });
    }

    const allocation = await Allocation.findById(allocationId).session(session);
    if (!allocation) {
      return res.status(404).json({ message: "Allocation NOT Found" });
    }

    if (newProjectId.toString() === allocation.projectId.toString()) {
      return res.status(400).json({
        message: "Cannot Move Allocation to the Same Project",
      });
    }

    if (moveHours > allocation.allocatedHours) {
      return res.status(400).json({
        message: "Move Hours cannot Exceed Allocated Hours",
      });
    }

    /* ================= TOTAL CAPACITY CHECK ================= */

    const month = allocation.month;
    const year = allocation.year;

    const currentAllocations = await Allocation.find({
      employeeId: allocation.employeeId,
      month,
      year,
    }).session(session);

    const totalAllocated = currentAllocations.reduce(
      (sum, a) => sum + a.allocatedHours,
      0
    );

    if (totalAllocated > 160) {
      return res.status(400).json({
        message: "Employee already Over-Allocated",
      });
    }

    /* ================= MERGE OR CREATE ================= */

    const existingTarget = await Allocation.findOne({
      employeeId: allocation.employeeId,
      projectId: newProjectId,
      month,
      year,
    }).session(session);

    // Reduce old allocation
    allocation.allocatedHours -= moveHours;

    if (allocation.allocatedHours === 0) {
      await allocation.deleteOne({ session });
    } else {
      await allocation.save({ session });
    }

    let newAllocation;

    if (existingTarget) {
      existingTarget.allocatedHours += moveHours;
      newAllocation = await existingTarget.save({ session });
    } else {
      newAllocation = await Allocation.create(
        [
          {
            employeeId: allocation.employeeId,
            projectId: newProjectId,
            workCategoryId: allocation.workCategoryId,
            month,
            year,
            allocatedHours: moveHours,
            isBillable: allocation.isBillable,
            rateSnapshot: allocation.rateSnapshot,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "Allocation Moved Successfully",
      data: {
        movedHours: moveHours,
        fromProject: allocation.projectId,
        toProject: newProjectId,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Move Allocation Error:", err);
    res.status(500).json({
      message: "Internal Error while Moving Allocation",
    });
  }
};

// --------------------------------------------------------------------
export const getAllAllocations = async (req, res) => {
  try {
    const { month, year, employeeId, projectId } = req.query;

    const filter = {};

    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (employeeId) filter.employeeId = employeeId;
    if (projectId) filter.projectId = projectId;

    const allocations = await Allocation.find(filter)
      .populate("employeeId", "name employeeCode")
      .populate("projectId", "name status billingRate")
      .populate("workCategoryId", "name");

    res.json({
      success: true,
      count: allocations.length,
      data: allocations,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error Fetching Allocations",
      error: err.message,
    });
  }
};
// ----------------------------------------------------------------------------
export const getAllocationsByEmployee = async (req, res) => {
  try {
    const { month, year } = req.query;

    const allocations = await Allocation.find({
      month: Number(month),
      year: Number(year),
    })
      .populate("employeeId", "name employeeCode")
      .populate("projectId", "name")
      .populate("workCategoryId", "name");

    const grouped = {};

    allocations.forEach((a) => {
      const empId = a.employeeId._id;

      if (!grouped[empId]) {
        grouped[empId] = {
          employee: a.employeeId,
          totalHours: 0,
          allocations: [],
        };
      }

      grouped[empId].allocations.push(a);
      grouped[empId].totalHours += a.allocatedHours;
    });

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
