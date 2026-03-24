import Project from "../models/Project.js";

// GET ALL PROJECTS
export const getAll = async (req, res) => {
  try {
    let filter = {};

    // Employees only view projects assigned to them
    if (req.user.role === "Employee") {
      filter = { assignedTo: req.user._id };
    }

    const data = await Project.find(filter)
      .populate("client_id", "client_name");

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET ONE PROJECT
export const getOne = async (req, res) => {
  try {
    const data = await Project.findById(req.params.id)
      .populate("client_id", "client_name");

    if (!data) return res.status(404).json({ success: false, message: "Project NOT Found" });

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE PROJECT
export const create = async (req, res) => {
  try {
    const data = await Project.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE PROJECT
export const update = async (req, res) => {
  try {
    if (req.user.role === "HR") {
      delete req.body.billingRate;
      delete req.body.billingModel;
    }

    const data = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, data });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// DELETE PROJECT
export const remove = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
``