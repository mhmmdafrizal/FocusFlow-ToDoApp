import { create } from "zustand";

export const useTodoStore = create((set) => ({
  todos: [],

  setTodos: (todos) => set({ todos }),

  addTodo: (todo) =>
    set((state) => ({
      todos: [todo, ...state.todos],
    })),
}));