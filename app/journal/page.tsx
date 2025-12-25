"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
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

  const load = () => {
    const all = listEntries();
    setEntries(all);
  };

  useEffect(() => {
    load();

    // Refresh when returning to the tab/page (nice with localStorage)
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = entries.length;

  const emptyState = useMemo(() => total === 0, [total]);

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
            <p className="text-xs text-muted-foreground">Journal</p>
            <h1 className="text-base font-medium tracking-tight">
              Entries ({total})
            </h1>
          </div>

          <Button variant="glass" asChild className="h-10">
            <Link href="/journal/new">
              <Plus className="h-4 w-4" />
              New
            </Link>
          </Button>
        </header>

        {emptyState ? (
          <section className={cn(liquidGlassCard, "mt-6 p-6 text-center")}>
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
          </section>
        ) : (
          <section className="mt-6 space-y-3">
            {entries.map((e) => (
              <Link
                key={e.id}
                href={`/journal/${e.id}`}
                className={cn(
                  liquidGlassCard,
                  "block p-5 transition-all duration-300 hover:bg-white/10"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium tracking-tight">
                      {e.title?.trim() ? e.title : "Untitled"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {preview(e.content, 180)}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {formatDay(e.createdAt)} · {formatTime(e.createdAt)}
                    </p>
                  </div>

                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
