import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from "../controllers/projectController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- READ ---------------- */
router.get("/", protect, authorize("Admin", "HR", "Manager"), getProjects);

/* ---------------- CREATE ---------------- */
router.post("/", protect, authorize("Admin", "HR"), createProject);

/* ---------------- UPDATE ---------------- */
router.patch("/:id", protect, authorize("Admin", "HR"), updateProject);

/* ---------------- DELETE ---------------- */
router.delete("/:id", protect, authorize("Admin"), deleteProject);

export default router;