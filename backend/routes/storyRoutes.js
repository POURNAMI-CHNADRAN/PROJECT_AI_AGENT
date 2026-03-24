import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getAssignedStories
} from "../controllers/storyController.js";

import { protect, authorize, allowEmployeeStatusUpdate } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE (Admin + HR)
router.post("/", protect, authorize("Admin", "HR"), create);

// GET ALL (Admin + HR)
router.get("/", protect, authorize("Admin", "HR"), getAll);

// GET ONLY ASSIGNED STORIES (Employee)
router.get("/assigned", protect, authorize("Employee"), getAssignedStories);

// GET ONE STORY (Admin, HR, Employee owner)
router.get("/:id", protect, authorize("Admin", "HR", "Employee"), getOne);

// UPDATE STORY
router.put(
  "/:id", protect,
  authorize("Admin", "HR", "Employee"),
  allowEmployeeStatusUpdate,
  update
);

// DELETE STORY (Admin or HR with TODO restriction)
router.delete(
  "/:id", protect,
  authorize("Admin", "HR"),
  remove
);

export default router;