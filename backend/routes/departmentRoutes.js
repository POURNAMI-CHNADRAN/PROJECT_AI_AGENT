import express from "express";
import Department from "../models/Department.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post("/", protect, authorize("Admin"), async (req, res) => {
  try {
    if (!req.body.managerId) req.body.managerId = null;

    const dept = await Department.create(req.body);
    res.json(dept);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL
router.get("/", protect, async (req, res) => {
  try {
    const depts = await Department.find().populate("managerId", "name email");
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
const remove = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);

    if (!dept) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.delete("/:id", protect, authorize("Admin"), remove);

export default router;