"use client";

import TodoForm from "../components/ui/todo-form";
import TodoList from "../components/ui/todo-list";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf6f0] px-6 py-10 md:px-12 md:py-14 relative overflow-x-hidden">

      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-amber-200/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-green-200/15 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-10 animate-[fadeDown_0.6s_ease_both]">

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-[2px] rounded-full bg-amber-500 inline-block" />
            <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-amber-500">
              Productivity Suite
            </span>
          </div>

          {/* Title */}
          <h1 className="font-['Fraunces',Georgia,serif] text-4xl md:text-5xl font-bold tracking-tight text-[#2d1f0e] leading-tight">
            Next.js{" "}
            <em className="font-light text-amber-500 not-italic">Todo</em>{" "}
            App
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-[#9b7050] font-medium max-w-md leading-relaxed">
            A modern task management experience — built for clarity, speed, and flow.
          </p>

          {/* Tech stack badges */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#9b7050] mr-1">
              Built with
            </span>

            {[
              { label: "Next.js",        dot: "bg-[#2d1f0e]" },
              { label: "Zod",            dot: "bg-blue-500"  },
              { label: "Zustand",        dot: "bg-amber-400" },
              { label: "TanStack Query", dot: "bg-emerald-500" },
              { label: "TanStack Form",  dot: "bg-violet-500" },
            ].map(({ label, dot }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           bg-white/70 border border-amber-200/60 backdrop-blur-sm
                           text-[11.5px] font-semibold text-[#5c3d1e]
                           shadow-sm hover:bg-amber-50 hover:border-amber-300
                           hover:-translate-y-0.5 hover:shadow-md
                           transition-all duration-200 cursor-default"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent mb-8 animate-[fadeIn_1s_0.3s_both]" />

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-7 items-start animate-[fadeUp_0.7s_0.2s_ease_both]">

          {/* LEFT — Add Task Form */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="text-base">✦</span>
              <h2 className="text-xs font-bold tracking-[0.10em] uppercase text-[#9b7050]">
                New Task
              </h2>
            </div>
            <TodoForm />
          </div>

          {/* RIGHT — Task List */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="text-base">◈</span>
              <h2 className="text-xs font-bold tracking-[0.10em] uppercase text-[#9b7050]">
                Task Board
              </h2>
            </div>
            <TodoList />
          </div>

        </div>

        {/* ── FOOTER ── */}
        <div className="mt-14 text-center animate-[fadeIn_1s_0.6s_both]">
          <p className="text-[11px] tracking-widest uppercase text-[#9b7050]/50 font-medium">
            Next.js · Zod · Zustand · TanStack Query & Form
          </p>
        </div>

      </div>
    </div>
  );
}