import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // 🔥 FTE HOURS (NOT %)
    fte: {
      type: Number,
      required: true,
      min: 0,
      max: 160,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    isBillable: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["Under", "Optimal", "Over"],
      default: "Optimal",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// 🚨 Prevent duplicate allocation per month/project
allocationSchema.index(
  { employee: 1, project: 1, month: 1, year: 1 },
  { unique: true }
);

export default mongoose.model("Allocation", allocationSchema);