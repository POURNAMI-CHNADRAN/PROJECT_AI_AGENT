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
router.post("/", protect, authorize("Admin", "Finance"), createAllocation);
router.patch("/:id", protect, authorize("Admin", "Finance"), updateAllocation);
router.post("/move", protect, authorize("Admin", "Finance"), moveAllocation);
router.delete("/:id", protect, authorize("Admin", "Finance"), deleteAllocation);

/* ✅ Reads */
router.get(
  "/",
  protect,
  authorize("Admin", "Finance", "Manager", "Employee"),
  getMyAllocations
);

router.get(
  "/utilization",
  protect,
  authorize("Admin", "Finance", "Manager", "Employee"),
  getUtilizationSummary
);

router.get(
  "/year",
  protect,
  authorize("Admin", "Finance", "Manager"),
  getYearlyAllocations
);

export default router;