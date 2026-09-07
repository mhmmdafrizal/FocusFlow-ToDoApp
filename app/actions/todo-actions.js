"use server";

import { connectDB } from "../../lib/db";
import { todoSchema } from "../../validations/todo-schema";

export async function addTodo(formData) {
  try {
    const db = connectDB();

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
    const result = db
      .prepare(
        "INSERT INTO todos (text, description, completed, updated_at) VALUES (?, ?, 0, datetime('now'))"
      )
      .run(validatedData.text, validatedData.description ?? "");

    const todo = db
      .prepare(
        "SELECT id AS _id, text, description, completed, created_at, updated_at FROM todos WHERE id = ?"
      )
      .get(result.lastInsertRowid);

    return {
      success: true,
      message: "Todo added successfully",
      data: {
        ...todo,
        completed: !!todo.completed,
      },
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
    const db = connectDB();

    const todos = db
      .prepare(
        "SELECT id AS _id, text, description, completed, created_at, updated_at FROM todos ORDER BY created_at DESC, id DESC"
      )
      .all()
      .map((todo) => ({ ...todo, completed: !!todo.completed }));

    return {
      success: true,
      data: todos,
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
    const db = connectDB();
    db.prepare("DELETE FROM todos WHERE id = ?").run(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function toggleTodo(id) {
  try {
    const db = connectDB();
    db.prepare(
      "UPDATE todos SET completed = 1 - completed, updated_at = datetime('now') WHERE id = ?"
    ).run(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
