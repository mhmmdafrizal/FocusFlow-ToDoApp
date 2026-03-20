"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodo } from "../app/actions/todo-actions";

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTodo,

    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });
}