import express from "express";
import {
  create,
  getAll,
  getAssignedStories,
  getOne,
  update,
  remove,
} from "../controllers/storyController.js";

import { protect, authorize} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin + Finance
router.post("/", protect, create);

router.get("/", protect, authorize("Admin", "Finance", "Employee"), getAll);

// Employee — assigned stories only
router.get("/assigned", protect, getAssignedStories);

// ANY role can view one story (controller restricts employees)
router.get("/:id", protect, getOne);

// Admin + Finance + Employee (controller enforces rules)
router.put("/:id", protect, update);

// Admin OR Finance limited delete
router.delete("/:id", protect, remove);

export default router;