import Project from "../models/Project.js";
import Story from "../models/Story.js";
import mongoose from "mongoose";

export const getAll = async (req, res) => {
  try {
    let projects = [];

    if (req.user.role === "Employee") {

      // 1️⃣ Projects directly assigned
      const assignedProjects = await Project.find({
        assignedTo: new mongoose.Types.ObjectId(req.user.id),
      });

      // 2️⃣ Projects from assigned stories
      const stories = await Story.find({
        "assigned_employee._id": new mongoose.Types.ObjectId(req.user.id),
      });

      const storyProjectIds = stories.map((s) =>
        typeof s.project_id === "object"
          ? s.project_id._id
          : s.project_id
      );

      const storyProjects = await Project.find({
        _id: { $in: storyProjectIds },
      });

      // 3️⃣ Merge + remove duplicates
      const map = new Map();

      [...assignedProjects, ...storyProjects].forEach((p) =>
        map.set(p._id.toString(), p)
      );

      projects = Array.from(map.values());

    } else {
      projects = await Project.find();
    }

    // populate after filtering
    const data = await Project.populate(projects, [
      { path: "client_id", select: "client_name" },
      { path: "assignedTo", select: "name" },
    ]);

    res.json({ success: true, data });

  } catch (error) {
  console.error("PROJECT API ERROR:", error);
  res.status(500).json({ success: false, message: error.message });

  console.log("USER ID TYPE:", typeof req.user.id);
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