import EmployeeSkill from "../models/EmployeeSkill.js";
import Employee from "../models/Employee.js";
import Skill from "../models/Skill.js";

// --------------------------------------
// ADD SKILL TO EMPLOYEE
// --------------------------------------
export const addEmployeeSkill = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { skillId, proficiency } = req.body;

    // Validate skill exists & active
    const skill = await Skill.findOne({ _id: skillId});
    if (!skill)
      return res.status(404).json({ message: "Skill not found or inactive" });

    // Check duplicate assignment
    const exists = await EmployeeSkill.findOne({ employeeId, skillId });
    if (exists)
      return res.status(400).json({ message: "Skill already assigned" });

    // Create mapping
    const mapping = await EmployeeSkill.create({
      employeeId,
      skillId,
      proficiency
    });

    const skillExists = await Skill.findById(skillId);
    if (!skillExists) {
      return res.status(404).json({
        success: false,
        message: "Skill does not Exist or was Deleted",
      });
    }

    res.json({ success: true, data: mapping });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


// --------------------------------------
// GET EMPLOYEE SKILLS
// --------------------------------------
export const getEmployeeSkills = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (
      req.user.role === "Employee" &&
      req.user.id.toString() !== employeeId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: You can only view your own skills",
      });
    }

    const skills = await EmployeeSkill.find({ employeeId })
      .populate("skillId", "name category");

    res.json({ success: true, data: skills });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// --------------------------------------
// REMOVE EMPLOYEE SKILL
// --------------------------------------
export const removeEmployeeSkill = async (req, res) => {
  await EmployeeSkill.findByIdAndDelete(req.params.mappingId);

  res.json({ success: true, message: "Skill Removed" });
};