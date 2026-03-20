import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Todo =
  mongoose.models.Todo || mongoose.model("Todo", todoSchema);