import express from "express";
import {
  submitTimesheet,
  approveTimesheet,
  rejectTimesheet,
  getTimesheetHistory
} from "../controllers/timesheetController.js";

import {
  protect,
  employeeOnly,
  adminOrHROnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee submits
router.post("/submit", protect, employeeOnly, submitTimesheet);

// HR / Admin approves
router.put("/approve/:id", protect, adminOrHROnly, approveTimesheet);

// HR / Admin rejects
router.put("/reject/:id", protect, adminOrHROnly, rejectTimesheet);

// Timesheet history
router.get("/", protect, adminOrHROnly, getTimesheetHistory);

export default router;