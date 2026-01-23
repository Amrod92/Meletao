"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const load = () => setGoals(listGoals());
    load();
    setMounted(true);

    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        <header className="flex items-center justify-between">
          <Button variant="glass" size="icon" asChild aria-label="Back">
            <Link href="/today">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

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

        {!mounted ? (
          <Card className="mt-6 p-6 text-center">
            <p className="text-sm text-muted-foreground">Loading goals…</p>
          </Card>
        ) : goals.length === 0 ? (
          <Card className="mt-6 p-6 text-center">
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
          </Card>
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
                <Card
                  key={g.id}
                  className={cn(
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
                          <Badge
                            variant="glass"
                            aria-label="Pinned to Today"
                            title="Pinned to Today"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            Active
                          </Badge>
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
                      <Button
                        type="button"
                        variant="glass"
                        size="icon"
                        className={cn(
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
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="glass"
                            size="icon"
                            className="hover:bg-white/20"
                            title="Delete"
                            aria-label="Delete goal"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this goal?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This can’t be undone. The goal will be permanently
                              removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                              <Button variant="glass">Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  deleteGoal(g.id);
                                  refresh();
                                }}
                              >
                                Delete
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                </Card>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
