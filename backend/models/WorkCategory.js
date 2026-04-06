import mongoose from "mongoose";

const workCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    /**
     * Defines what billing types are allowed
     * for this work category.
     *
     * Example:
     * DEVELOPMENT -> ["Billable"]
     * SUPPORT     -> ["Billable", "Non-Billable"]
     * INTERNAL    -> ["Non-Billable"]
     */
    
    allowedBillingTypes: {
      type: [String],
      enum: ["Billable", "Non-Billable"],
      required: true
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("WorkCategory", workCategorySchema);