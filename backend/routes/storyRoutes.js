import express from "express";
import {
  create,
  getAll,
  getAssignedStories,
  getOne,
  update,
  remove,
} from "../controllers/storyController.js";

import { protect, adminOrHROnly, employeeOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin + HR
router.post("/", protect, adminOrHROnly, create);
router.get("/", protect, adminOrHROnly, getAll);

// Employee — assigned stories only
router.get("/assigned", protect, employeeOnly, getAssignedStories);

// ANY role can view one story (controller restricts employees)
router.get("/:id", protect, getOne);

// Admin + HR + Employee (controller enforces rules)
router.put("/:id", protect, update);

// Admin OR HR limited delete
router.delete("/:id", protect, remove);

export default router;