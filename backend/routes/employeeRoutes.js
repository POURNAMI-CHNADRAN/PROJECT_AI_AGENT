import express from "express";
import {
  getEmployees,
  getOne,
  getProfile,
  createEmployee,
  update,
  remove,
} from "../controllers/employeeController.js";

import {
  getMyAllocations,
  // getActiveAllocations,
  getUtilizationSummary,
} from "../controllers/allocationController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   ✅ PUBLIC
========================================================= */
router.post("/seed_admin", createEmployee);

/* =========================================================
   ✅ CREATE
========================================================= */
router.post("/", protect, authorize("Admin", "HR"), createEmployee);

/* =========================================================
   ✅ READ
========================================================= */
router.get("/", protect, authorize("Admin", "HR", "Manager"), getEmployees);

// Logged‑in user profile
router.get("/me", protect, getProfile);

/* =========================================================
   ✅ SELF (EMPLOYEE VIEW)
========================================================= */

// My allocations
router.get("/me/allocations", protect, authorize("Employee"), (req, res) => {
  req.query.employee = req.user.id;
  return getMyAllocations(req, res);
});

// // My active allocations
// router.get("/me/allocations/active", protect, authorize("Employee"), (req, res) => {
//   req.query.employee = req.user.id;
//   return getActiveAllocations(req, res);
// });

// ✅ My utilization (MONTH REQUIRED)
router.get("/me/utilization", protect, authorize("Employee"), (req, res) => {
  req.query.employee = req.user.id;
  return getUtilizationSummary(req, res);
});

/* =========================================================
   ✅ ADMIN / HR / MANAGER
========================================================= */

// Get allocations of a specific employee
router.get(
  "/:id/allocations",
  protect,
  authorize("Admin", "HR", "Manager"),
  (req, res) => {
    req.query.employee = req.params.id;
    return getMyAllocations(req, res);
  }
);

// Get utilization summary of a specific employee
router.get(
  "/:id/utilization",
  protect,
  authorize("Admin", "HR", "Manager"),
  (req, res) => {
    req.query.employee = req.params.id;
    return getUtilizationSummary(req, res);
  }
);

/* =========================================================
   ✅ EMPLOYEE CRUD
========================================================= */
router.patch("/:id", protect, authorize("Admin", "HR"), update);

router.delete("/:id", protect, authorize("Admin"), remove);

// Get employee by id (profile view)
router.get(
  "/:id",
  protect,
  authorize("Admin", "HR", "Manager", "Employee"),
  getOne
);

export default router;
