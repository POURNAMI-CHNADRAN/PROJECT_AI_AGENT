import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createSkill, getSkills, deleteSkill } from "../controllers/skillController.js";

const router = express.Router();

// Admin only
router.post("/", protect, authorize("Admin"), createSkill);

// Everyone can view
router.get("/", protect, authorize("Admin", "HR", "Manager", "Employee"), getSkills);

// Admin only
router.delete("/:id", protect, authorize("Admin"), deleteSkill);

export default router;