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
router.get("/", protect, authorize("Admin", "Finance", "Manager"), getProjects);

/* ---------------- CREATE ---------------- */
router.post("/", protect, authorize("Admin", "Finance"), createProject);

/* ---------------- UPDATE ---------------- */
router.patch("/:id", protect, authorize("Admin", "Finance"), updateProject);

/* ---------------- DELETE ---------------- */
router.delete("/:id", protect, authorize("Admin"), deleteProject);

export default router;