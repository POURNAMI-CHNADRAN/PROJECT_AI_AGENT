import WorkCategory from "../models/WorkCategory.js";

/* ================= CREATE ================= */
export const createWorkCategory = async (req, res) => {
  try {
    const { name, description, managerId = null } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const exists = await WorkCategory.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: "Work Category already exists" });
    }

    const category = await WorkCategory.create({
      name,
      description,
      managerId,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */
export const getWorkCategories = async (req, res) => {
  try {
    const categories = await WorkCategory.find()
      .populate("managerId", "name email")
      .sort({ name: 1 });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteWorkCategory = async (req, res) => {
  try {
    const category = await WorkCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Work Category NOT Found" });
    }

    res.json({ message: "Work Category Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};