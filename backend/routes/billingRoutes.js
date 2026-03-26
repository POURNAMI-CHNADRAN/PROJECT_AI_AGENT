import express from "express";
import {
  generateBilling,
  getProjectBilling,
  getEmployeeBilling,
  getTotalRevenue, 
  regenerateBilling, 
  getAllBilling
} from "../controllers/billingController.js";

const router = express.Router();

router.post("/generate", generateBilling);
router.get("/project/:id", getProjectBilling);
router.get("/employee/:id", getEmployeeBilling);
router.get("/revenue", getTotalRevenue);
router.put("/regenerate", regenerateBilling);
router.get("/all", getAllBilling);

export default router;