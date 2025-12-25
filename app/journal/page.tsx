"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import { listEntries, type JournalEntry } from "@/lib/journal-store";
import { ArrowLeft, Plus, BookOpen } from "lucide-react";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function preview(text: string, max = 140) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max) + "…" : t;
}

export default function JournalListPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setEntries(listEntries());
  }, []);

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
            <h1 className="text-base font-medium tracking-tight">Entries</h1>
          </div>

          <Button variant="glass" asChild className="h-10">
            <Link href="/journal/new">
              <Plus className="h-4 w-4" />
              New
            </Link>
          </Button>
        </header>

        {/* Empty state */}
        {entries.length === 0 ? (
          <section className={cn(liquidGlassCard, "mt-6 p-6 text-center")}>
            <BookOpen className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 text-sm font-medium tracking-tight">
              No entries yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Write your first note — keep it small.
            </p>
            <Button variant="glass" asChild className="mt-4">
              <Link href="/journal/new">
                <Plus className="h-4 w-4" />
                New entry
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
                  "block p-5 transition hover:bg-white/10"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium tracking-tight">
                      {e.title ?? "Untitled"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {preview(e.content)}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(e.createdAt)}
                    </p>
                    {e.mood ? (
                      <span className="mt-2 inline-flex rounded-full px-2 py-1 text-[11px] text-foreground/90 bg-white/10">
                        {e.mood}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
