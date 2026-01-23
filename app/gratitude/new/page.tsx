"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createGratitude, hasGratitudeToday } from "@/lib/gratitude-store";
import { ArrowLeft, HeartHandshake, Save, X } from "lucide-react";

const DRAFT_KEY = "meletao_gratitude_draft_v1";

export default function GratitudeNewPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    setAlreadyDone(hasGratitudeToday());
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setText(raw);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, text);
      } catch {
        // ignore
      }
    }, 350);
    return () => clearTimeout(t);
  }, [text]);

  async function onSave() {
    if (!text.trim()) return;

    setSaving(true);
    try {
      createGratitude({ text: text.trim(), visibility: "private" });
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      router.push("/today");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        <header className="flex items-center justify-between">
          <Button variant="glass" size="icon" asChild aria-label="Back">
            <Link href="/today">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Gratitude</p>
            <h1 className="text-base font-medium tracking-tight">Add</h1>
          </div>

          <Button
            type="button"
            variant="glass"
            size="icon"
            onClick={() => setText("")}
            aria-label="Clear"
            title="Clear"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        <Card className="mt-6 p-5">
          <div className="flex items-start gap-2">
            <HeartHandshake className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium tracking-tight">
                One thing you appreciate
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                No sharing. No likes. Just noticing.
              </p>
            </div>
          </div>

          {alreadyDone && (
            <div className="mt-4 rounded-xl bg-white/10 p-3 text-sm text-muted-foreground">
              You’ve already added gratitude today. You can add another if you
              want.
            </div>
          )}

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I’m grateful for…"
            className="mt-4 min-h-[180px] resize-none text-base leading-relaxed"
          />

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Keep it small. A single sentence is perfect.
            </p>

            <Button
              variant="glass"
              onClick={onSave}
              disabled={saving || !text.trim()}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
