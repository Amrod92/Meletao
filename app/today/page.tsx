"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import { listEntries, type JournalEntry } from "@/lib/journal-store";
import {
  getPinnedGoal,
  goalProgressPct,
  incrementGoalNumeric,
  incrementGoalChecklist,
} from "@/lib/goals-store";
import {
  Plus,
  Sparkles,
  Settings,
  BookOpen,
  Target,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { countGratitudeToday } from "@/lib/gratitude-store";

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function preview(text: string, max = 160) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max) + "…" : t;
}

export default function TodayPage() {
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const dailyPrompt = "What would make today feel lighter — even by 1%?";

  const [latest, setLatest] = useState<JournalEntry | null>(null);
  const [pinnedGoal, setPinnedGoal] = useState<ReturnType<
    typeof getPinnedGoal
  > | null>(null);
  const [gratitudeTodayCount, setGratitudeTodayCount] = useState(0);

  // One refresh for the whole Today page state (simple + reliable)
  useEffect(() => {
    const refresh = () => {
      const entries = listEntries();
      setLatest(entries[0] ?? null);

      setPinnedGoal(getPinnedGoal());
      setGratitudeTodayCount(countGratitudeToday());
    };

    refresh();
  }, []);

  const latestHref = useMemo(() => {
    if (!latest) return "/journal/new";
    return `/journal/${latest.id}`;
  }, [latest]);

  const latestTitle = latest?.title ?? "Untitled";
  const latestSnippet = latest ? preview(latest.content) : null;

  const pinnedPct = pinnedGoal ? goalProgressPct(pinnedGoal) : 0;

  const focusMetricLine = useMemo(() => {
    if (!pinnedGoal) return "No goal pinned";
    if (!pinnedGoal.measurementEnabled) return "No measurement";

    if (pinnedGoal.measurementType === "numeric") {
      const name = pinnedGoal.metricName ?? "Progress";
      return `${name}: ${pinnedGoal.current ?? 0}/${pinnedGoal.target ?? 0}`;
    }

    return `Checklist: ${pinnedGoal.checklistDone ?? 0}/${
      pinnedGoal.checklistTotal ?? 0
    }`;
  }, [pinnedGoal]);

  const moodChips = ["Calm", "Anxious", "Grateful", "Heavy"] as const;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[-140px] h-[460px] w-[460px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-180px] top-[35%] h-[560px] w-[560px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{dateLabel}</p>
            <h1 className="text-2xl font-medium tracking-tight">Today</h1>
          </div>

          <Link
            href="/settings"
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </header>

        <div className="mt-6 space-y-4">
          {/* Arrive */}
          <section className={cn(liquidGlassCard, "p-5")}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium tracking-tight">Arrive</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {dailyPrompt}
                </p>
              </div>

              <Button variant="glass" asChild className="shrink-0">
                <Link href="/journal/new">
                  <Plus className="h-4 w-4" />
                  New entry
                </Link>
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {moodChips.map((m) => (
                <button
                  key={m}
                  className={cn(
                    liquidGlassButton,
                    "h-9 px-3 text-xs text-foreground hover:bg-white/30"
                  )}
                  type="button"
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          {/* Continue */}
          <section className={cn(liquidGlassCard, "p-5")}>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">Continue</p>
              </div>

              <Link
                href="/journal"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                All entries <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </div>

            {latest ? (
              <div className="mt-3">
                <p className="text-sm font-medium tracking-tight">
                  {latestTitle}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {latestSnippet}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {formatDate(latest.createdAt)} ·{" "}
                  {formatTime(latest.createdAt)}
                </p>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button variant="glass" asChild className="w-full sm:w-auto">
                    <Link href={latestHref}>Continue</Link>
                  </Button>

                  <Button
                    variant="glass"
                    className="w-full sm:w-auto"
                    disabled
                    title="Premium feature (coming soon)"
                  >
                    <Sparkles className="h-4 w-4" />
                    Reflect with AI
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">
                  No entries yet. Start with one honest paragraph.
                </p>
                <div className="mt-4">
                  <Button variant="glass" asChild>
                    <Link href="/journal/new">
                      <Plus className="h-4 w-4" />
                      Write first entry
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* Focus goal */}
          <section className={cn(liquidGlassCard, "p-5")}>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">
                  Today’s focus
                </p>
              </div>

              <Link
                href="/goals"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Goals <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-3">
              {/* ✅ Added: show goal title */}
              <p className="text-sm font-medium tracking-tight">
                {pinnedGoal ? pinnedGoal.title : "Pick your first goal"}
              </p>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {/* ✅ Fixed: sensible label when no pinned goal */}
                  <span>{focusMetricLine}</span>
                  <span>{pinnedGoal ? pinnedPct : 0}%</span>
                </div>

                <div className="mt-2 h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${pinnedGoal ? pinnedPct : 0}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button variant="glass" asChild className="w-full sm:w-auto">
                  <Link
                    href={pinnedGoal ? `/goals/${pinnedGoal.id}` : "/goals/new"}
                  >
                    {pinnedGoal ? "Open goal" : "Set a goal"}
                  </Link>
                </Button>

                {pinnedGoal?.measurementEnabled ? (
                  <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
                    <Button
                      variant="glass"
                      disabled={!pinnedGoal}
                      onClick={() => {
                        if (!pinnedGoal) return;
                        const updated =
                          pinnedGoal.measurementType === "numeric"
                            ? incrementGoalNumeric(pinnedGoal.id, -1)
                            : incrementGoalChecklist(pinnedGoal.id, -1);
                        setPinnedGoal(updated ?? pinnedGoal);
                      }}
                    >
                      -1
                    </Button>

                    <Button
                      variant="glass"
                      disabled={!pinnedGoal}
                      onClick={() => {
                        if (!pinnedGoal) return;
                        const updated =
                          pinnedGoal.measurementType === "numeric"
                            ? incrementGoalNumeric(pinnedGoal.id, +1)
                            : incrementGoalChecklist(pinnedGoal.id, +1);
                        setPinnedGoal(updated ?? pinnedGoal);
                      }}
                    >
                      +1
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* Gratitude */}
          <section className={cn(liquidGlassCard, "p-5")}>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">Gratitude</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Today: {gratitudeTodayCount}/1
              </p>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Add one thing you appreciate. No sharing. No likes. Just noticing.
            </p>

            <div className="mt-4">
              <Button variant="glass" asChild className="w-full sm:w-auto">
                <Link href="/gratitude/new">Add gratitude</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
