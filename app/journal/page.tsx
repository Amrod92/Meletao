"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listEntries, type JournalEntry } from "@/lib/journal-store";
import { ArrowLeft, Plus, BookOpen, ArrowRight } from "lucide-react";

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

function preview(text: string, max = 170) {
  const t = (text ?? "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max) + "…" : t;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load after mount to avoid hydration mismatches with localStorage + dates
    const load = () => setEntries(listEntries());
    load();
    setMounted(true);

    // Refresh when returning to the tab/page (nice with localStorage)
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const total = entries.length;
  const lastEntry = entries[0];
  const lastEntryLabel =
    mounted && lastEntry
      ? `${formatDay(lastEntry.createdAt)} · ${formatTime(lastEntry.createdAt)}`
      : "No entries yet";

  const emptyState = useMemo(() => total === 0, [total]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Button variant="glass" size="icon" asChild aria-label="Back">
            <Link href="/today">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Journal</p>
            <div className="inline-flex items-center justify-center gap-2">
              <h1 className="text-base font-medium tracking-tight">
                Your journal
              </h1>
              <Badge variant="glass" className="text-[10px]">
                {total} entries
              </Badge>
            </div>
          </div>

          <Button variant="glass" asChild className="h-10">
            <Link href="/journal/new">
              <Plus className="h-4 w-4" />
              New
            </Link>
          </Button>
        </header>

        <Card className="mt-6 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">
                  A private space to reflect
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Capture moments, ideas, and emotions. Your entries stay on this
                device.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Entries
                </p>
                <p className="text-sm font-medium">{total}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Last entry
                </p>
                <p className="text-sm font-medium">{lastEntryLabel}</p>
              </div>
            </div>
          </div>
        </Card>

        {emptyState ? (
          <Card className="mt-6 p-6 text-center">
            <BookOpen className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 text-sm font-medium tracking-tight">
              No entries yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with one honest paragraph.
            </p>
            <Button variant="glass" asChild className="mt-4">
              <Link href="/journal/new">
                <Plus className="h-4 w-4" />
                Write first entry
              </Link>
            </Button>
          </Card>
        ) : (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Recent entries
              </p>
              <p className="text-xs text-muted-foreground">Showing {total}</p>
            </div>

            <div className="mt-3 space-y-3">
              {entries.map((e) => (
                <div key={e.id}>
                  <Link href={`/journal/${e.id}`}>
                    <Card className="p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium tracking-tight">
                              {e.title?.trim() ? e.title : "Untitled"}
                            </p>
                            {e.mood ? (
                              <Badge variant="glass" className="text-[10px]">
                                {e.mood}
                              </Badge>
                            ) : null}
                            {e.updatedAt !== e.createdAt ? (
                              <Badge variant="glass" className="text-[10px]">
                                Edited
                              </Badge>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {preview(e.content, 180)}
                          </p>
                          <p className="mt-3 text-xs text-muted-foreground">
                            {formatDay(e.createdAt)} · {formatTime(e.createdAt)}
                          </p>
                        </div>

                        <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </Card>
                  </Link>
                  <div className="mt-3 h-px bg-white/10" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
