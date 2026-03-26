import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    billingModel: {
      type: String,
      enum: ["Billable", "Non-Billable"],
      required: true,
      default: "Non-Billable",
    },

    billingRate: { type: Number, min: 0 },

    startDate: { type: Date, required: true },
    endDate: { type: Date },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ON_HOLD"],
      default: "ACTIVE",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee"
    }
  },
  { timestamps: true }
);


export default mongoose.model("Project", projectSchema);