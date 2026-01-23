// app/gratitude/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  createGratitudeNote,
  deleteGratitudeNote,
  listGratitudeNotes,
  updateGratitudeNoteVisibility,
  type GratitudeNote,
  type GratitudeVisibility,
} from "@/lib/gratitude-store";
import {
  ArrowLeft,
  Copy,
  HeartHandshake,
  Lock,
  Globe,
  Trash2,
} from "lucide-react";

function formatDay(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function GratitudePage() {
  const [notes, setNotes] = useState<GratitudeNote[]>(() =>
    listGratitudeNotes()
  );
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState<GratitudeVisibility>("private");

  const canSave = useMemo(() => text.trim().length > 0, [text]);

  useEffect(() => {
    const handleFocus = () => {
      setNotes(listGratitudeNotes());
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  async function copyShareLink(note: GratitudeNote) {
    // Only public notes should be shareable.
    if (note.visibility !== "public") return;

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/gratitude/share/${note.id}`
        : `/gratitude/share/${note.id}`;

    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied.");
    } catch {
      // fallback
      prompt("Copy this link:", url);
    }
  }

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
            <p className="text-xs text-muted-foreground">Gratitude</p>
            <h1 className="text-base font-medium tracking-tight">
              Your gratitude board
            </h1>
          </div>

          <div className="w-10" />
        </header>

        {/* Create */}
        <Card className="mt-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">
                  Add a gratitude note
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                No likes. No comments. Just a quiet record of what matters.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="glass"
                className={cn(
                  "h-10 px-3 text-foreground inline-flex items-center gap-2",
                  visibility === "private" && "bg-white/20"
                )}
                onClick={() => setVisibility("private")}
                title="Private (only you)"
              >
                <Lock className="h-4 w-4" />
                Private
              </Button>
              <Button
                type="button"
                variant="glass"
                className={cn(
                  "h-10 px-3 text-foreground inline-flex items-center gap-2",
                  visibility === "public" && "bg-white/20"
                )}
                onClick={() => setVisibility("public")}
                title="Public (shareable link, read-only)"
              >
                <Globe className="h-4 w-4" />
                Public
              </Button>
            </div>
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Today I’m grateful for…"
            className="mt-4 min-h-[140px] resize-none text-base leading-relaxed"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{text.length} chars</span>
            <span>
              {visibility === "public" ? "Shareable link" : "Only you"}
            </span>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="glass"
              onClick={() => {
                if (!canSave) return;
                createGratitudeNote({ text, visibility });
                setText("");
                setVisibility("private");
                refresh();
              }}
              disabled={!canSave}
            >
              Save note
            </Button>
          </div>
        </Card>

        {/* List */}
        <section className="mt-6 space-y-3">
          {notes.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm font-medium tracking-tight">
                Nothing here yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first gratitude note above.
              </p>
            </Card>
          ) : (
            notes.map((n) => (
              <Card key={n.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                      {n.text}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                      <span>
                        {formatDay(n.createdAt)} · {formatTime(n.createdAt)}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        {n.visibility === "public" ? (
                          <>
                            <Globe className="h-3.5 w-3.5" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            Private
                          </>
                        )}
                      </span>

                      <span className="capitalize">
                        Sentiment: {n.sentiment}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {/* Toggle visibility */}
                    <Button
                      type="button"
                      variant="glass"
                      size="icon"
                      title={
                        n.visibility === "public"
                          ? "Make private"
                          : "Make public"
                      }
                      aria-label="Toggle visibility"
                      onClick={() => {
                        const next =
                          n.visibility === "public" ? "private" : "public";
                        updateGratitudeNoteVisibility(n.id, next);
                        refresh();
                      }}
                    >
                      {n.visibility === "public" ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <Globe className="h-5 w-5" />
                      )}
                    </Button>

                    {/* Copy link (public only) */}
                    <Button
                      type="button"
                      variant="glass"
                      size="icon"
                      className={cn(n.visibility !== "public" && "opacity-50")}
                      disabled={n.visibility !== "public"}
                      title={
                        n.visibility === "public"
                          ? "Copy share link"
                          : "Only public notes can be shared"
                      }
                      aria-label="Copy share link"
                      onClick={() => copyShareLink(n)}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>

                    {/* Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="glass"
                          size="icon"
                          title="Delete"
                          aria-label="Delete note"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This can’t be undone. The note will be permanently
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
                                deleteGratitudeNote(n.id);
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

                {/* Read-only share hint */}
                {n.visibility === "public" ? (
                  <div className="mt-4">
                    <Button variant="glass" asChild>
                      <Link
                        href={`/gratitude/share/${n.id}`}
                        className="h-10 px-3 text-foreground inline-flex items-center gap-2"
                        title="Open public share view"
                      >
                        View share page
                        <Copy className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
