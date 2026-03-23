import Skill from "../models/Skill.js";

export const createSkill = async (req, res) => {
  try {
    const { name, skill_name, category } = req.body;

    const finalName = name || skill_name;

    console.log("FINAL NAME:", finalName); // 🔥 debug

    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required",
      });
    }

    const existing = await Skill.findOne({ name: finalName });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `${finalName} already exists`,
      });
    }

    const skill = await Skill.create({
      name: finalName,
      category,
    });

    res.json({ success: true, data: skill });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSkills = async (req, res) => {
  const skills = await Skill.find().sort({ name: 1 });
  res.json({ success: true, data: skills });
};

export const deleteSkill = async (req, res) => {
  await Skill.findByIdAndUpdate(req.params.id);
  res.json({ success: true, message: "Skill Deleted" });

  const assigned = await EmployeeSkill.find({ skillId: req.params.id });

  if (assigned.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot Delete Skill. It is assigned to Employees."
  });
}
};