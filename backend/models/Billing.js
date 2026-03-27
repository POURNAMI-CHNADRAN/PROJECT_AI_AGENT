import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  billing_month: {
    type: Date,
    required: true
  },
  story_points_completed: {
    type: Number,
    default: 0
  },
  billing_rate_per_point: {
    type: Number,
    required: true
  },
  total_revenue: {
    type: Number
  }
}, { timestamps: true });

/* ✅ PREVENT DUPLICATE BILLING */
billingSchema.index(
  { employee_id: 1, project_id: 1, billing_month: 1 },
  { unique: true }
);

billingSchema.pre("save", function (next) {
  this.total_revenue =
    (this.story_points_completed || 0) * (this.billing_rate_per_point || 0);
  next();
});

export default mongoose.model("Billing", billingSchema);