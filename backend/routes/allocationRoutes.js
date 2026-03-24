import express from "express";
import {
  createAllocation,
  getAllocations,
  getAllocationById,
  updateAllocation,
  deleteAllocation,
} from "../controllers/allocationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin + HR
router.post("/", protect, authorize("Admin", "HR"), createAllocation);

// All roles
router.get("/", protect, authorize("Admin", "HR", "Employee"), getAllocations);

// All roles (with restriction inside)
router.get("/:id", protect, authorize("Admin", "HR", "Employee"), getAllocationById);

// Admin + HR
router.patch("/:id", protect, authorize("Admin", "HR"), updateAllocation);

// Admin only
router.delete("/:id", protect, authorize("Admin"), deleteAllocation);

export default router;