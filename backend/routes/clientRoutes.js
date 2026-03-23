import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin + HR can manage clients
router.post("/", protect, authorize("Admin", "HR"), createClient);
router.patch("/:id", protect, authorize("Admin", "HR"), updateClient);
router.delete("/:id", protect, authorize("Admin"), deleteClient);

// Everyone can view clients
router.get("/", protect, authorize("Admin", "HR", "Manager", "Employee"), getClients);
router.get("/:id", protect, authorize("Admin", "HR", "Manager", "Employee"), getClientById);

export default router;