import Story from "../models/Story.js";

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
    const story = await Story.create(req.body);
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  const stories = await Story.find()
    .populate("project_id", "project_name")
    .populate("assigned_employee", "full_name");

  res.json(stories);
};

export const getOne = async (req, res) => {
  const story = await Story.findById(req.params.id)
    .populate("project_id", "project_name")
    .populate("assigned_employee", "full_name");

  res.json(story);
};

export const update = async (req, res) => {
  const story = await Story.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(story);
};

export const remove = async (req, res) => {
  await Story.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};