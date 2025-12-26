"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import {
  getGoal,
  updateGoal,
  type Goal,
  type GoalMeasurementType,
  type GoalType,
} from "@/lib/goals-store";

function isoOrEmpty(v?: string) {
  return v ?? "";
}

export default function GoalEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const backHref = useMemo(() => `/goals/${id}`, [id]);

  const [loaded, setLoaded] = useState(false);
  const [goal, setGoal] = useState<Goal | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [type, setType] = useState<GoalType>("dated");
  const [year, setYear] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [measurementEnabled, setMeasurementEnabled] = useState(false);
  const [measurementType, setMeasurementType] =
    useState<GoalMeasurementType>("numeric");

  const [metricName, setMetricName] = useState("");
  const [current, setCurrent] = useState<number>(0);
  const [target, setTarget] = useState<number | "">("");

  const [checklistDone, setChecklistDone] = useState<number>(0);
  const [checklistTotal, setChecklistTotal] = useState<number | "">("");

  const [saving, setSaving] = useState(false);

  // Load goal + hydrate form
  useEffect(() => {
    const found = getGoal(id);
    setGoal(found);
    setLoaded(true);

    if (!found) return;

    setTitle(found.title ?? "");
    setDescription(found.description ?? "");

    setType(found.type);
    setYear(found.year ?? "");
    setStartDate(isoOrEmpty(found.startDate));
    setEndDate(isoOrEmpty(found.endDate));

    setMeasurementEnabled(!!found.measurementEnabled);
    setMeasurementType(found.measurementType ?? "numeric");

    setMetricName(found.metricName ?? "");
    setCurrent(found.current ?? 0);
    setTarget(typeof found.target === "number" ? found.target : "");

    setChecklistDone(found.checklistDone ?? 0);
    setChecklistTotal(
      typeof found.checklistTotal === "number" ? found.checklistTotal : ""
    );
  }, [id]);

  // Redirect AFTER load (avoid push during render)
  useEffect(() => {
    if (loaded && !goal) router.push("/goals");
  }, [loaded, goal, router]);

  // Keep fields consistent when switching goal type
  useEffect(() => {
    if (!loaded) return;
    if (type === "yearly") {
      setStartDate("");
      setEndDate("");
      if (year === "") setYear(new Date().getFullYear());
    } else {
      setYear("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Keep fields consistent when toggling measurement
  useEffect(() => {
    if (!loaded) return;

    if (!measurementEnabled) {
      // clear all measurement-related values to avoid stale saves
      setMetricName("");
      setCurrent(0);
      setTarget("");
      setChecklistDone(0);
      setChecklistTotal("");
      // keep measurementType as-is (or set default if you prefer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementEnabled]);

  // When switching measurement type, clear the other mode’s fields
  useEffect(() => {
    if (!loaded) return;
    if (!measurementEnabled) return;

    if (measurementType === "numeric") {
      setChecklistDone(0);
      setChecklistTotal("");
    } else {
      setMetricName("");
      setCurrent(0);
      setTarget("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementType]);

  function resetToOriginal() {
    if (!goal) return;

    setTitle(goal.title ?? "");
    setDescription(goal.description ?? "");

    setType(goal.type);
    setYear(goal.year ?? "");
    setStartDate(isoOrEmpty(goal.startDate));
    setEndDate(isoOrEmpty(goal.endDate));

    setMeasurementEnabled(!!goal.measurementEnabled);
    setMeasurementType(goal.measurementType ?? "numeric");

    setMetricName(goal.metricName ?? "");
    setCurrent(goal.current ?? 0);
    setTarget(typeof goal.target === "number" ? goal.target : "");

    setChecklistDone(goal.checklistDone ?? 0);
    setChecklistTotal(
      typeof goal.checklistTotal === "number" ? goal.checklistTotal : ""
    );
  }

  function validate(): string | null {
    if (!title.trim()) return "Title is required.";

    if (type === "yearly") {
      const y = Number(year);
      if (!y || y < 2000 || y > 2100)
        return "Please enter a valid year (e.g. 2026).";
    } else {
      if (startDate && endDate && startDate > endDate)
        return "Start date must be before end date.";
    }

    if (measurementEnabled) {
      if (measurementType === "numeric") {
        const t = target === "" ? 0 : Number(target);
        if (t <= 0) return "Numeric goals need a target > 0.";
        if (Number(current) < 0) return "Current cannot be negative.";
      } else {
        const total = checklistTotal === "" ? 0 : Number(checklistTotal);
        const done = Number(checklistDone);
        if (total <= 0) return "Checklist goals need a total > 0.";
        if (done < 0) return "Done cannot be negative.";
        if (done > total) return "Done cannot exceed total.";
      }
    }

    return null;
  }

  async function onSave() {
    if (!goal) return;

    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    setSaving(true);
    try {
      // Build a clean patch (only what matters)
      const patch: Partial<Goal> = {
        title: title.trim(),
        description: description.trim() || undefined,

        type,
        year: type === "yearly" ? Number(year) : undefined,
        startDate: type === "dated" ? startDate || undefined : undefined,
        endDate: type === "dated" ? endDate || undefined : undefined,

        measurementEnabled,
        measurementType: measurementEnabled
          ? measurementType
          : goal.measurementType,

        metricName:
          measurementEnabled && measurementType === "numeric"
            ? metricName.trim() || undefined
            : undefined,

        current:
          measurementEnabled && measurementType === "numeric"
            ? Number(current || 0)
            : undefined,

        target:
          measurementEnabled && measurementType === "numeric"
            ? Number(target)
            : undefined,

        checklistDone:
          measurementEnabled && measurementType === "checkbox"
            ? Number(checklistDone || 0)
            : undefined,

        checklistTotal:
          measurementEnabled && measurementType === "checkbox"
            ? Number(checklistTotal)
            : undefined,
      };

      updateGoal(id, patch);
      router.push(backHref);
    } finally {
      setSaving(false);
    }
  }

  // While redirecting / loading
  if (!loaded || !goal) return null;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        <header className="flex items-center justify-between">
          <Link
            href={backHref}
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Goals</p>
            <h1 className="text-base font-medium tracking-tight">Edit goal</h1>
          </div>

          <button
            type="button"
            onClick={resetToOriginal}
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Reset"
            title="Reset"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </header>

        <section className={cn(liquidGlassCard, "mt-6 p-6")}>
          {/* Title */}
          <label className="block text-xs text-muted-foreground">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Run 3x a week"
            className={cn(
              liquidGlassCard,
              "mt-2 h-11 w-full px-3 text-sm outline-none",
              "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            )}
          />

          {/* Description */}
          <label className="mt-4 block text-xs text-muted-foreground">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why this matters…"
            className={cn(
              liquidGlassCard,
              "mt-2 min-h-[90px] w-full resize-none p-3 text-sm leading-relaxed outline-none",
              "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            )}
          />

          {/* Type */}
          <div className="mt-5">
            <p className="text-xs text-muted-foreground">Goal type</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                className={cn(
                  liquidGlassButton,
                  "h-10",
                  type === "dated" && "bg-white/30"
                )}
                onClick={() => setType("dated")}
              >
                Dated
              </button>
              <button
                type="button"
                className={cn(
                  liquidGlassButton,
                  "h-10",
                  type === "yearly" && "bg-white/30"
                )}
                onClick={() => setType("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Dates */}
          {type === "yearly" ? (
            <div className="mt-4">
              <label className="block text-xs text-muted-foreground">
                Year
              </label>
              <input
                value={year}
                onChange={(e) =>
                  setYear(e.target.value ? Number(e.target.value) : "")
                }
                type="number"
                placeholder="2026"
                className={cn(
                  liquidGlassCard,
                  "mt-2 h-11 w-full px-3 text-sm outline-none",
                  "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                )}
              />
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground">
                  Start (optional)
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
              <div>
                <label className="block text-xs text-muted-foreground">
                  End (optional)
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
            </div>
          )}

          {/* Measurement */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Measurement</p>
              <button
                type="button"
                onClick={() => setMeasurementEnabled((v) => !v)}
                className={cn(
                  liquidGlassButton,
                  "h-9 px-3 text-xs",
                  measurementEnabled && "bg-white/30"
                )}
              >
                {measurementEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            {measurementEnabled && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={cn(
                      liquidGlassButton,
                      "h-10",
                      measurementType === "numeric" && "bg-white/30"
                    )}
                    onClick={() => setMeasurementType("numeric")}
                  >
                    Numeric
                  </button>
                  <button
                    type="button"
                    className={cn(
                      liquidGlassButton,
                      "h-10",
                      measurementType === "checkbox" && "bg-white/30"
                    )}
                    onClick={() => setMeasurementType("checkbox")}
                  >
                    Checklist
                  </button>
                </div>

                {measurementType === "numeric" ? (
                  <div className="mt-4 space-y-2">
                    <label className="block text-xs text-muted-foreground">
                      Metric name (optional)
                    </label>
                    <input
                      value={metricName}
                      onChange={(e) => setMetricName(e.target.value)}
                      placeholder="Sessions"
                      className={cn(
                        liquidGlassCard,
                        "mt-2 h-11 w-full px-3 text-sm outline-none",
                        "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                      )}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-muted-foreground">
                          Current
                        </label>
                        <input
                          type="number"
                          value={current}
                          onChange={(e) => setCurrent(Number(e.target.value))}
                          className={cn(
                            liquidGlassCard,
                            "mt-2 h-11 w-full px-3 text-sm outline-none"
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground">
                          Target
                        </label>
                        <input
                          type="number"
                          value={target}
                          onChange={(e) =>
                            setTarget(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            )
                          }
                          className={cn(
                            liquidGlassCard,
                            "mt-2 h-11 w-full px-3 text-sm outline-none"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-muted-foreground">
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
                          "mt-2 h-11 w-full px-3 text-sm outline-none"
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground">
                        Total
                      </label>
                      <input
                        type="number"
                        value={checklistTotal}
                        onChange={(e) =>
                          setChecklistTotal(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        className={cn(
                          liquidGlassCard,
                          "mt-2 h-11 w-full px-3 text-sm outline-none"
                        )}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            <Button
              variant="glass"
              className="flex-1"
              onClick={() => router.push(backHref)}
            >
              Cancel
            </Button>

            <Button
              variant="glass"
              className="flex-1"
              onClick={onSave}
              disabled={saving || !title.trim()}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
