import express from "express";
import {
  generateBilling,
  getBilling
} from "../controllers/billingController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------- READ ---------------- */
router.get("/", protect, authorize("Admin", "Finance", "Manager"), getBilling);

/* ---------------- GENERATE ---------------- */
router.post("/generate", protect, authorize("Admin", "Finance"), generateBilling);

export default router;