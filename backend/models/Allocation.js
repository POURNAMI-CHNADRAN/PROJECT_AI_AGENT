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

    // ✅ DERIVED — NOT USER INPUT
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
   🔒 DATA INTEGRITY — MONTHLY ALLOCATION GUARANTEE
========================================================= */
allocationSchema.pre("validate", function () {
  // ✅ Derive dates from month/year EVERY time
  this.startDate = new Date(this.year, this.month - 1, 1);
  this.endDate = new Date(this.year, this.month, 0);

  // ✅ Safety (defensive)
  if (
    this.startDate.getMonth() !== this.endDate.getMonth() ||
    this.startDate.getFullYear() !== this.endDate.getFullYear()
  ) {
    throw new Error("Allocation cannot span multiple months");
  }

  // ✅ Ensure perfect alignment
  if (
    this.startDate.getMonth() + 1 !== this.month ||
    this.startDate.getFullYear() !== this.year
  ) {
    throw new Error("Allocation month/year mismatch");
  }
});

/* =========================================================
   ✅ INDEXES
========================================================= */

// ✅ Prevent duplicate allocations per month
allocationSchema.index(
  { employee: 1, project: 1, month: 1, year: 1 },
  { unique: true }
);

// ✅ Faster lookups
allocationSchema.index({ project: 1 });
allocationSchema.index({ employee: 1, month: 1, year: 1 });

export default mongoose.model("Allocation", allocationSchema);
