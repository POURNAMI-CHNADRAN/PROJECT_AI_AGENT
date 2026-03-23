import mongoose from "mongoose";

const timesheetSchema = new mongoose.Schema({
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
  work_date: {
    type: Date,
    required: true
  },
  story_points_completed: {
    type: Number,
    default: 0,
    min: 0
  },
  billable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Timesheet", timesheetSchema);