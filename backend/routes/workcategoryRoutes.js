import express from "express";
import {
  createWorkCategory,
  getAllWorkCategories,
  getWorkCategoryById,
  updateWorkCategory,
  deactivateWorkCategory
} from "../controllers/workcategoryController.js"

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("Admin", "Finance"), createWorkCategory);

router.get("/", protect, getAllWorkCategories);

router.get("/:id", protect, getWorkCategoryById);

router.put("/:id", protect, authorize("Admin", "Finance"), updateWorkCategory);

router.delete("/:id", protect, authorize("Admin", "Finance"), deactivateWorkCategory);

export default router;