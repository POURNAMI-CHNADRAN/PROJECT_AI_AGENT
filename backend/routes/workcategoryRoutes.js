import express from "express";
import {
  createWorkCategory,
  getWorkCategories,
  deleteWorkCategory,
} from "../controllers/workcategoryController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWorkCategories);

router.post("/", protect, authorize("Admin"), createWorkCategory);

router.delete("/:id", protect, authorize("Admin"), deleteWorkCategory);

export default router;