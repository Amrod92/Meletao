// components/journal/journal-editor.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Sparkles, X } from "lucide-react";

type Mood = "Calm" | "Anxious" | "Grateful" | "Heavy";
const MOODS: Mood[] = ["Calm", "Anxious", "Grateful", "Heavy"];

type Draft = {
  title: string;
  content: string;
  mood: Mood | null;
  updatedAt: number;
};

const DRAFT_KEY = "meletao_journal_draft_v1";

function hasText(content: string) {
  return content.trim().length > 0;
}

export function JournalEditor() {
  const searchParams = useSearchParams();
  const promptFromUrl = searchParams.get("prompt");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);

  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const promptText = useMemo(() => {
    if (!promptFromUrl) return null;
    if (promptFromUrl === "avoidance")
      return "What are you avoiding today — and what would happen if you didn’t?";
    return null;
  }, [promptFromUrl]);

  // Load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;

      const draft = JSON.parse(raw) as Partial<Draft>;
      if (typeof draft.title === "string") setTitle(draft.title);
      if (typeof draft.content === "string") setContent(draft.content);
      if (draft.mood) setMood(draft.mood);

      setLastSavedAt(draft.updatedAt ? new Date(draft.updatedAt) : null);
    } catch {
      // ignore
    }
  }, []);

  // Autosave draft (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const draft: Draft = {
          title,
          content,
          mood,
          updatedAt: Date.now(),
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setLastSavedAt(new Date(draft.updatedAt));
      } catch {
        // ignore
      }
    }, 450);

    return () => clearTimeout(t);
  }, [title, content, mood]);

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }

  async function onSave() {
    if (!hasText(content)) return;

    setSaving(true);
    try {
      // TODO: replace with a server action / API call that persists:
      // { title, content, mood }
      await new Promise((r) => setTimeout(r, 400));

      clearDraft();
      setLastSavedAt(new Date());

      alert("Saved (placeholder). Next step: wire DB + redirect.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <Link
          href="/today"
          className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">Journal</p>
          <h1 className="text-base font-medium tracking-tight">New entry</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setTitle("");
            setContent("");
            setMood(null);
            clearDraft();
            setLastSavedAt(null);
          }}
          className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
          aria-label="Clear"
          title="Clear"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Prompt */}
      {promptText && (
        <section className={cn(liquidGlassCard, "mt-5 p-4")}>
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
            <p className="text-sm leading-relaxed text-foreground/90">
              {promptText}
            </p>
          </div>
        </section>
      )}

      {/* Editor */}
      <section className={cn(liquidGlassCard, "mt-5 p-5")}>
        <label className="block text-xs text-muted-foreground">
          Title (optional)
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A calmer morning…"
          className={cn(
            liquidGlassCard,
            "mt-2 h-11 w-full px-3 text-sm outline-none",
            "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          )}
        />

        <div className="mt-4">
          <label className="block text-xs text-muted-foreground">Write</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What’s on your mind?"
            className={cn(
              liquidGlassCard,
              "mt-2 min-h-[260px] w-full resize-none p-3 text-base leading-relaxed outline-none",
              "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            )}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{content.length} chars</span>
            <span>
              {lastSavedAt
                ? `Draft saved ${lastSavedAt.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Draft autosave on"}
            </span>
          </div>
        </div>

        {/* Mood chips */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground">Mood (optional)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const active = mood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(active ? null : m)}
                  className={cn(
                    liquidGlassButton,
                    "h-9 px-3 text-xs",
                    active ? "text-foreground" : "text-muted-foreground",
                    active && "bg-white/30"
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer actions */}
      <section className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Keep it simple. One honest paragraph is enough.
        </p>

        <Button
          variant="glass"
          size="lg"
          onClick={onSave}
          disabled={saving || !hasText(content)}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save entry"}
        </Button>
      </section>

      {/* Optional: AI entry point (Premium later) */}
      <section className={cn(liquidGlassCard, "mt-4 p-4")}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium tracking-tight">
              Reflect with AI
            </p>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Calm questions and reframes. Not advice. Not judgement.
            </p>
          </div>
          <Button variant="glass" disabled title="Premium (coming soon)">
            <Sparkles className="h-4 w-4" />
            Reflect
          </Button>
        </div>
      </section>
    </div>
  );
}
