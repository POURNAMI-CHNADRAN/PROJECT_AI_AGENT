import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getPayrollByEmployee } from "../controllers/payrollController.js";

const router = express.Router();

router.get("/:id", protect, getPayrollByEmployee);

export default router;