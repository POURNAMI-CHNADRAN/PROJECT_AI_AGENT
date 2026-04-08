import express from "express";
import { createAllocation , 
  updateAllocation, 
  moveAllocation,
  getAllAllocations,
  getAllocationsByEmployee
} from "../controllers/allocationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("Admin", "Finance"),
  createAllocation
);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Finance"),
  updateAllocation
);

// PUT /api/allocations/:id/move
router.put(
  "/:id",
  protect,
  authorize("Admin", "Finance"),
  moveAllocation
);

router.get("/", getAllAllocations);

router.get("/by-employee", getAllocationsByEmployee);

export default router;