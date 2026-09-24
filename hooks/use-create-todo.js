"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTodo } from "../app/actions/todo-actions";

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const res = await addTodo(formData);

      if (!res.success) {
        throw new Error(res.error);
      }

      return res.data;
    },

    onSuccess: () => {
      // 🔥 REFETCH TODOS
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}