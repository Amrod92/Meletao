"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import { getEntry, deleteEntry, type JournalEntry } from "@/lib/journal-store";
import { ArrowLeft, Trash2 } from "lucide-react";

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function JournalEntryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    setEntry(getEntry(id));
  }, [id]);

  const title = useMemo(() => entry?.title ?? "Untitled", [entry]);

  if (!entry) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
          <section className={cn(liquidGlassCard, "p-6")}>
            <p className="text-sm font-medium tracking-tight">Not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This entry doesn’t exist (or was deleted).
            </p>
            <Button variant="glass" asChild className="mt-4">
              <Link href="/journal">Back to journal</Link>
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
            href="/journal"
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Journal</p>
            <h1 className="text-base font-medium tracking-tight">{title}</h1>
          </div>

          <button
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Delete"
            title="Delete"
            onClick={() => {
              if (!confirm("Delete this entry?")) return;
              deleteEntry(entry.id);
              router.push("/journal");
            }}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </header>

        <section className={cn(liquidGlassCard, "mt-6 p-6")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(entry.createdAt)}
              </p>
              {entry.mood ? (
                <span className="mt-2 inline-flex rounded-full px-2 py-1 text-[11px] text-foreground/90 bg-white/10">
                  {entry.mood}
                </span>
              ) : null}
            </div>

            {/* Edit later */}
            <Button variant="glass" disabled title="Edit (next step)">
              Edit
            </Button>
          </div>

          <div className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {entry.content}
          </div>
        </section>
      </div>
    </main>
  );
}
