import Project from "../models/Project.js";

/* ================= GET ================= */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client_id", "client_name");

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= CREATE ================= */
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ================= UPDATE (NON-STATUS) ================= */
export const updateProject = async (req, res) => {
  const { status, ...rest } = req.body; // ⛔ block direct status update

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    rest,
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: "Project NOT Found" });
  }

  res.json({ success: true, data: project });
};

/* ================= STATUS TRANSITION ================= */
export const changeProjectStatus = async (req, res) => {
  const { status } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project NOT Found" });
  }

  if (project.status === "COMPLETED") {
    return res.status(400).json({
      message: "Completed Projects cannot Change Status",
    });
  }

  project.status = status;
  await project.save();

  res.json({
    success: true,
    message: `Project Moved to ${status}`,
    data: project,
  });
};

/* ================= SAFE DELETE (ARCHIVE) ================= */
export const archiveProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project NOT Found" });
  }

  project.status = "CANCELLED";
  await project.save();

  res.json({
    success: true,
    message: "Project Archived Safely",
  });
};