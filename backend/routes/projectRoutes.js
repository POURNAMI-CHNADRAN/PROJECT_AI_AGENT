import express from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove
} from "../controllers/projectController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// VIEW PROJECTS
router.get("/", protect, authorize("Admin", "HR", "Employee"), getAll);

// GET SINGLE PROJECT
router.get("/:id", protect, authorize("Admin", "HR", "Employee"), getOne);

// CREATE
router.post("/", protect, authorize("Admin", "HR"), create);

// UPDATE
router.patch("/:id", protect, authorize("Admin", "HR"), update);

// DELETE
router.delete("/:id", protect, authorize("Admin"), remove);

export default router;
