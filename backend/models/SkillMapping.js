import mongoose from "mongoose";

const skillMappingSchema = new mongoose.Schema(
  {
    externalName: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedExternalName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ SINGLE INDEX (clean + controlled)
skillMappingSchema.index(
  { normalizedExternalName: 1 },
  { unique: true }
);

export default mongoose.model("SkillMapping", skillMappingSchema);