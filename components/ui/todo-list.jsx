"use client";

import { useState } from "react";
import { useGetTodos } from "../../hooks/use-get-todos";
import { useTodoStore } from "../../store/todo-store";
import { useDeleteTodo } from "../../hooks/use-delete-todo";
import { useToggleTodo } from "../../hooks/use-toggle-todo";

import { Trash2, CheckCircle2, Circle, ClipboardList } from "lucide-react";

// ── Skeleton loader ──────────────────────────────────────────────
function SkeletonItem() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-amber-100 animate-pulse">
      <div className="w-5 h-5 rounded-full bg-amber-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded-full bg-amber-100" />
        <div className="h-2.5 w-1/2 rounded-full bg-amber-50" />
      </div>
      <div className="w-7 h-7 rounded-xl bg-amber-50" />
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────
function EmptyState({ filter }) {
  const messages = {
    all:       { icon: "✦", title: "No tasks yet", sub: "Add your first task using the form on the left." },
    active:    { icon: "◈", title: "All caught up!", sub: "No active tasks remaining — great work." },
    completed: { icon: "◉", title: "Nothing completed yet", sub: "Finish a task and it will appear here." },
  };
  const { icon, title, sub } = messages[filter];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-3xl text-amber-300 mb-3">{icon}</span>
      <p className="text-sm font-semibold text-[#5c3d1e]">{title}</p>
      <p className="text-xs text-[#9b7050]/70 mt-1 max-w-[220px]">{sub}</p>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function TodoList() {
  const { isLoading }             = useGetTodos();
  const todos                     = useTodoStore((state) => state.todos);
  const { mutate: deleteMutate }  = useDeleteTodo();
  const { mutate: toggleMutate }  = useToggleTodo();
  const [filter, setFilter]       = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active")    return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const counts = {
    all:       todos.length,
    active:    todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) =>  t.completed).length,
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteMutate(id);
      setDeletingId(null);
    }, 300);
  };

  return (
    <div
      className="
        w-full relative overflow-hidden
        bg-white/70 backdrop-blur-xl
        border border-amber-200/50
        shadow-[0_8px_32px_rgba(45,31,14,0.10)]
        rounded-2xl
        transition-shadow duration-300
        hover:shadow-[0_12px_40px_rgba(45,31,14,0.14)]
      "
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70 rounded-t-2xl" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-amber-200/20 blur-2xl" />

      {/* ── Card Header ── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200/60 flex items-center justify-center text-amber-500 shadow-sm">
            <ClipboardList size={14} />
          </span>
          <h2 className="font-['Fraunces',Georgia,serif] text-xl font-semibold text-[#2d1f0e] tracking-tight">
            Task Board
          </h2>
        </div>

        {/* Count pill */}
        <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-500">
          {counts[filter]} {filter}
        </span>
      </div>

      {/* ── Filter tabs ── */}
      <div className="px-6 pb-4">
        <div className="flex gap-1 p-1 bg-[rgba(45,31,14,0.05)] rounded-xl w-fit">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`
                relative px-4 py-1.5 rounded-lg text-xs font-semibold capitalize
                transition-all duration-200
                ${filter === type
                  ? "bg-white text-[#2d1f0e] shadow-sm shadow-amber-100/80"
                  : "text-[#9b7050] hover:text-[#5c3d1e]"
                }
              `}
            >
              {type}
              {counts[type] > 0 && (
                <span
                  className={`
                    ml-1.5 text-[10px] font-bold tabular-nums
                    ${filter === type ? "text-amber-500" : "text-[#9b7050]/60"}
                  `}
                >
                  {counts[type]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-6 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent mb-2" />

      {/* ── List body ── */}
      <div className="px-4 pb-5 flex flex-col gap-2.5 max-h-[520px] overflow-y-auto
                      scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">

        {/* Loading skeletons */}
        {isLoading && (
          <div className="flex flex-col gap-2.5 pt-2">
            {[1, 2, 3].map((i) => <SkeletonItem key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredTodos.length === 0 && (
          <EmptyState filter={filter} />
        )}

        {/* Todo items */}
        {!isLoading && filteredTodos.map((todo, i) => (
          <div
            key={todo._id}
            style={{ animationDelay: `${i * 60}ms` }}
            className={`
              group flex items-start gap-3.5 px-4 py-3.5
              rounded-xl border
              transition-all duration-300 ease-out
              animate-[fadeSlideIn_0.35s_ease_both]
              ${deletingId === todo._id
                ? "opacity-0 scale-95 translate-x-2"
                : "opacity-100"
              }
              ${todo.completed
                ? "bg-[#f9f6f1]/60 border-amber-100/60"
                : "bg-white/80 border-amber-200/40 hover:border-amber-300/70 hover:shadow-[0_4px_16px_rgba(45,31,14,0.08)] hover:translate-x-0.5"
              }
            `}
          >
            {/* Completed left bar */}
            {todo.completed && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full bg-emerald-400" />
            )}

            {/* Checkbox toggle */}
            <button
              onClick={() => toggleMutate(todo._id)}
              className="mt-0.5 flex-shrink-0 transition-transform duration-150 hover:scale-110 active:scale-95"
              aria-label="Toggle complete"
            >
              {todo.completed
                ? <CheckCircle2 size={20} className="text-emerald-500" />
                : <Circle size={20} className="text-[#c9a882] hover:text-amber-400 transition-colors duration-150" />
              }
            </button>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p
                className={`
                  text-sm font-semibold leading-snug truncate
                  transition-all duration-200
                  ${todo.completed
                    ? "line-through text-[#9b7050]/60"
                    : "text-[#2d1f0e]"
                  }
                `}
              >
                {todo.text}
              </p>

              {todo.description && (
                <p
                  className={`
                    text-xs mt-0.5 leading-relaxed line-clamp-2
                    ${todo.completed ? "text-[#9b7050]/40" : "text-[#9b7050]/80"}
                  `}
                >
                  {todo.description}
                </p>
              )}
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(todo._id)}
              aria-label="Delete task"
              className="
                flex-shrink-0 opacity-0 group-hover:opacity-100
                w-7 h-7 rounded-lg flex items-center justify-center
                text-[#9b7050]/60 hover:text-red-500
                hover:bg-red-50 border border-transparent hover:border-red-100
                transition-all duration-150
              "
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Footer progress bar ── */}
      {todos.length > 0 && !isLoading && (
        <div className="px-6 pb-5 pt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#9b7050]/60">
              Progress
            </span>
            <span className="text-[10px] font-bold text-amber-500 tabular-nums">
              {counts.completed}/{counts.all}
            </span>
          </div>
          <div className="h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(counts.completed / counts.all) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}