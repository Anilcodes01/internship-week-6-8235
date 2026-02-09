import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    tags: [String],
    priority: { type: Number, default: 1 },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
