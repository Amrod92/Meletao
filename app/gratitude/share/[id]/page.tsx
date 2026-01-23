// app/gratitude/share/[id]/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getGratitudeNote, type GratitudeNote } from "@/lib/gratitude-store";
import { ArrowLeft, HeartHandshake, Lock } from "lucide-react";

function formatDay(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export default function GratitudeSharePage() {
  const { id } = useParams<{ id: string }>();
  const note = useMemo<GratitudeNote | null>(
    () => getGratitudeNote(id),
    [id]
  );

  const isPublic = useMemo(() => note?.visibility === "public", [note]);

  if (!note || !isPublic) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
          <Card className="p-6">
            <div className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium tracking-tight">
                Not available
              </p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              This gratitude note is private or doesn’t exist.
            </p>

            <div className="mt-4 flex gap-2">
              <Button variant="glass" asChild>
                <Link href="/gratitude">Back to gratitude</Link>
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
        {/* Header */}
        <header className="flex items-center justify-between">
          <Button variant="glass" size="icon" asChild aria-label="Back">
            <Link href="/gratitude">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Gratitude</p>
            <h1 className="text-base font-medium tracking-tight">
              Shared note
            </h1>
          </div>

          <div className="w-10" />
        </header>

        {/* Card */}
        <Card className="mt-6 p-6">
          <div className="inline-flex items-center gap-2">
            <HeartHandshake className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium tracking-tight">
              A moment of gratitude
            </p>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {formatDay(note.createdAt)} · Read-only (no likes, no comments)
          </p>

          <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {note.text}
          </p>

          <div className="mt-6 text-xs text-muted-foreground">
            Made with <span className="text-foreground/80">meletaó</span>
          </div>
        </Card>
      </div>
    </main>
  );
}
