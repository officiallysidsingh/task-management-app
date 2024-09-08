import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add the task's title"],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      required: [true, "Please add the task's status"],
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model("Task", taskSchema);
