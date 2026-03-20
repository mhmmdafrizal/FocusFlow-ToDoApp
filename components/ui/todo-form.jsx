"use client";

import { useCreateTodo } from "../../hooks/use-create-todo";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Textarea } from "./textarea";

import { Plus, Loader2, Sparkles } from "lucide-react";

export default function TodoForm() {
  const { mutate, isPending } = useCreateTodo();

  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [focused, setFocused]       = useState(null); // "title" | "desc" | null

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", title);
    formData.append("description", description);

    mutate(formData, {
      onSuccess: () => {
        setTitle("");
        setDescription("");
      },
    });
  };

  const isReady = title.trim().length > 0;

  return (
    <Card
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
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70 rounded-t-2xl" />

      {/* Soft inner glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-200/20 blur-2xl" />

      <CardHeader className="pb-3 pt-6 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="font-['Fraunces',Georgia,serif] text-xl font-semibold text-[#2d1f0e] tracking-tight flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200/60
                         flex items-center justify-center text-amber-500 shadow-sm"
            >
              <Sparkles size={14} />
            </span>
            Add New Task
          </CardTitle>

          {isReady && (
            <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-500 animate-pulse">
              Ready
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Title field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9b7050]">
              Title
            </label>
            <div className="relative">
              <Input
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setFocused("title")}
                onBlur={() => setFocused(null)}
                className="
                  bg-[#faf6f0] border-[1.5px] border-[rgba(45,31,14,0.10)]
                  text-[#2d1f0e] placeholder:text-[#9b7050]/50
                  rounded-xl px-4 py-2.5 text-sm font-medium
                  outline-none transition-all duration-200
                  focus:border-amber-400 focus:bg-white
                  focus:shadow-[0_0_0_3px_rgba(232,135,58,0.15),0_2px_8px_rgba(45,31,14,0.05)]
                "
              />
              {/* character count */}
              {title.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#9b7050]/50 font-medium tabular-nums">
                  {title.length}
                </span>
              )}
            </div>
          </div>

          {/* Description field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.08em] uppercase text-[#9b7050]">
              Description{" "}
              <span className="normal-case font-normal tracking-normal opacity-60">(optional)</span>
            </label>
            <Textarea
              placeholder="Add more context or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocused("desc")}
              onBlur={() => setFocused(null)}
              rows={3}
              className="
                bg-[#faf6f0] border-[1.5px] border-[rgba(45,31,14,0.10)]
                text-[#2d1f0e] placeholder:text-[#9b7050]/50
                rounded-xl px-4 py-2.5 text-sm leading-relaxed resize-none
                outline-none transition-all duration-200
                focus:border-amber-400 focus:bg-white
                focus:shadow-[0_0_0_3px_rgba(232,135,58,0.15),0_2px_8px_rgba(45,31,14,0.05)]
              "
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending || !isReady}
            className="
              w-full flex items-center justify-center gap-2
              bg-gradient-to-br from-amber-500 to-amber-400
              hover:from-amber-500 hover:to-amber-500
              disabled:from-[#d4b896] disabled:to-[#d4b896]
              text-white font-semibold text-sm tracking-wide
              rounded-xl py-2.5 px-4
              shadow-[0_4px_18px_rgba(232,135,58,0.35)]
              hover:shadow-[0_8px_24px_rgba(232,135,58,0.45)]
              hover:-translate-y-0.5
              disabled:shadow-none disabled:cursor-not-allowed disabled:opacity-70
              transition-all duration-200 active:translate-y-0
            "
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Adding task…
              </>
            ) : (
              <>
                <Plus size={15} strokeWidth={2.5} />
                Add Task
              </>
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}