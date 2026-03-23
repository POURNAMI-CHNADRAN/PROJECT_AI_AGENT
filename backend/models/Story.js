import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  story_points: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    default: "TODO"
  },
  assigned_employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  }
}, { timestamps: true });

export default mongoose.model("Story", storySchema);