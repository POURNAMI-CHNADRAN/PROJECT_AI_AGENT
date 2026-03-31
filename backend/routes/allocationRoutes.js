import express from "express";
import {
  createAllocation,
  updateAllocation,
  moveAllocation,
  deleteAllocation,
  getUtilizationSummary,
} from "../controllers/allocationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("Admin", "HR"), createAllocation);

router.patch("/:id", protect, authorize("Admin", "HR"), updateAllocation);

router.post("/move", protect, authorize("Admin", "HR"), moveAllocation);

router.delete("/:id", protect, authorize("Admin"), deleteAllocation);

router.get("/utilization", protect, getUtilizationSummary);

export default router;