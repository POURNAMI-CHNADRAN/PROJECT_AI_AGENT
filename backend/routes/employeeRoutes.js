import express from "express";
import {
  getProfile,
  getAllEmployees,
  getEmployees,
  getOne,
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

/*
|--------------------------------------------------------------------------
|  SEED ADMIN (first user) - PUBLIC
|--------------------------------------------------------------------------
*/
router.post("/seed_admin", createEmployee);

/*
|--------------------------------------------------------------------------
|  CREATE EMPLOYEE  (Admin, HR)
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  protect,
  authorize("Admin", "HR"),
  createEmployee
);

/*
|--------------------------------------------------------------------------
|  GET ALL EMPLOYEES (Admin, HR, Manager)
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  protect,
  authorize("Admin", "HR", "Manager"),
  getAllEmployees
);

/*
|--------------------------------------------------------------------------
|  GET LOGGED-IN EMPLOYEE PROFILE
|--------------------------------------------------------------------------
*/
router.get(
  "/me",
  protect,
  getEmployees
);

/*
|--------------------------------------------------------------------------
|  🔥 EMPLOYEE ALLOCATION ROUTES (PUT BEFORE :id)
|--------------------------------------------------------------------------
*/

// ✅ Get all allocations of logged-in employee
router.get(
  "/allocations",
  protect,
  authorize("Employee"),
  getMyAllocations
);

// ✅ Get ACTIVE allocations
router.get(
  "/allocations/active",
  protect,
  authorize("Employee"),
  getActiveAllocations
);

// ✅ Get utilization %
router.get(
  "/allocations/utilization",
  protect,
  authorize("Employee"),
  getUtilization
);

/*
|--------------------------------------------------------------------------
|  GET SINGLE EMPLOYEE BY ID
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  protect,
  getOne
);

/*
|--------------------------------------------------------------------------
|  UPDATE EMPLOYEE
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id",
  protect,
  authorize("Admin", "HR", "Employee"),
  update
);

/*
|--------------------------------------------------------------------------
|  DELETE EMPLOYEE
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  remove
);

export default router;