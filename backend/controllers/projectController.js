import Project from "../models/Project.js";

/* ================= GET ================= */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "client_id",
      "client_name"
    );
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

/* ================= UPDATE (NON‑STATUS) ================= */
export const updateProject = async (req, res) => {
  try {
    const { status, allowAllocations, allowMoves, ...rest } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $set: rest, // ✅ important
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("client_id", "client_name");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project NOT Found",
      });
    }

    res.json({
      success: true,
      message: "Project Updated Successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
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

/* ================= ARCHIVE ================= */
export const archiveProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project NOT Found" });
  }

  project.status = "CANCELLED";
  await project.save();

  res.json({ success: true, message: "Project Archived Safely" });
};

