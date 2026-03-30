import express from "express";
import {
  generateBilling,
  getBilling
} from "../controllers/billingController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- READ ---------------- */
router.get("/", protect, authorize("Admin", "HR", "Manager"), getBilling);

/* ---------------- GENERATE ---------------- */
router.post("/generate", protect, authorize("Admin", "HR"), generateBilling);

export default router;