"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Sparkles, X } from "lucide-react";
import type { Mood } from "@/lib/journal-store";

const MOODS: Mood[] = ["Calm", "Anxious", "Grateful", "Heavy"];

type Draft = {
  title: string;
  content: string;
  mood: Mood | null;
  updatedAt: number;
};

type Props = {
  backHref: string;
  headerTitle: string; // "New entry" | "Edit entry"
  entryId?: string; // if edit mode, pass id for draft scoping

  initialTitle?: string;
  initialContent?: string;
  initialMood?: Mood | null;

  promptText?: string | null;

  onSave: (data: {
    title: string;
    content: string;
    mood: Mood | null;
  }) => Promise<void> | void;
  onSaved?: () => void;
};

function hasText(content: string) {
  return content.trim().length > 0;
}

export function JournalEditor({
  backHref,
  headerTitle,
  entryId,
  initialTitle = "",
  initialContent = "",
  initialMood = null,
  promptText = null,
  onSave,
  onSaved,
}: Props) {
  const draftKey = useMemo(
    () =>
      entryId
        ? `meletao_journal_draft_edit_${entryId}_v1`
        : "meletao_journal_draft_new_v1",
    [entryId]
  );

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<Mood | null>(initialMood);

  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Load draft (if exists)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;

      const draft = JSON.parse(raw) as Partial<Draft>;
      if (typeof draft.title === "string") setTitle(draft.title);
      if (typeof draft.content === "string") setContent(draft.content);

      if (draft.mood === null || typeof draft.mood === "string") {
        setMood(draft.mood);
      }

      setLastSavedAt(draft.updatedAt ? new Date(draft.updatedAt) : null);
    } catch {
      // ignore
    }
  }, [draftKey]);

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
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setLastSavedAt(new Date(draft.updatedAt));
      } catch {
        // ignore
      }
    }, 450);

    return () => clearTimeout(t);
  }, [title, content, mood, draftKey]);

  function clearDraft() {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
  }

  async function handleSave() {
    if (!hasText(content)) return;

    setSaving(true);
    try {
      await onSave({ title, content, mood });
      clearDraft();
      setLastSavedAt(new Date());
      onSaved?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <Button variant="glass" size="icon" asChild aria-label="Back">
          <Link href={backHref}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">Journal</p>
          <h1 className="text-base font-medium tracking-tight">
            {headerTitle}
          </h1>
        </div>

        <Button
          type="button"
          variant="glass"
          size="icon"
          onClick={() => {
            setTitle(initialTitle);
            setContent(initialContent);
            setMood(initialMood);
            clearDraft();
            setLastSavedAt(null);
          }}
          aria-label="Reset"
          title="Reset"
        >
          <X className="h-5 w-5" />
        </Button>
      </header>

      {/* Prompt */}
      {promptText && (
        <Card className="mt-5 p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
            <p className="text-sm leading-relaxed text-foreground/90">
              {promptText}
            </p>
          </div>
        </Card>
      )}

      {/* Editor */}
      <Card className="mt-5 p-5">
        <label className="block text-xs text-muted-foreground">
          Title (optional)
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A calmer morning…"
          className="mt-2"
        />

        <div className="mt-4">
          <label className="block text-xs text-muted-foreground">Write</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What’s on your mind?"
            className="mt-2 min-h-[260px] resize-none text-base leading-relaxed"
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
                <Button
                  key={m}
                  type="button"
                  variant="glass"
                  size="sm"
                  onClick={() => setMood(active ? null : m)}
                  className={cn(
                    "h-9 px-3 text-xs",
                    active
                      ? "text-foreground bg-white/30"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {m}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Footer actions */}
      <section className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Keep it simple. One honest paragraph is enough.
        </p>

        <Button
          variant="glass"
          size="lg"
          onClick={handleSave}
          disabled={saving || !hasText(content)}
          className="w-full sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save entry"}
        </Button>
      </section>

      {/* Optional: AI entry point (Premium later) */}
      <Card className="mt-4 p-4">
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
      </Card>
    </div>
  );
}
