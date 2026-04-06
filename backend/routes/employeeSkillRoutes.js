import express from "express";
import {
  addEmployeeSkill,
  getEmployeeSkills,
  removeEmployeeSkill,
} from "../controllers/employeeskillController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import EmployeeSkill from "../models/EmployeeSkill.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  try {
    const skills = await EmployeeSkill.find({
      employeeId: req.user.id,
    }).populate("skillId", "name category");

    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// View skills → all roles allowed
router.get(
  "/:employeeId",
  protect,
  authorize("Admin", "Finance", "Manager", "Employee"),
  getEmployeeSkills
);


// Assign skills → Admin + Finance only
router.post(
  "/:employeeId",
  protect,
  authorize("Admin", "Finance"),
  addEmployeeSkill
);


// Remove skills → Admin + Finance only
router.delete(
  "/mapping/:mappingId",
  protect,
  authorize("Admin", "Finance"),
  removeEmployeeSkill
);

export default router;