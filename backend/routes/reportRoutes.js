import express from "express";

import {
  getUtilization,
  dashboardSummary,
  revenueByProject,
  benchEmployees
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/utilization", getUtilization);
router.get("/dashboard", dashboardSummary);
router.get("/revenue-project", revenueByProject);
router.get("/bench", benchEmployees);

export default router;