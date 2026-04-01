import express from "express";
import {
  createAllocation,
  updateAllocation,
  moveAllocation,
  deleteAllocation,
  getMyAllocations,
  getUtilizationSummary,
  getMonthlyAllocations
} from "../controllers/allocationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   ✅ CREATE / UPDATE / DELETE (ADMIN / HR)
========================================================= */
router.post("/", protect, authorize("Admin", "HR"), createAllocation);

router.patch("/:id", protect, authorize("Admin", "HR"), updateAllocation);

router.post("/move", protect, authorize("Admin", "HR"), moveAllocation);

router.delete("/:id", protect, authorize("Admin", "HR"), deleteAllocation);

/* =========================================================
   ✅ READ ALLOCATIONS
========================================================= */

// 🔹 Employee / Manager / HR / Admin
// Supports:
// - /api/allocations?employee=<id>
// - /api/allocations?employeeId=<id>
router.get(
  "/",
  protect,
  authorize("Admin", "HR", "Manager", "Employee"),
  getMyAllocations
);

// 🔹 Logged‑in employee (My Profile)
// /api/allocations/me
router.get(
  "/me",
  protect,
  authorize("Employee"),
  (req, res) => {
    req.query.employee = req.user.id;
    return getMyAllocations(req, res);
  }
);

/* =========================================================
   ✅ UTILIZATION SUMMARY
========================================================= */

// /api/allocations/utilization?employee=&month=&year=
router.get(
  "/utilization",
  protect,
  authorize("Admin", "HR", "Manager", "Employee"),
  getUtilizationSummary
);

// GET /api/allocations/month?month=3&year=2026
router.get(
  "/month",
  protect,
  authorize("Admin", "HR", "Manager"),
  getMonthlyAllocations
);

export default router;
