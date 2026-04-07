import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    primaryWorkCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkCategory",
      required: true,
    },

    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    hourlyCost: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    /* ================= NEW HR FIELDS ================= */

    joiningDate: {
      type: Date,
      required: false,
    },

    location: {
      type: String,
      trim: true,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);