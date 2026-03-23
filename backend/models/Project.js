import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
    },
    billingModel: {
      type: String,
      enum: ["HOURLY", "FIXED"],
      required: true,
    },
    billingRate: {
      type: Number,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ON_HOLD"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);