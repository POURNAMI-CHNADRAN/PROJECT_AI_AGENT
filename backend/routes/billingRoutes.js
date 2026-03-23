import express from "express";
import {
  generateBilling,
  getProjectBilling,
  getEmployeeBilling,
  getTotalRevenue
} from "../controllers/billingController.js";

const router = express.Router();

router.post("/generate", generateBilling);
router.get("/project/:id", getProjectBilling);
router.get("/employee/:id", getEmployeeBilling);
router.get("/revenue", getTotalRevenue);

export default router;