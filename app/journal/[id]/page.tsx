"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { getEntry, deleteEntry, type JournalEntry } from "@/lib/journal-store";
import { ArrowLeft, BookOpen, Plus, Sparkles, Trash2 } from "lucide-react";

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export default function JournalEntryPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      const found = getEntry(id);
      setEntry(found);
      setLoaded(true);
    };

    load();

    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [id]);

  const title = useMemo(() => {
    if (!entry) return "Journal";
    return entry.title?.trim() ? entry.title : "Untitled";
  }, [entry]);

  if (!loaded) return null;

  if (!entry) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
          <Card className="p-6">
            <p className="text-sm font-medium tracking-tight">Not found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This journal entry doesn’t exist (or was deleted).
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="glass" asChild>
                <Link href="/journal">Back to journal</Link>
              </Button>
              <Button variant="glass" asChild>
                <Link href="/journal/new">
                  <Plus className="h-4 w-4" />
                  New entry
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        <header className="flex items-center justify-between">
          <Button variant="glass" size="icon" asChild aria-label="Back">
            <Link href="/journal">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Journal</p>
            <h1 className="text-base font-medium tracking-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              asChild
              className="h-10 px-3 text-foreground inline-flex items-center gap-2"
              aria-label="Edit entry"
              title="Edit entry"
            >
              <Link href={`/journal/${entry.id}/edit`}>Edit</Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="glass" size="icon" aria-label="Delete entry" title="Delete entry">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This can’t be undone. The journal entry will be permanently
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
                        deleteEntry(entry.id);
                        router.push("/journal");
                      }}
                    >
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="glass" size="icon" asChild aria-label="New entry" title="New entry">
              <Link href="/journal/new">
                <Plus className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </header>

        <Card className="mt-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">{title}</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDay(entry.createdAt)} · {formatTime(entry.createdAt)}
              </p>
            </div>

            <Button
              variant="glass"
              disabled
              title="Premium (coming soon)"
              className="shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              Reflect
            </Button>
          </div>

          <div className="mt-5 space-y-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {entry.content}
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
