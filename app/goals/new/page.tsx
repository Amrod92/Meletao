"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import {
  createGoal,
  type GoalMeasurementType,
  type GoalType,
} from "@/lib/goals-store";
import {
  ArrowLeft,
  Save,
  X,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function NewGoalPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [type, setType] = useState<GoalType>("dated");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [startDate, setStartDate] = useState<string>(todayISO());
  const [endDate, setEndDate] = useState<string>("");

  const [pinned, setPinned] = useState(true);

  // Optional measurement section
  const [measurementEnabled, setMeasurementEnabled] = useState(true);
  const [measurementOpen, setMeasurementOpen] = useState(true);
  const [measurementType, setMeasurementType] =
    useState<GoalMeasurementType>("numeric");

  // numeric
  const [metricName, setMetricName] = useState("Sessions");
  const [target, setTarget] = useState<number>(12);
  const [current, setCurrent] = useState<number>(0);

  // checkbox (not primary MVP, but supported)
  const [checklistTotal, setChecklistTotal] = useState<number>(10);
  const [checklistDone, setChecklistDone] = useState<number>(0);

  const canSave = useMemo(() => {
    if (!title.trim()) return false;
    if (measurementEnabled && measurementType === "numeric") {
      return Number.isFinite(target) && target > 0;
    }
    if (measurementEnabled && measurementType === "checkbox") {
      return Number.isFinite(checklistTotal) && checklistTotal > 0;
    }
    return true;
  }, [title, measurementEnabled, measurementType, target, checklistTotal]);

  function reset() {
    setTitle("");
    setDescription("");
    setType("dated");
    setYear(new Date().getFullYear());
    setStartDate(todayISO());
    setEndDate("");
    setPinned(true);
    setMeasurementEnabled(true);
    setMeasurementOpen(true);
    setMeasurementType("numeric");
    setMetricName("Sessions");
    setTarget(12);
    setCurrent(0);
    setChecklistTotal(10);
    setChecklistDone(0);
  }

  function onSave() {
    const goal = createGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      year: type === "yearly" ? year : undefined,
      startDate: type === "dated" ? startDate || undefined : undefined,
      endDate: type === "dated" ? endDate || undefined : undefined,
      pinned,

      measurementEnabled,
      measurementType,

      metricName: measurementEnabled ? metricName : undefined,
      current:
        measurementEnabled && measurementType === "numeric" ? current : 0,
      target:
        measurementEnabled && measurementType === "numeric"
          ? target
          : undefined,

      checklistTotal:
        measurementEnabled && measurementType === "checkbox"
          ? checklistTotal
          : undefined,
      checklistDone:
        measurementEnabled && measurementType === "checkbox"
          ? checklistDone
          : undefined,
    });

    router.push("/goals");
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        <header className="flex items-center justify-between">
          <Link
            href="/goals"
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Goals</p>
            <h1 className="text-base font-medium tracking-tight">New goal</h1>
          </div>

          <button
            type="button"
            onClick={reset}
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Clear"
            title="Clear"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <section className={cn(liquidGlassCard, "mt-6 p-5")}>
          <div className="flex items-start gap-2">
            <Target className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium tracking-tight">Your goal</p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Keep it measurable. Keep it kind.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Train 12 times this month"
                className={cn(
                  liquidGlassCard,
                  "mt-2 h-11 w-full px-3 text-sm outline-none",
                  "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                )}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why this matters…"
                className={cn(
                  liquidGlassCard,
                  "mt-2 min-h-[92px] w-full resize-none p-3 text-sm leading-relaxed outline-none",
                  "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                )}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Type</label>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType("dated")}
                    className={cn(
                      liquidGlassButton,
                      "h-9 px-3 text-xs",
                      type === "dated"
                        ? "bg-white/30 text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    Start/End
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("yearly")}
                    className={cn(
                      liquidGlassButton,
                      "h-9 px-3 text-xs",
                      type === "yearly"
                        ? "bg-white/30 text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              {type === "yearly" ? (
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className={cn(
                      liquidGlassCard,
                      "mt-2 h-11 w-full px-3 text-sm outline-none",
                      "focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={cn(
                      liquidGlassCard,
                      "mt-2 h-11 w-full px-3 text-sm outline-none",
                      "focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  />
                </div>
              )}
            </div>

            {type === "dated" && (
              <div>
                <label className="text-xs text-muted-foreground">
                  End date (optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={cn(
                    liquidGlassCard,
                    "mt-2 h-11 w-full px-3 text-sm outline-none",
                    "focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Pin to Today</p>
              <button
                type="button"
                onClick={() => setPinned((v) => !v)}
                className={cn(
                  liquidGlassButton,
                  "h-9 px-3 text-xs",
                  pinned
                    ? "bg-white/30 text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {pinned ? "Pinned" : "Not pinned"}
              </button>
            </div>

            {/* Measurement (optional section) */}
            <div className={cn(liquidGlassCard, "mt-2 p-4")}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium tracking-tight">
                    How to measure (optional)
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Turn your intention into progress.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMeasurementOpen((v) => !v)}
                  className={cn(liquidGlassButton, "h-9 w-9")}
                  aria-label="Toggle measurement"
                >
                  {measurementOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Enable</p>
                <button
                  type="button"
                  onClick={() => setMeasurementEnabled((v) => !v)}
                  className={cn(
                    liquidGlassButton,
                    "h-9 px-3 text-xs",
                    measurementEnabled
                      ? "bg-white/30 text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {measurementEnabled ? "On" : "Off"}
                </button>
              </div>

              {measurementOpen && measurementEnabled && (
                <div className="mt-4 space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMeasurementType("numeric")}
                      className={cn(
                        liquidGlassButton,
                        "h-9 px-3 text-xs",
                        measurementType === "numeric"
                          ? "bg-white/30 text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      Numeric
                    </button>
                    <button
                      type="button"
                      onClick={() => setMeasurementType("checkbox")}
                      className={cn(
                        liquidGlassButton,
                        "h-9 px-3 text-xs",
                        measurementType === "checkbox"
                          ? "bg-white/30 text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      Checklist
                    </button>
                  </div>

                  {measurementType === "numeric" ? (
                    <>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Metric name
                        </label>
                        <input
                          value={metricName}
                          onChange={(e) => setMetricName(e.target.value)}
                          placeholder="Sessions / Pages / £ saved"
                          className={cn(
                            liquidGlassCard,
                            "mt-2 h-11 w-full px-3 text-sm outline-none",
                            "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground">
                            Target
                          </label>
                          <input
                            type="number"
                            value={target}
                            onChange={(e) => setTarget(Number(e.target.value))}
                            className={cn(
                              liquidGlassCard,
                              "mt-2 h-11 w-full px-3 text-sm outline-none",
                              "focus-visible:ring-2 focus-visible:ring-ring"
                            )}
                          />
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground">
                            Current
                          </label>
                          <input
                            type="number"
                            value={current}
                            onChange={(e) => setCurrent(Number(e.target.value))}
                            className={cn(
                              liquidGlassCard,
                              "mt-2 h-11 w-full px-3 text-sm outline-none",
                              "focus-visible:ring-2 focus-visible:ring-ring"
                            )}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Total steps
                        </label>
                        <input
                          type="number"
                          value={checklistTotal}
                          onChange={(e) =>
                            setChecklistTotal(Number(e.target.value))
                          }
                          className={cn(
                            liquidGlassCard,
                            "mt-2 h-11 w-full px-3 text-sm outline-none",
                            "focus-visible:ring-2 focus-visible:ring-ring"
                          )}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Done
                        </label>
                        <input
                          type="number"
                          value={checklistDone}
                          onChange={(e) =>
                            setChecklistDone(Number(e.target.value))
                          }
                          className={cn(
                            liquidGlassCard,
                            "mt-2 h-11 w-full px-3 text-sm outline-none",
                            "focus-visible:ring-2 focus-visible:ring-ring"
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                You can change it later.
              </p>

              <Button
                variant="glass"
                onClick={onSave}
                disabled={!canSave}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4" />
                Save goal
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
