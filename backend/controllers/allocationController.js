import Allocation from "../models/Allocation.js";

/* ================= HELPER ================= */

// Check overlapping allocations
const getOverlappingAllocations = async (
  employee,
  startDate,
  endDate,
  excludeId = null
) => {
  const query = {
    employee,
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return await Allocation.find(query);
};

// Validate total allocation <= 100
const validateAllocationLimit = (existingAllocations, newAllocation) => {
  const total =
    existingAllocations.reduce((sum, a) => sum + a.allocation, 0) +
    newAllocation;

  return total <= 100;
};

/* ================= CREATE ================= */

export const createAllocation = async (req, res) => {
  try {
    const { employee, project, allocation, startDate, endDate } = req.body;

    // 🔹 Required validation
    if (!employee || !project || allocation === undefined || !startDate || !endDate) {
      return res.status(400).json({ error: "All Fields are Required" });
    }

    // 🔹 Allocation range
    if (allocation < 0 || allocation > 100) {
      return res.status(400).json({
        error: "Allocation must be between 0 and 100",
      });
    }

    // 🔹 Date validation
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        error: "Start Date cannot be after End Date",
      });
    }

    // 🔥 Overlap check
    const overlaps = await getOverlappingAllocations(
      employee,
      startDate,
      endDate
    );

    // 🔥 Allocation limit check
    if (!validateAllocationLimit(overlaps, allocation)) {
      return res.status(400).json({
        error: "Total Allocation exceeds 100% for this Employee",
      });
    }

    const newAllocation = await Allocation.create({
      employee,
      project,
      allocation,
      startDate,
      endDate,
    });

    res.status(201).json({
      message: "Allocation Created Successfully",
      data: newAllocation,
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

/* ================= GET ALL ================= */

export const getAllocations = async (req, res) => {
  try {
    let query = {};

    // Employee → only their data
    if (req.user.role === "Employee") {
      query.employee = req.user.id;
    }

    const allocations = await Allocation.find(query)
      .populate("employee", "name email")
      .populate("project", "name billingType");

    res.json({
      count: allocations.length,
      data: allocations,
    });
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

/* ================= GET ONE ================= */

export const getAllocationById = async (req, res) => {
  try {
    const allocation = await Allocation.findById(req.params.id)
      .populate("employee", "name")
      .populate("project", "name billingType");

    if (!allocation) {
      return res.status(404).json({ error: "Allocation NOT Found" });
    }

    // Employee restriction
    if (
      req.user.role === "Employee" &&
      allocation.employee._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(allocation);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* ================= UPDATE ================= */

export const updateAllocation = async (req, res) => {
  try {
    const allocationId = req.params.id;

    const existing = await Allocation.findById(allocationId);

    if (!existing) {
      return res.status(404).json({ error: "Allocation NOT Found" });
    }

    const {
      employee = existing.employee,
      project = existing.project,
      allocation = existing.allocation,
      startDate = existing.startDate,
      endDate = existing.endDate,
    } = req.body;

    // 🔹 Date validation
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        error: "Start Date cannot be after End Date",
      });
    }

    // 🔥 Overlap check (exclude current record)
    const overlaps = await getOverlappingAllocations(
      employee,
      startDate,
      endDate,
      allocationId
    );

    // 🔥 Allocation validation
    if (!validateAllocationLimit(overlaps, allocation)) {
      return res.status(400).json({
        error: "Total Allocation exceeds 100%",
      });
    }

    const updated = await Allocation.findByIdAndUpdate(
      allocationId,
      {
        employee,
        project,
        allocation,
        startDate,
        endDate,
      },
      { new: true }
    )
      .populate("employee", "name")
      .populate("project", "name billingType");

    res.json({
      message: "Updated Successfully",
      data: updated,
    });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

/* ================= DELETE ================= */

export const deleteAllocation = async (req, res) => {
  try {
    const deleted = await Allocation.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Allocation NOT Found" });
    }

    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

/* ================= EMPLOYEE: MY ALLOCATIONS ================= */

export const getMyAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.find({
      employee: req.user.id
    })
      .populate("project", "name")
      .sort({ startDate: -1 });

    res.json({
      count: allocations.length,
      data: allocations,
    });
  } catch (err) {
    console.error("MY ALLOC ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


/* ================= EMPLOYEE: ACTIVE ALLOCATIONS ================= */

export const getActiveAllocations = async (req, res) => {
  try {
    const today = new Date();

    const allocations = await Allocation.find({
      employee: req.user.id,
      startDate: { $lte: today },
      endDate: { $gte: today }
    })
      .populate("project", "name")
      .sort({ startDate: -1 });

    res.json({
      count: allocations.length,
      data: allocations,
    });
  } catch (err) {
    console.error("ACTIVE ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


/* ================= EMPLOYEE: UTILIZATION ================= */

export const getUtilization = async (req, res) => {
  try {
    const today = new Date();

    const allocations = await Allocation.find({
      employee: req.user.id,
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    const total = allocations.reduce((sum, a) => sum + a.allocation, 0);

    res.json({
      utilization: total,
      status:
        total > 100
          ? "OVER_ALLOCATED"
          : total === 100
          ? "FULLY_ALLOCATED"
          : "UNDER_ALLOCATED",
      allocations: allocations.length
    });
  } catch (err) {
    console.error("UTILIZATION ERROR:", err);
    res.status(500).json({ error: "Server Error" });
  }
};