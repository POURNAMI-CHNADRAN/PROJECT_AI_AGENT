import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    type: {
      type: String,
      enum: ["Billable", "Non-Billable"],
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

    endDate: Date,

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ON_HOLD"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);