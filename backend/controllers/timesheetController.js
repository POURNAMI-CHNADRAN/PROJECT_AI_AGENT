import Timesheet from "../models/Timesheet.js";

export const getProfile = (req, res) => {
  res.json({
    message: "Logged-in User Info",
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

export const create = async (req, res) => {
  try {
    const timesheet = await Timesheet.create(req.body);
    res.json(timesheet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  const data = await Timesheet.find()
    .populate("employee_id", "full_name")
    .populate("project_id", "project_name")
    .populate("story_id", "title");

  res.json(data);
};

export const getOne = async (req, res) => {
  const data = await Timesheet.findById(req.params.id);
  res.json(data);
};

export const update = async (req, res) => {
  const data = await Timesheet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
};

export const getByEmployee = async (req, res) => {
  const data = await Timesheet.find({ employee_id: req.params.id });
  res.json(data);
};

export const getByProject = async (req, res) => {
  const data = await Timesheet.find({ project_id: req.params.id });
  res.json(data);
};