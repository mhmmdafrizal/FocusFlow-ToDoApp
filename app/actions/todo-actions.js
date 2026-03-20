"use server";

import { connectDB } from "../../lib/db";
import { Todo } from "../../models/todo";
import { todoSchema } from "../../validations/todo-schema";

export async function addTodo(formData) {
  try {
    await connectDB();

    // 🔹 get data from form
    const text = formData.get("text");
    const description = formData.get("description");

    // 🔹 validate using zod
    const validatedData = todoSchema.parse({
      text,
      description,
      completed: false,
    });

    // 🔹 save to DB
    const newTodo = await Todo.create(validatedData);

    // 🔹 return clean data
    return {
      success: true,
      message: "Todo added successfully",
      data: JSON.parse(JSON.stringify(newTodo)),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
export async function getTodos() {
  try {
    await connectDB();

    const todos = await Todo.find().sort({ createdAt: -1 });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(todos)),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
export async function deleteTodo(id) {
  try {
    await connectDB();

    await Todo.findByIdAndDelete(id);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function toggleTodo(id) {
  try {
    await connectDB();

    const todo = await Todo.findById(id);

    todo.completed = !todo.completed;
    await todo.save();

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}