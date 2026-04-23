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
      default: 0,
      min: 0,
      max: 160,
    },

    allocationFTE: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    isBillable: {
      type: Boolean,
      default: true,
    },

    billingType: {
      type: String,
      enum: ["Billable", "Shadow", "Non-Billable"],
      default: "Billable",
    },

    startDate: {
      type: Date,
      required: false,
    },

    endDate: {
      type: Date,
      required: false,
    },

    // ✅ snapshot for historical accuracy
    rateSnapshot: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

allocationSchema.pre("validate", function () {
  if ((!this.allocatedHours || this.allocatedHours === 0) && this.allocationFTE > 0) {
    this.allocatedHours = Number((this.allocationFTE * 160).toFixed(2));
  }

  if ((!this.allocationFTE || this.allocationFTE === 0) && this.allocatedHours > 0) {
    this.allocationFTE = Number((this.allocatedHours / 160).toFixed(4));
  }

  if (this.billingType === "Billable") {
    this.isBillable = true;
  } else {
    this.isBillable = false;
  }
});
export default mongoose.model("Allocation", allocationSchema);