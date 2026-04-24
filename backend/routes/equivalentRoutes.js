import express from "express";
import {
  create,
  getAll,
  getAssignedStories,
  getOne,
  update,
  remove,
} from "../controllers/equivalentController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE */
router.post("/", protect, authorize("Admin", "Finance"), create);

/* LIST */
router.get(
  "/",
  protect,
  authorize("Admin", "Finance"),
  getAll
);

/* EMPLOYEE ASSIGNED */
router.get(
  "/assigned",
  protect,
  authorize("Employee"),
  getAssignedStories
);

/* GET ONE */
router.get(
  "/:id",
  protect,
  authorize("Admin", "Finance", "Employee"),
  getOne
);

/* UPDATE */
router.put(
  "/:id",
  protect,
  authorize("Admin", "Finance", "Employee"),
  update
);

/* DELETE */
router.delete(
  "/:id",
  protect,
  authorize("Admin", "Finance"),
  remove
);

export default router;