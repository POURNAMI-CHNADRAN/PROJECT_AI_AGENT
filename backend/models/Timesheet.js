import mongoose from "mongoose";

const timesheetSchema = new mongoose.Schema(
  {
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
    story_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true
    },

    story_points_completed: { type: Number, required: true },

    work_date: { type: Date, required: true },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },

    audit: {
      created_by: String,
      updated_by: String
    }
  },
  { timestamps: true }
);

// Prevent duplicates: same employee + story + date
timesheetSchema.index(
  { employee_id: 1, story_id: 1, work_date: 1 },
  { unique: true }
);

export default mongoose.model("Timesheet", timesheetSchema);