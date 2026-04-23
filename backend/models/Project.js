import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

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

    billingRate: { type: Number, min: 0 },

    billingModel: {
      type: String,
      enum: ["Hourly", "Fixed"],
      default: "Hourly",
    },

    fixedMonthlyRevenue: { type: Number, min: 0, default: 0 },

    startDate: { type: Date, required: true },
    endDate: Date,

    // ✅ Lifecycle
    status: {
      type: String,
      enum: ["PLANNED", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
      default: "PLANNED",
    },

    // ✅ Capacity Governance Flags
    allowAllocations: { type: Boolean, default: false },
    allowMoves: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ✅ Status → Behavior Mapping */
projectSchema.pre("save", function () {
  if (this.status === "ACTIVE") {
    this.allowAllocations = true;
    this.allowMoves = true;
  } else if (this.status === "ON_HOLD") {
    this.allowAllocations = false;
    this.allowMoves = true; // move OUT allowed
  } else {
    this.allowAllocations = false;
    this.allowMoves = false;
  }
});

export default mongoose.model("Project", projectSchema);