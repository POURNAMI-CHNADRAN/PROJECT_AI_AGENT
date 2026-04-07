import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    workCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkCategory",
      required: true,
    },

    month: {
      type: Number,
      required: true, // 1–12
    },

    year: {
      type: Number,
      required: true,
    },

    allocatedHours: {
      type: Number,
      required: true,
    },

    isBillable: {
      type: Boolean,
      default: true,
    },

    // ✅ snapshot for historical accuracy
    rateSnapshot: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Allocation", allocationSchema);