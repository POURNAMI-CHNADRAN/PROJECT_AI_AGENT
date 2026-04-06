import express from "express";
import Skill from "../models/Skill.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- GET ALL ---------------- */
router.get("/", protect, authorize("Admin", "Finance", "Manager"), async (req, res) => {
  const data = await Skill.find();
  res.json(data);
});

/* ---------------- CREATE ---------------- */
router.post("/", protect, authorize("Admin", "Finance"), async (req, res) => {
  const skill = new Skill(req.body);
  await skill.save();
  res.status(201).json(skill);
});

/* ---------------- UPDATE (EDIT) ---------------- */
router.patch("/:id", protect, authorize("Admin", "Finance"), async (req, res) => {
  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,        // return updated document
        runValidators: true
      }
    );

    if (!updatedSkill) {
      return res.status(404).json({ message: "Skill NOT Found" });
    }

    res.json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ---------------- DELETE ---------------- */
router.delete("/:id", protect, authorize("Admin", "Finance"), async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;