import mongoose from "mongoose";

const employeeSkillSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },

    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
  },
  { timestamps: true }
);

// Prevent duplicate mapping
employeeSkillSchema.index({ employeeId: 1, skillId: 1 }, { unique: true });

export default mongoose.model("EmployeeSkill", employeeSkillSchema);