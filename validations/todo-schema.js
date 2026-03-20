import { z } from "zod";

export const todoSchema = z.object({
  text: z.string().min(1, "Title is required"),

  description: z
    .string()
    .max(200, "Too long")
    .optional(),

  completed: z.boolean().optional(),
});