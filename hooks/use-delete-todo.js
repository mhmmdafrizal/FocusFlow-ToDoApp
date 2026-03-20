"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../app/actions/todo-actions";

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,

    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
}