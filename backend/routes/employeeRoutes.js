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
|  GET LOGGED-IN EMPLOYEE / SELF PROFILE  (Any logged-in user)
|  GET /api/employees/me
|--------------------------------------------------------------------------
*/
router.get(
  "/me",
  protect,
  getEmployees
);


/*
|--------------------------------------------------------------------------
|  GET SINGLE EMPLOYEE BY ID
|  Allowed for Admin, HR, Employee (only own), Manager (only team)
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
|  Admin can update all
|  HR cannot update Admin
|  Employee can update only own limited fields
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
|  SOFT DELETE EMPLOYEE (Inactive)
|  ONLY Admin can delete
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  remove
);

export default router;