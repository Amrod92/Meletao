"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
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
          <Link
            href="/today"
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Gratitude</p>
            <h1 className="text-base font-medium tracking-tight">Add</h1>
          </div>

          <button
            type="button"
            onClick={() => setText("")}
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Clear"
            title="Clear"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <section className={cn(liquidGlassCard, "mt-6 p-5")}>
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

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="I’m grateful for…"
            className={cn(
              liquidGlassCard,
              "mt-4 min-h-[180px] w-full resize-none p-3 text-base leading-relaxed outline-none",
              "placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            )}
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
        </section>
      </div>
    </main>
  );
}
