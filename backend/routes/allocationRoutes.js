import express from "express";
import {
  createAllocation,
  updateAllocation,
  moveAllocation,
  deleteAllocation,
  getMyAllocations,
  getUtilizationSummary,
  getYearlyAllocations,
} from "../controllers/allocationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ✅ CRUD */
router.post("/", protect, authorize("Admin", "HR"), createAllocation);
router.patch("/:id", protect, authorize("Admin", "HR"), updateAllocation);
router.post("/move", protect, authorize("Admin", "HR"), moveAllocation);
router.delete("/:id", protect, authorize("Admin", "HR"), deleteAllocation);

/* ✅ Reads */
router.get(
  "/",
  protect,
  authorize("Admin", "HR", "Manager", "Employee"),
  getMyAllocations
);

router.get(
  "/utilization",
  protect,
  authorize("Admin", "HR", "Manager", "Employee"),
  getUtilizationSummary
);

router.get(
  "/year",
  protect,
  authorize("Admin", "HR", "Manager"),
  getYearlyAllocations
);

export default router;