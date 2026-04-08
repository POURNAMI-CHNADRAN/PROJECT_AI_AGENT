import Project from "../models/Project.js";

export const validateProjectForAllocation = async (projectId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (!project.allowAllocations) {
    throw new Error(
      `Project ${project.name} does not Allow Allocations`
    );
  }

  return project;
};