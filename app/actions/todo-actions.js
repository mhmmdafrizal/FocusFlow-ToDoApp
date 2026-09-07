"use server";

import { connectDB } from "../../lib/db";
import { todoSchema } from "../../validations/todo-schema";

export async function addTodo(formData) {
  try {
    const sql = await connectDB();

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
    const rows = await sql`
      INSERT INTO todos (text, description)
      VALUES (${validatedData.text}, ${validatedData.description ?? ""})
      RETURNING id, text, description, completed, created_at, updated_at
    `;
    const row = rows[0];

    return {
      success: true,
      message: "Todo added successfully",
      data: { _id: row.id, text: row.text, description: row.description, completed: row.completed },
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
    const sql = await connectDB();

    const rows = await sql`
      SELECT id, text, description, completed
      FROM todos
      ORDER BY created_at DESC, id DESC
    `;

    return {
      success: true,
      data: rows.map((r) => ({
        _id: r.id,
        text: r.text,
        description: r.description,
        completed: r.completed,
      })),
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
    const sql = await connectDB();
    await sql`DELETE FROM todos WHERE id = ${id}::int`;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function toggleTodo(id) {
  try {
    const sql = await connectDB();
    await sql`
      UPDATE todos
      SET completed = NOT completed, updated_at = NOW()
      WHERE id = ${id}::int
    `;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}