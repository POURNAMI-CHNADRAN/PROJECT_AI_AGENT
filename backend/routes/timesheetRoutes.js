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
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee submits
router.post("/submit", protect, submitTimesheet);

// Finance / Admin approves
router.put("/approve/:id", protect, approveTimesheet);

// Finance / Admin rejects
router.put("/reject/:id", protect, rejectTimesheet);

// Employee gets their own timesheets — REQUIRED for MyProfile.tsx
router.get("/employee/:id", protect, getTimesheetsByEmployee);

// Finance/Admin history
router.get("/", protect, getTimesheetHistory);

export default router;