import User from "../models/User.js";

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    // ✅ THIS IS THE FIX
    res.json({
      data: users
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

