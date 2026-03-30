import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },

    total_hours: {
      type: Number,
      default: 0,
    },

    rate_per_hour: {
      type: Number,
      required: true,
    },

    total_revenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* 🔥 AUTO CALCULATE REVENUE */
billingSchema.pre("save", function (next) {
  this.total_revenue = this.total_hours * this.rate_per_hour;
  next();
});

/* 🔥 UNIQUE CONSTRAINT (VERY IMPORTANT) */
billingSchema.index(
  { employee_id: 1, project_id: 1, month: 1, year: 1 },
  { unique: true }
);

export default mongoose.model("Billing", billingSchema);
