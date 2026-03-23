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

export default mongoose.model("Billing", billingSchema);