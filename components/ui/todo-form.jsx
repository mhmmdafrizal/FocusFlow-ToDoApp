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
        bg-sage-pale/60 backdrop-blur-xl
        border border-oat/80
        shadow-[0_8px_32px_rgba(45,58,52,0.04)]
        rounded-2xl
        transition-shadow duration-300
        hover:shadow-[0_12px_40px_rgba(45,58,52,0.08)]
      "
    >
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-terra to-transparent opacity-70 rounded-t-2xl" />

      {/* Soft inner glow */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-terra-pale/40 blur-2xl" />

      <CardHeader className="pb-3 pt-6 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-xl font-semibold text-forest tracking-tight flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-xl bg-terra-pale border border-terra/30
                         flex items-center justify-center text-terra shadow-sm"
            >
              <Sparkles size={14} />
            </span>
            Add New Task
          </CardTitle>

          {isReady && (
            <span className="text-[10px] font-semibold tracking-widest uppercase text-terra animate-pulse">
              Ready
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Title field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.08em] uppercase text-forest-light">
              Title
            </label>
            <div className="relative">
              <Input
                placeholder="What's on your mind? (e.g., Design logo...)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setFocused("title")}
                onBlur={() => setFocused(null)}
                className="
                  bg-cream border-[1.5px] border-oat
                  text-forest placeholder:text-forest-light/50
                  rounded-xl px-4 py-2.5 text-sm font-medium
                  outline-none transition-all duration-200
                  focus:border-terra focus:bg-oat
                  focus:shadow-[0_0_0_3px_rgba(217,138,108,0.15),0_2px_8px_rgba(45,58,52,0.05)]
                "
              />
              {/* character count */}
              {title.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-forest-light/50 font-medium tabular-nums">
                  {title.length}
                </span>
              )}
            </div>
          </div>

          {/* Description field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.08em] uppercase text-forest-light">
              Description{" "}
              {/* <span className="normal-case font-normal tracking-normal opacity-60">(optional)</span> */}
            </label>
            <Textarea
              placeholder="Break it down into steps, drop a link, or jot down notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setFocused("desc")}
              onBlur={() => setFocused(null)}
              rows={3}
              className="
                bg-cream border-[1.5px] border-oat
                text-forest placeholder:text-forest-light/50
                rounded-xl px-4 py-2.5 text-sm leading-relaxed resize-none
                outline-none transition-all duration-200
                focus:border-terra focus:bg-oat
                focus:shadow-[0_0_0_3px_rgba(217,138,108,0.15),0_2px_8px_rgba(45,58,52,0.05)]
              "
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-terra/25 to-transparent" />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending || !isReady}
            className="
              w-full flex items-center justify-center gap-2
              bg-gradient-to-br from-terra to-terra-soft
              hover:from-terra hover:to-terra
              disabled:from-oat disabled:to-oat disabled:text-forest-light
              text-white font-semibold text-sm tracking-wide
              rounded-xl py-2.5 px-4
              shadow-[0_4px_18px_rgba(217,138,108,0.35)]
              hover:shadow-[0_8px_24px_rgba(217,138,108,0.45)]
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