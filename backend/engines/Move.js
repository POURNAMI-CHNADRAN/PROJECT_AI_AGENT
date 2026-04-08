import Allocation from "../models/Allocation.js";
import Project from "../models/Project.js";

/**
 * Partial or full move with safety & governance
 */
export async function moveAllocation({
  allocationId,
  newProjectId,
  moveHours,
}) {
  const allocation = await Allocation.findById(allocationId)
    .populate("projectId");

  if (!allocation) throw new Error("Allocation not found");

  if (moveHours <= 0 || moveHours > allocation.allocatedHours)
    throw new Error("Invalid move hours");

  if (allocation.projectId._id.toString() === newProjectId)
    throw new Error("Cannot move to same project");

  const targetProject = await Project.findById(newProjectId);
  if (!targetProject || !targetProject.allowAllocations)
    throw new Error("Target project does not allow allocations");

  const month = allocation.month;
  const year = allocation.year;

  // Reduce old allocation
  allocation.allocatedHours -= moveHours;
  if (allocation.allocatedHours === 0) {
    await allocation.deleteOne();
  } else {
    await allocation.save();
  }

  // Merge or create target allocation
  const existingTarget = await Allocation.findOne({
    employeeId: allocation.employeeId,
    projectId: newProjectId,
    month,
    year,
  });

  if (existingTarget) {
    existingTarget.allocatedHours += moveHours;
    await existingTarget.save();
  } else {
    await Allocation.create({
      employeeId: allocation.employeeId,
      projectId: newProjectId,
      workCategoryId: allocation.workCategoryId,
      month,
      year,
      allocatedHours: moveHours,
      isBillable: allocation.isBillable,
      rateSnapshot: allocation.rateSnapshot,
    });
  }

  return { success: true };
}