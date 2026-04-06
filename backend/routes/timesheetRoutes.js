import express from "express";
import {
  submitTimesheet,
  approveTimesheet,
  rejectTimesheet,
  getTimesheetHistory,
  getTimesheetsByEmployee
} from "../controllers/timesheetController.js";

import {
  protect,
  employeeOnly,
  adminOrHROnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee submits
router.post("/submit", protect, employeeOnly, submitTimesheet);

// Finance / Admin approves
router.put("/approve/:id", protect, adminOrHROnly, approveTimesheet);

// Finance / Admin rejects
router.put("/reject/:id", protect, adminOrHROnly, rejectTimesheet);

// Employee gets their own timesheets — REQUIRED for MyProfile.tsx
router.get("/employee/:id", protect, getTimesheetsByEmployee);

// Finance/Admin history
router.get("/", protect, adminOrHROnly, getTimesheetHistory);

export default router;