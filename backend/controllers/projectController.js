import Project from "../models/Project.js";

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

export const getAll = async (req, res) => {
  const data = await Project
    .find()
    .populate("client_id", "client_name"); // 🔥 IMPORTANT
  res.json(data);
};

export const getOne = async (req, res) => {
  const data = await Project
    .findById(req.params.id)
    .populate("client_id", "client_name");
  res.json(data);
};

export const create = async (req, res) => {
  try {
    const data = await Project.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  const data = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
};

export const remove = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};