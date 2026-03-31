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

    // ✅ HOURS (1 FTE = 160 hrs)
    fte: {
      type: Number,
      required: true,
      min: 1,
      max: 160,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    isBillable: {
      type: Boolean,
      default: true,
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

/* =========================================================
   🔒 DATA INTEGRITY RULES
========================================================= */
allocationSchema.pre("validate", async function () {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);

  // ❌ Prevent multi-month allocations
  if (
    start.getUTCMonth() !== end.getUTCMonth() ||
    start.getUTCFullYear() !== end.getUTCFullYear()
  ) {
    throw new Error("Allocation cannot span multiple months");
  }

  // ❌ Prevent mismatch between month/year and dates
  if (
    start.getUTCMonth() + 1 !== this.month ||
    start.getUTCFullYear() !== this.year
  ) {
    throw new Error("month/year must match Start Date");
  }
});

// ✅ Prevent duplicate allocations for same month/project
allocationSchema.index(
  { employee: 1, project: 1, month: 1, year: 1 },
  { unique: true }
);

export default mongoose.model("Allocation", allocationSchema);