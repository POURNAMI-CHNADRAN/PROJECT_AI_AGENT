import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("Admin", "Finance"),
  createEmployee
);

router.get(
  "/",
  protect,
  authorize("Admin", "Finance", "Manager"),
  getEmployees
);

router.get(
  "/:id",
  protect,
  authorize("Admin", "Finance", "Manager"),
  getEmployeeById
);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Finance"),
  updateEmployee
);

router.delete(
  "/:id",
  protect,
  authorize("Admin", "Finance"),
  deleteEmployee
);

export default router;