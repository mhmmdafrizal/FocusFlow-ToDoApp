"use client";

import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../app/actions/todo-actions";
import { useTodoStore } from "../store/todo-store";

export function useGetTodos() {
  const setTodos = useTodoStore((state) => state.setTodos);

  return useQuery({
    queryKey: ["todos"],

    queryFn: async () => {
      const res = await getTodos();

      if (!res.success) {
        throw new Error(res.error);
      }

      setTodos(res.data); // Zustand sync

      return res.data;
    },

    staleTime: 0, // always fresh
    refetchOnWindowFocus: true,
  });
}