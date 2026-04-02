import SkillMapping from "../models/SkillMapping.js";
import { normalize } from "../utils/Normalize.js";

/* GET */
export const getMappings = async (req, res) => {
  const data = await SkillMapping.find().populate("skillId");
  res.json(data);
};

/* CREATE */
export const createMapping = async (req, res) => {
  try {
    const { externalName, skillId } = req.body;

    if (!externalName || !skillId) {
      return res.status(400).json({ message: "All Fields Required" });
    }

    const normalized = normalize(externalName);

    const exists = await SkillMapping.findOne({
      normalizedExternalName: normalized,
    });

    if (exists) {
      return res.status(400).json({
        message: "Mapping Already Exists",
      });
    }

    const mapping = await SkillMapping.create({
      externalName,
      normalizedExternalName: normalized,
      skillId,
    });

    res.status(201).json(mapping);
  } catch (err) {
    res.status(500).json({ message: "Failed to Create Mapping" });
  }
};

/* DELETE */
export const deleteMapping = async (req, res) => {
  await SkillMapping.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};