import express from "express";
import {
  getEmployees,
  getOne,
  getProfile,
  createEmployee,
  update,
  remove
} from "../controllers/employeeController.js";

import {
  getMyAllocations,
  getActiveAllocations,
  getUtilization
} from "../controllers/allocationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- PUBLIC ---------------- */
router.post("/seed_admin", createEmployee);

/* ---------------- CREATE ---------------- */
router.post("/", protect, authorize("Admin", "HR"), createEmployee);

/* ---------------- READ ---------------- */
router.get("/", protect, authorize("Admin", "HR", "Manager"), getEmployees);

// ✅ Logged-in user profile
router.get("/me", protect, getProfile);

/* ---------------- SELF ALLOCATION ---------------- */

// Inject employeeId from token
router.get("/allocations", protect, authorize("Employee"), (req, res) => {
  req.params.employeeId = req.user.id;
  return getMyAllocations(req, res);
});

router.get("/allocations/active", protect, authorize("Employee"), (req, res) => {
  req.params.employeeId = req.user.id;
  return getActiveAllocations(req, res);
});

router.get("/allocations/utilization", protect, authorize("Employee"), (req, res) => {
  req.params.employeeId = req.user.id;
  return getUtilization(req, res);
});

/* ---------------- ADMIN / HR / MANAGER ---------------- */
router.get("/:id/allocations", protect, authorize("Admin", "HR", "Manager"), getOne);

router.patch("/:id", protect, authorize("Admin", "HR"), update);

router.delete("/:id", protect, authorize("Admin"), remove);

/* ---------------- SINGLE ---------------- */
router.get("/:id", protect, authorize("Admin", "HR", "Manager", "Employee"), getOne);

export default router;