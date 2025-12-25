"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import {
  listGratitude,
  countGratitudeToday,
  type GratitudeEntry,
} from "@/lib/gratitude-store";
import { ArrowLeft, HeartHandshake, Plus } from "lucide-react";

function startOfDayMs(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function isSameDay(ts: number, d: Date) {
  const start = startOfDayMs(d);
  const end = start + 24 * 60 * 60 * 1000;
  return ts >= start && ts < end;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

// Optional: simple “streak” (consecutive days with ≥1 entry)
function computeStreak(entries: GratitudeEntry[]) {
  if (entries.length === 0) return 0;

  // Build a set of day keys (YYYY-MM-DD) that have entries
  const daySet = new Set<string>();
  for (const e of entries) {
    const d = new Date(e.createdAt);
    const key = d.toISOString().slice(0, 10);
    daySet.add(key);
  }

  // Count backwards from today
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!daySet.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default function GratitudePage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const load = () => {
      const all = listGratitude();
      setEntries(all);
      setTodayCount(countGratitudeToday());
    };

    // Initial load
    load();

    // Re-load when user comes back to the tab
    window.addEventListener("focus", load);

    return () => {
      window.removeEventListener("focus", load);
    };
  }, []);

  const todayEntries = useMemo(() => {
    const now = new Date();
    return entries.filter((e) => isSameDay(e.createdAt, now));
  }, [entries]);

  const streak = useMemo(() => computeStreak(entries), [entries]);

  return (
    <main className="relative min-h-screen overflow-hidden">
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
            <p className="text-xs text-muted-foreground">Gratitude</p>
            <h1 className="text-base font-medium tracking-tight">Your board</h1>
          </div>

          <Button variant="glass" asChild className="h-10">
            <Link href="/gratitude/new">
              <Plus className="h-4 w-4" />
              Add
            </Link>
          </Button>
        </header>

        {/* Summary */}
        <section className={cn(liquidGlassCard, "mt-6 p-5")}>
          <div className="flex items-start gap-2">
            <HeartHandshake className="mt-0.5 h-4 w-4 text-primary" />
            <div className="min-w-0">
              <p className="text-sm font-medium tracking-tight">
                Today: {todayCount}/1
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                No sharing. No likes. Just noticing what’s good.
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className={cn(liquidGlassButton, "h-8 px-3")}>
                  Streak: {streak} day{streak === 1 ? "" : "s"}
                </span>
                <span className={cn(liquidGlassButton, "h-8 px-3")}>
                  Total: {entries.length}
                </span>
              </div>
            </div>
          </div>

          {todayEntries.length === 0 ? (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Nothing added today yet.
              </p>
              <Button variant="glass" asChild className="mt-3">
                <Link href="/gratitude/new">
                  <Plus className="h-4 w-4" />
                  Add gratitude
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {todayEntries.map((e) => (
                <div key={e.id} className={cn(liquidGlassCard, "p-4")}>
                  <p className="text-sm leading-relaxed text-foreground">
                    {e.text}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Today · {formatTime(e.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section className={cn(liquidGlassCard, "mt-4 p-5")}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-tight">History</p>
            <p className="text-xs text-muted-foreground">Latest first</p>
          </div>

          {entries.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Your gratitude history will appear here.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {entries.map((e) => (
                <div key={e.id} className={cn(liquidGlassCard, "p-4")}>
                  <p className="text-sm leading-relaxed text-foreground">
                    {e.text}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDay(e.createdAt)} · {formatTime(e.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
