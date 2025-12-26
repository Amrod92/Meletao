"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import {
  deleteGoal,
  getGoal,
  goalProgressPct,
  type Goal,
  incrementGoalChecklist,
  incrementGoalNumeric,
  pinGoal,
} from "@/lib/goals-store";
import {
  ArrowLeft,
  Trash2,
  Pin,
  Target,
  Minus,
  Plus,
  ArrowRight,
  Pencil,
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

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      setGoal(getGoal(id));
      setLoaded(true);
    };

    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [id]);

  const pct = useMemo(() => (goal ? goalProgressPct(goal) : 0), [goal]);

  const canAdjust =
    !!goal?.measurementEnabled &&
    (goal.measurementType === "numeric" || goal.measurementType === "checkbox");

  // Avoid flashing Not found before we load.
  if (!loaded) return null;

  if (!goal) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
          <section className={cn(liquidGlassCard, "p-6")}>
            <p className="text-sm font-medium tracking-tight">Not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This goal doesn’t exist (or was deleted).
            </p>
            <Button variant="glass" asChild className="mt-4">
              <Link href="/goals">Back to goals</Link>
            </Button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/goals"
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="text-center min-w-0 px-2">
            <p className="text-xs text-muted-foreground">Goal</p>
            <h1 className="truncate text-base font-medium tracking-tight">
              {goal.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit */}
            <Link
              href={`/goals/${goal.id}/edit`}
              className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
              aria-label="Edit goal"
              title="Edit goal"
            >
              <Pencil className="h-5 w-5" />
            </Link>

            {/* Pin */}
            <button
              className={cn(
                liquidGlassButton,
                "h-10 w-10 text-foreground",
                goal.pinned && "bg-white/30"
              )}
              title={goal.pinned ? "Pinned" : "Pin to Today"}
              aria-label={goal.pinned ? "Pinned" : "Pin to Today"}
              onClick={() => {
                const updated = pinGoal(goal.id);
                if (updated) setGoal(updated);
              }}
            >
              <Pin className="h-5 w-5" />
            </button>

            {/* Delete */}
            <button
              className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
              title="Delete"
              aria-label="Delete goal"
              onClick={() => {
                if (!confirm("Delete this goal? This can’t be undone.")) return;
                deleteGoal(goal.id);
                router.push("/goals");
              }}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Main card */}
        <section className={cn(liquidGlassCard, "mt-6 p-6")}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">
                  {goal.title}
                </p>
              </div>

              {goal.description ? (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {goal.description}
                </p>
              ) : null}

              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>{formatWindow(goal)}</p>
                <p>{metricLine(goal)}</p>
              </div>
            </div>

            <Button
              variant="glass"
              asChild
              className="shrink-0"
              title="Back to Today"
            >
              <Link href="/today">
                Today <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{pct}%</span>
            </div>

            <div className="mt-2 h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button
              variant="glass"
              disabled={!canAdjust}
              onClick={() => {
                const g = goal;
                if (!g) return;

                const updated =
                  g.measurementType === "numeric"
                    ? incrementGoalNumeric(g.id, -1)
                    : incrementGoalChecklist(g.id, -1);

                if (updated) setGoal(updated);
              }}
            >
              <Minus className="h-4 w-4" />
              -1
            </Button>

            <Button
              variant="glass"
              disabled={!canAdjust}
              onClick={() => {
                const g = goal;
                if (!g) return;

                const updated =
                  g.measurementType === "numeric"
                    ? incrementGoalNumeric(g.id, +1)
                    : incrementGoalChecklist(g.id, +1);

                if (updated) setGoal(updated);
              }}
            >
              <Plus className="h-4 w-4" />
              +1
            </Button>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            MVP controls: quick increments. Next we can add “set progress” and
            history/streaks.
          </p>
        </section>
      </div>
    </main>
  );
}
