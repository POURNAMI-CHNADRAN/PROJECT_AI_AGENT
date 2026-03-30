import express from "express";
import {
  createAllocation,
  getAllocations,
  updateAllocation,
  moveAllocation,
  deleteAllocation,
  getMyAllocations,
  getActiveAllocations,
  getUtilization
} from "../controllers/allocationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= CUSTOM ROUTES FIRST ================= */

router.get("/utilization", protect, getUtilization);

router.get("/active", protect, getActiveAllocations);

router.get("/me", protect, getMyAllocations);

router.post("/move", protect, authorize("Admin", "HR"), moveAllocation);

/* ================= CRUD ================= */

router.post("/", protect, authorize("Admin", "HR"), createAllocation);

router.get("/", protect, authorize("Admin", "HR", "Manager"), getAllocations);

router.patch("/:id", protect, authorize("Admin", "HR"), updateAllocation);

router.delete("/:id", protect, authorize("Admin"), deleteAllocation);

export default router;