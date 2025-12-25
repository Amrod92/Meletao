"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Sparkles, X } from "lucide-react";
import type { Mood } from "@/lib/journal-store";

type Props = {
  /** Back button destination */
  backHref: string;

  /** Page label */
  headerLabel?: string;

  /** Title shown in the header (e.g. "New entry" / "Edit entry") */
  headerTitle: string;

  /** If provided we treat this as edit mode for draft key scoping */
  entryId?: string;

  /** Initial values (for edit mode or prefilled prompts) */
  initialTitle?: string;
  initialContent?: string;
  initialMood?: Mood | null;

  /** Optional prompt banner text */
  promptText?: string | null;

  /** Save handler (create or update decided by page) */
  onSave: (data: {
    title: string;
    content: string;
    mood: Mood | null;
  }) => Promise<void> | void;

  /** After successful save */
  onSaved?: () => void;
};

const MOODS: Mood[] = ["Calm", "Anxious", "Grateful", "Heavy"];

function isMeaningfulContent(s: string) {
  return s.replace(/\s+/g, " ").trim().length > 0;
}

export function JournalEditor({
  backHref,
  headerLabel = "Journal",
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

  // Load draft (only if present; otherwise keep initial values)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;

      const draft = JSON.parse(raw) as Partial<{
        title: string;
        content: string;
        mood: Mood | null;
        updatedAt: number;
      }>;

      if (typeof draft.title === "string") setTitle(draft.title);
      if (typeof draft.content === "string") setContent(draft.content);
      if (draft.mood === null || draft.mood) setMood(draft.mood);
      if (draft.updatedAt) setLastSavedAt(new Date(draft.updatedAt));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  // Autosave draft (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const payload = {
          title,
          content,
          mood,
          updatedAt: Date.now(),
        };
        localStorage.setItem(draftKey, JSON.stringify(payload));
        setLastSavedAt(new Date(payload.updatedAt));
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
    if (!isMeaningfulContent(content)) return;

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
        <Link
          href={backHref}
          className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">{headerLabel}</p>
          <h1 className="text-base font-medium tracking-tight">
            {headerTitle}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setTitle(initialTitle);
            setContent(initialContent);
            setMood(initialMood);
            clearDraft();
            setLastSavedAt(null);
          }}
          className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
          aria-label="Reset"
          title="Reset"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Prompt */}
      {promptText ? (
        <section className={cn(liquidGlassCard, "mt-5 p-4")}>
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
            <p className="text-sm leading-relaxed text-foreground/90">
              {promptText}
            </p>
          </div>
        </section>
      ) : null}

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
              "mt-2 min-h-[240px] w-full resize-none px-3 py-3 text-sm leading-relaxed outline-none",
              "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            )}
          />

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{content.trim().length} chars</span>
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
                    active
                      ? "text-foreground bg-white/30"
                      : "text-muted-foreground hover:text-foreground"
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
          onClick={handleSave}
          disabled={saving || !isMeaningfulContent(content)}
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
