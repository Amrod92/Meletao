"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getPinnedGoal,
  goalProgressPct,
  incrementGoalChecklist,
  incrementGoalNumeric,
  type Goal,
} from "@/lib/goals-store";
import {
  ArrowRight,
  BookOpen,
  Pencil,
  Plus,
  Target,
  Minus,
  Sparkles,
} from "lucide-react";

function formatWindow(goal: Goal) {
  if (goal.type === "yearly" && goal.year) return `Year ${goal.year}`;
  if (goal.startDate && goal.endDate)
    return `${goal.startDate} → ${goal.endDate}`;
  if (goal.startDate) return `From ${goal.startDate}`;
  if (goal.endDate) return `Until ${goal.endDate}`;
  return "No dates";
}

function metricLine(goal: Goal) {
  if (!goal.measurementEnabled) return "No measurement";

  if (goal.measurementType === "numeric") {
    const name = goal.metricName?.trim() || "Progress";
    const cur = goal.current ?? 0;
    const tgt = goal.target ?? 0;
    return `${name}: ${cur}/${tgt}`;
  }

  const done = goal.checklistDone ?? 0;
  const total = goal.checklistTotal ?? 0;
  return `Checklist: ${done}/${total}`;
}

export default function TodayPage() {
  const [pinned, setPinned] = useState<Goal | null>(null);
  const [loaded, setLoaded] = useState(false);

  const pct = useMemo(() => (pinned ? goalProgressPct(pinned) : 0), [pinned]);

  const canAdjust =
    !!pinned?.measurementEnabled &&
    (pinned.measurementType === "numeric" ||
      pinned.measurementType === "checkbox");

  useEffect(() => {
    const refresh = () => {
      setPinned(getPinnedGoal());
      setLoaded(true);
    };

    refresh();

    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  // avoid a flash of empty state during first render
  if (!loaded) return null;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Today</p>
            <h1 className="text-base font-medium tracking-tight">
              Your focus & reflection
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              asChild
              className="h-10 px-3 text-foreground inline-flex items-center gap-2"
              aria-label="New journal entry"
              title="New journal entry"
            >
              <Link href="/journal/new">
                <Plus className="h-4 w-4" />
                Journal
              </Link>
            </Button>
          </div>
        </header>

        {/* Focus for Today (Pinned Goal) */}
        <Card className="mt-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">
                  Focus for today
                </p>
              </div>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Keep it simple. One goal, one small action.
              </p>
            </div>

            <Button variant="glass" asChild className="shrink-0">
              <Link href="/goals">
                Goals <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {!pinned ? (
            <div className="mt-5">
              <Card className="p-4">
                <p className="text-sm font-medium tracking-tight">
                  No active goal yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  Pin one goal from the Goals page to see it here.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="glass" asChild>
                    <Link href="/goals">
                      <Target className="h-4 w-4" />
                      Go to goals
                    </Link>
                  </Button>
                  <Button variant="glass" asChild>
                    <Link href="/goals/new">
                      <Plus className="h-4 w-4" />
                      Create goal
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="mt-5">
              {/* Goal card */}
              <Card className="p-5 ring-1 ring-primary/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium tracking-tight">
                        {pinned.title}
                      </p>

                      <Badge variant="glass" title="Pinned to Today">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Active
                      </Badge>
                    </div>

                    {pinned.description ? (
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {pinned.description}
                      </p>
                    ) : null}

                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <p>{formatWindow(pinned)}</p>
                      <p>{metricLine(pinned)}</p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="glass" asChild className="h-10 px-3 text-foreground" aria-label="Open goal" title="Open goal">
                      <Link href={`/goals/${pinned.id}`}>Open</Link>
                    </Button>

                    <Button variant="glass" size="icon" asChild aria-label="Edit goal" title="Edit goal">
                      <Link href={`/goals/${pinned.id}/edit`}>
                        <Pencil className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden ring-1 ring-primary/15">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Quick adjust */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    variant="glass"
                    disabled={!canAdjust}
                    onClick={() => {
                      if (!pinned) return;

                      if (pinned.measurementType === "numeric") {
                        incrementGoalNumeric(pinned.id, -1);
                      } else {
                        incrementGoalChecklist(pinned.id, -1);
                      }

                      // Re-read pinned goal to reflect clamping + persistence
                      setPinned(getPinnedGoal());
                    }}
                  >
                    <Minus className="h-4 w-4" />
                    -1
                  </Button>

                  <Button
                    variant="glass"
                    disabled={!canAdjust}
                    onClick={() => {
                      if (!pinned) return;

                      if (pinned.measurementType === "numeric") {
                        incrementGoalNumeric(pinned.id, +1);
                      } else {
                        incrementGoalChecklist(pinned.id, +1);
                      }

                      setPinned(getPinnedGoal());
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    +1
                  </Button>
                </div>

                {!canAdjust && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Enable measurement on this goal to use quick updates.
                  </p>
                )}
              </Card>
            </div>
          )}
        </Card>

        {/* Journal quick entry */}
        <Card className="mt-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">Journal</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                One honest paragraph is enough.
              </p>
            </div>

            <Button variant="glass" asChild className="shrink-0">
              <Link href="/journal/new">
                Write <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="glass" asChild className="h-10 px-3 text-foreground">
              <Link href="/journal/new?prompt=avoidance">Prompt: Avoidance</Link>
            </Button>
            <Button variant="glass" asChild className="h-10 px-3 text-foreground">
              <Link href="/journal/new">Free write</Link>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
