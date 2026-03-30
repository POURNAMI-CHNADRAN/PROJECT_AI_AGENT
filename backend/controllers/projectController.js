import Project from "../models/Project.js";

// ✅ GET ALL PROJECTS
export const getProjects = async (req, res) => {
  const data = await Project.find();
  res.json(data);
};

// ✅ CREATE
export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ UPDATE
export const updateProject = async (req, res) => {
  const data = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
};

// ✅ DELETE
export const deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};