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
  const { newProjectId } = req.body;
  const allocationId = req.params.id;

  const allocation = await Allocation.findById(allocationId);
  if (!allocation) {
    return res.status(404).json({ message: "Allocation NOT Found" });
  }

  const exists = await Allocation.findOne({
    employeeId: allocation.employeeId,
    projectId: newProjectId,
    month: allocation.month,
    year: allocation.year,
    _id: { $ne: allocationId },
  });

  if (exists) {
    return res.status(400).json({
      message: "Employee already Allocated to this Project",
    });
  }

  allocation.projectId = newProjectId;
  await allocation.save();

  res.json({ success: true });
};

// --------------------------------------------------------------------
