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
    allocationPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    billingType: {
      type: String,
      enum: ["BILLABLE", "NON_BILLABLE", "SHADOW"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

allocationSchema.index({ employee: 1 });
allocationSchema.index({ project: 1 });
allocationSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model("Allocation", allocationSchema);
