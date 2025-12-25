import Link from "next/link";
import { cn } from "@/lib/utils";
import { liquidGlassCard, liquidGlassButton } from "@/lib/liquid-glass";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Sparkles,
  Settings,
  BookOpen,
  Target,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

/**
 * MVP Today page (server component).
 * Wire real data later (DB/auth).
 */
export default async function TodayPage() {
  // --- Placeholder data (replace with DB later) ---
  const user = await getCurrentUser();
  const firstName = user?.firstName ?? "there";
  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const dailyPrompt = "What would make today feel lighter — even by 1%?";

  const lastEntry = {
    title: "A calmer morning",
    snippet:
      "Woke up a bit tense, but the breathing helped. I noticed the urge to rush. Slowed down and it passed.",
    href: "/journal/last", // TODO
    createdAt: "Yesterday, 21:14",
  };

  const pinnedGoal = {
    title: "Train boxing consistently",
    progressPct: 42,
    metricLabel: "Sessions",
    current: 10,
    target: 24,
    href: "/goals/1", // TODO
  };

  const gratitudeTodayCount = 0;

  const moodChips = ["Calm", "Anxious", "Grateful", "Heavy"] as const;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background glow (quiet) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-160px] left-[-140px] h-[460px] w-[460px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-180px] top-[35%] h-[560px] w-[560px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 pb-28 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{dateLabel}</p>
            <h1 className="text-2xl font-medium tracking-tight">
              Today, {firstName}
            </h1>
          </div>

          <Link
            href="/settings"
            className={cn(liquidGlassButton, "h-10 w-10 text-foreground")}
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </header>

        <div className="mt-6 space-y-4">
          {/* Arrive card */}
          <section className={cn(liquidGlassCard, "p-5")}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium tracking-tight">Arrive</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {dailyPrompt}
                </p>
              </div>

              <Button variant="glass" asChild className="shrink-0">
                <Link href="/journal/new">
                  <Plus className="h-4 w-4" />
                  New entry
                </Link>
              </Button>
            </div>

            {/* Mood chips (optional, MVP-simple) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {moodChips.map((m) => (
                <button
                  key={m}
                  className={cn(
                    liquidGlassButton,
                    "h-9 px-3 text-xs text-foreground hover:bg-white/30"
                  )}
                  type="button"
                >
                  {m}
                </button>
              ))}
            </div>
          </section>

          {/* Continue last entry */}
          <section className={cn(liquidGlassCard, "p-5")}>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">Continue</p>
              </div>

              <Link
                href={lastEntry.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Open journal <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium tracking-tight">
                {lastEntry.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {lastEntry.snippet}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {lastEntry.createdAt}
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button variant="glass" asChild className="w-full sm:w-auto">
                  <Link href={lastEntry.href}>Continue writing</Link>
                </Button>

                {/* Premium-only later: show only if premium */}
                <Button
                  variant="glass"
                  className="w-full sm:w-auto"
                  disabled
                  title="Premium feature (coming soon)"
                >
                  <Sparkles className="h-4 w-4" />
                  Reflect with AI
                </Button>
              </div>
            </div>
          </section>

          {/* Focus goal */}
          <section className={cn(liquidGlassCard, "p-5")}>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">
                  Today’s focus
                </p>
              </div>

              <Link
                href="/goals"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                All goals <ArrowRight className="inline h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium tracking-tight">
                {pinnedGoal.title}
              </p>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {pinnedGoal.metricLabel}: {pinnedGoal.current}/
                    {pinnedGoal.target}
                  </span>
                  <span>{pinnedGoal.progressPct}%</span>
                </div>

                <div className="mt-2 h-2 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${pinnedGoal.progressPct}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button variant="glass" asChild className="w-full sm:w-auto">
                  <Link href={pinnedGoal.href}>View goal</Link>
                </Button>
                <Button
                  variant="glass"
                  className="w-full sm:w-auto"
                  disabled
                  title="Hook up your goal update flow"
                >
                  Update progress
                </Button>
              </div>
            </div>
          </section>

          {/* Gratitude nudge */}
          <section className={cn(liquidGlassCard, "p-5")}>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium tracking-tight">Gratitude</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Today: {gratitudeTodayCount}/1
              </p>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Add one thing you appreciate. No sharing. No likes. Just noticing.
            </p>

            <div className="mt-4">
              <Button variant="glass" asChild className="w-full sm:w-auto">
                <Link href="/gratitude/new">Add gratitude</Link>
              </Button>
            </div>
          </section>

          {/* One small reflection */}
          <section className={cn(liquidGlassCard, "p-5")}>
            <p className="text-sm font-medium tracking-tight">
              One small reflection
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              What are you avoiding today — and what would happen if you didn’t?
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button variant="glass" asChild className="w-full sm:w-auto">
                <Link href="/journal/new?prompt=avoidance">
                  Write about this
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full sm:w-auto">
                <Link href="/journal">View entries</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
