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
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-sage-pale/60 border border-oat/70 animate-pulse">
      <div className="w-5 h-5 rounded-full bg-terra-pale flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded-full bg-terra-pale" />
        <div className="h-2.5 w-1/2 rounded-full bg-terra-pale/50" />
      </div>
      <div className="w-7 h-7 rounded-xl bg-terra-pale/50" />
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
      <span className="text-3xl text-terra/70 mb-3">{icon}</span>
      <p className="text-sm font-semibold text-forest-mid">{title}</p>
      <p className="text-xs text-forest-light/70 mt-1 max-w-[220px]">{sub}</p>
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
        bg-sage-pale/60 backdrop-blur-xl
        border border-oat/80
        shadow-[0_8px_32px_rgba(45,58,52,0.04)]
        rounded-2xl
        transition-shadow duration-300
        hover:shadow-[0_12px_40px_rgba(45,58,52,0.08)]
      "
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-terra to-transparent opacity-70 rounded-t-2xl" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-terra-pale/40 blur-2xl" />

      {/* ── Card Header ── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-terra-pale border border-terra/30 flex items-center justify-center text-terra shadow-sm">
            <ClipboardList size={14} />
          </span>
          <h2 className="font-serif text-xl font-semibold text-forest tracking-tight">
            Task Board
          </h2>
        </div>

        {/* Count pill */}
        <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-terra-pale border border-terra/30 text-terra">
          {counts[filter]} {filter}
        </span>
      </div>

      {/* ── Filter tabs ── */}
      <div className="px-6 pb-4">
        <div className="flex gap-1 p-1 bg-oat/50 rounded-xl w-fit">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`
                relative px-4 py-1.5 rounded-lg text-xs font-semibold capitalize
                transition-all duration-200
                ${filter === type
                  ? "bg-cream text-forest shadow-sm shadow-terra-pale"
                  : "text-forest-light hover:text-forest-mid"
                }
              `}
            >
              {type}
              {counts[type] > 0 && (
                <span
                  className={`
                    ml-1.5 text-[10px] font-bold tabular-nums
                    ${filter === type ? "text-terra" : "text-forest-light/60"}
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
      <div className="h-px mx-6 bg-gradient-to-r from-transparent via-terra/25 to-transparent mb-2" />

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
              group relative flex items-start gap-3.5 px-4 py-3.5
              rounded-xl border
              transition-all duration-300 ease-out
              animate-[fadeSlideIn_0.35s_ease_both]
              ${deletingId === todo._id
                ? "opacity-0 scale-95 translate-x-2"
                : "opacity-100"
              }
              ${todo.completed
                ? "bg-cream/40 border-oat"
                : "bg-cream/70 border-oat/70 hover:border-terra/40 hover:shadow-[0_4px_16px_rgba(45,58,52,0.08)] hover:translate-x-0.5"
              }
            `}
          >
            {/* Completed left bar */}
            {todo.completed && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full bg-sage" />
            )}

            {/* Checkbox toggle */}
            <button
              onClick={() => toggleMutate(todo._id)}
              className="mt-0.5 flex-shrink-0 transition-transform duration-150 hover:scale-110 active:scale-95"
              aria-label="Toggle complete"
            >
              {todo.completed
                ? <CheckCircle2 size={20} className="text-sage" />
                : <Circle size={20} className="text-forest-light/60 hover:text-terra transition-colors duration-150" />
              }
            </button>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p
                className={`
                  text-sm font-semibold leading-snug truncate
                  transition-all duration-200
                  ${todo.completed
                    ? "line-through text-forest-light/60 animate-strike"
                    : "text-forest"
                  }
                `}
              >
                {todo.text}
              </p>

              {todo.description && (
                <p
                  className={`
                    font-serif text-xs mt-0.5 leading-relaxed line-clamp-2
                    ${todo.completed ? "text-forest-light/40" : "text-forest-light/80"}
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
                text-forest-light/60 hover:text-red-500
                hover:bg-terra-pale border border-transparent hover:border-terra/30
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
            <span className="text-[10px] font-bold tracking-widest uppercase text-forest-light/60">
              Progress
            </span>
            <span className="text-[10px] font-bold text-terra tabular-nums">
              {counts.completed}/{counts.all}
            </span>
          </div>
          <div className="h-1.5 w-full bg-terra-pale rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-terra to-terra-soft rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(counts.completed / counts.all) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}