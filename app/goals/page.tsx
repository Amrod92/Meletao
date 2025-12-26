"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import {
  listGoals,
  pinGoal,
  deleteGoal,
  goalProgressPct,
  incrementGoalNumeric,
  incrementGoalChecklist,
  type Goal,
} from "@/lib/goals-store";
import { ArrowLeft, Plus, Target, Pin, Trash2, Sparkles } from "lucide-react";

function formatGoalWindow(goal: Goal) {
  if (goal.type === "yearly" && goal.year) return `Year ${goal.year}`;
  if (goal.startDate && goal.endDate)
    return `${goal.startDate} → ${goal.endDate}`;
  if (goal.startDate) return `From ${goal.startDate}`;
  if (goal.endDate) return `Until ${goal.endDate}`;
  return "No dates";
}

function metricLabel(goal: Goal) {
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

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  function refresh() {
    setGoals(listGoals());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        <header className="flex items-center justify-between">
          <Link
            href="/today"
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Goals</p>
            <h1 className="text-base font-medium tracking-tight">Your goals</h1>
          </div>

          <Button variant="glass" asChild className="h-10">
            <Link href="/goals/new">
              <Plus className="h-4 w-4" />
              New
            </Link>
          </Button>
        </header>

        {goals.length === 0 ? (
          <section className={cn(liquidGlassCard, "mt-6 p-6 text-center")}>
            <Target className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 text-sm font-medium tracking-tight">
              No goals yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add one goal and pin it to Today.
            </p>
            <Button variant="glass" asChild className="mt-4">
              <Link href="/goals/new">
                <Plus className="h-4 w-4" />
                Create goal
              </Link>
            </Button>
          </section>
        ) : (
          <section className="mt-6 space-y-3">
            {goals.map((g) => {
              const pct = goalProgressPct(g);
              const canAdjust =
                g.measurementEnabled &&
                (g.measurementType === "numeric" ||
                  g.measurementType === "checkbox");

              const isActive = !!g.pinned;

              return (
                <div
                  key={g.id}
                  className={cn(
                    liquidGlassCard,
                    "p-5 transition-all duration-300",
                    // ✅ Active/pinned styling (subtle but obvious)
                    isActive &&
                      "ring-1 ring-primary/50 shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_0_1px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.18)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Clickable content area */}
                    <Link
                      href={`/goals/${g.id}`}
                      className={cn(
                        "min-w-0 flex-1 rounded-xl p-1 outline-none transition-all duration-300",
                        "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ring",
                        isActive && "hover:bg-white/15"
                      )}
                      aria-label={`Open goal ${g.title}`}
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium tracking-tight">
                          {g.title}
                        </p>

                        {/* ✅ Active pill */}
                        {isActive && (
                          <span
                            className={cn(
                              liquidGlassButton,
                              "h-6 px-2 text-[11px] leading-none",
                              "inline-flex items-center gap-1",
                              "text-foreground"
                            )}
                            aria-label="Pinned to Today"
                            title="Pinned to Today"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            Active
                          </span>
                        )}
                      </div>

                      {g.description ? (
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {g.description}
                        </p>
                      ) : null}

                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        <p>{formatGoalWindow(g)}</p>
                        <p>{metricLabel(g)}</p>
                      </div>
                    </Link>

                    <div className="flex shrink-0 items-center gap-2">
                      {/* ✅ Pin button also shows state clearly */}
                      <button
                        type="button"
                        className={cn(
                          liquidGlassButton,
                          "h-10 w-10 text-foreground transition-all duration-300",
                          isActive
                            ? "bg-white/30 ring-1 ring-primary/40"
                            : "hover:bg-white/20"
                        )}
                        title={
                          isActive ? "Pinned (Active on Today)" : "Pin to Today"
                        }
                        aria-label={
                          isActive ? "Pinned to Today" : "Pin to Today"
                        }
                        onClick={() => {
                          pinGoal(g.id);
                          refresh();
                        }}
                      >
                        <Pin
                          className={cn(
                            "h-5 w-5",
                            isActive ? "text-primary" : "text-foreground"
                          )}
                        />
                      </button>

                      <button
                        type="button"
                        className={cn(
                          liquidGlassButton,
                          "h-10 w-10 text-foreground hover:bg-white/20"
                        )}
                        title="Delete"
                        aria-label="Delete goal"
                        onClick={() => {
                          if (
                            !confirm("Delete this goal? This can’t be undone.")
                          )
                            return;
                          deleteGoal(g.id);
                          refresh();
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{pct}%</span>
                    </div>
                    <div
                      className={cn(
                        "mt-2 h-2 w-full rounded-full overflow-hidden",
                        "bg-black/10 dark:bg-white/10",
                        isActive && "ring-1 ring-primary/20"
                      )}
                    >
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick update */}
                  {canAdjust ? (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Button
                        variant="glass"
                        onClick={() => {
                          const updated =
                            g.measurementType === "numeric"
                              ? incrementGoalNumeric(g.id, -1)
                              : incrementGoalChecklist(g.id, -1);
                          if (updated) refresh();
                        }}
                      >
                        -1
                      </Button>
                      <Button
                        variant="glass"
                        onClick={() => {
                          const updated =
                            g.measurementType === "numeric"
                              ? incrementGoalNumeric(g.id, +1)
                              : incrementGoalChecklist(g.id, +1);
                          if (updated) refresh();
                        }}
                      >
                        +1
                      </Button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
