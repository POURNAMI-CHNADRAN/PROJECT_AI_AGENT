import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getAllEmployees
} from "../controllers/employeeController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ CREATE — Admin & Finance ONLY
 */
router.post(
  "/",
  protect,
  authorize("Admin", "Finance"),
  createEmployee
);

/**
 * ✅ READ (ALL) — Admin, Finance, Manager
 */
router.get(
  "/",
  protect,
  authorize("Admin", "Finance", "Manager"),
  getEmployees
);

/**
 * ✅ READ (ONE) — Admin, Finance, Manager
 */
router.get(
  "/:_id",
  protect,
  authorize("Admin", "Finance", "Manager"),
  getEmployeeById
);

/**
 * ✅ UPDATE — Admin & Finance ONLY
 */
router.put(
  "/:_id",
  protect,
  authorize("Admin", "Finance"),
  updateEmployee
);

/**
 * ✅ DELETE — Admin & Finance ONLY
 */
router.delete(
  "/:_id",
  protect,
  authorize("Admin", "Finance"),
  deleteEmployee
);

router.get("/", protect, getAllEmployees);

export default router;