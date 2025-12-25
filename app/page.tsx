// app/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { liquidGlassCard } from "@/lib/liquid-glass";
import { isLoggedIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Check, Lock, Sparkles, Target, HeartHandshake } from "lucide-react";

export default async function LandingPage() {
  const loggedIn = await isLoggedIn();
  if (loggedIn) redirect("/today");

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background: subtle, warm, modern (no distractions) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-140px] left-[-140px] h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-160px] top-[35%] h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* No main navigation (single goal) */}
      <section className="relative mx-auto max-w-6xl px-4 pb-14 pt-10 md:pt-14">
        {/* Above the fold */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div
              className={cn(
                liquidGlassCard,
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              )}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm text-foreground/90">
                meletaó — practice reflection, not performance.
              </p>
            </div>

            <h1 className="text-4xl font-medium tracking-tight md:text-5xl leading-tight">
              A quiet space to journal, set intentions, and make sense of your
              thoughts.
            </h1>

            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Write freely. Track meaningful goals without pressure. Use AI
              (Premium) as a calm mirror—asking better questions, helping you
              reframe, and noticing patterns over time.
            </p>

            {/* Single, unmissable CTA */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="glass"
                size="lg"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="/register">Get started</Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                No likes. No comments. No external validation.
              </p>
            </div>

            {/* Benefits bullets */}
            <div className={cn(liquidGlassCard, "p-4")}>
              <p className="text-sm font-medium tracking-tight">What you get</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    Journaling designed for calm, clarity, and consistency.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Target className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    Goals with optional measurement—progress without hustle.
                  </span>
                </li>
                <li className="flex gap-2">
                  <HeartHandshake className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    Private gratitude board—share read-only, without social
                    validation.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Lock className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    Privacy-first by design. Your thoughts stay yours.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Hero visual (product in action) */}
          <div className="space-y-4">
            <div className={cn(liquidGlassCard, "p-3")}>
              <div className="relative overflow-hidden rounded-2xl">
                {/* Replace with your own screenshot/video later */}
                <Image
                  src="https://workscounselingcenter.com/wp-content/uploads/2022/12/Stoicism-A-Philosophy-for-Life-1080x675.jpg"
                  alt="meletaó in action"
                  width={1400}
                  height={900}
                  className="h-[360px] w-full object-cover md:h-[420px]"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
              </div>

              {/* Small glass caption strip */}
              <div className={cn(liquidGlassCard, "mt-3 p-3")}>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  “Reflect with AI” feels like talking to a calm
                  mirror—questions, reframes, patterns. Not advice. Not
                  judgement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Problem / Solution & Benefits */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <div className={cn(liquidGlassCard, "p-6")}>
            <p className="text-sm font-medium tracking-tight">The problem</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Most apps turn growth into performance: streaks, likes, feeds,
              pressure. Reflection becomes another thing to “win”.
            </p>
          </div>

          <div className={cn(liquidGlassCard, "p-6")}>
            <p className="text-sm font-medium tracking-tight">The solution</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              meletaó is built for attention and care: journal privately, set
              goals gently, and practise gratitude without validation loops.
            </p>
          </div>

          <div className={cn(liquidGlassCard, "p-6")}>
            <p className="text-sm font-medium tracking-tight">The outcome</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              More clarity, calmer thinking, and a simple system you’ll actually
              return to—because it feels safe.
            </p>
          </div>
        </section>

        {/* Social proof */}
        <section className="mt-12">
          <div className={cn(liquidGlassCard, "p-6")}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium tracking-tight">
                  Trust signals
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add real testimonials / logos as you get early users.
                </p>
              </div>
              <div className="hidden md:block text-sm text-muted-foreground">
                Early access • Private beta
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <blockquote className={cn(liquidGlassCard, "p-4")}>
                <p className="text-sm leading-relaxed text-foreground/90">
                  “The only journaling app that doesn’t make me feel like I’m
                  performing.”
                </p>
                <footer className="mt-3 text-xs text-muted-foreground">
                  — Beta user
                </footer>
              </blockquote>

              <blockquote className={cn(liquidGlassCard, "p-4")}>
                <p className="text-sm leading-relaxed text-foreground/90">
                  “The AI questions are genuinely helpful. It feels calm, not
                  robotic.”
                </p>
                <footer className="mt-3 text-xs text-muted-foreground">
                  — Beta user
                </footer>
              </blockquote>

              <blockquote className={cn(liquidGlassCard, "p-4")}>
                <p className="text-sm leading-relaxed text-foreground/90">
                  “Goals without pressure is exactly what I needed.”
                </p>
                <footer className="mt-3 text-xs text-muted-foreground">
                  — Beta user
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Offer + CTA */}
        <section className="mt-12">
          <div className={cn(liquidGlassCard, "p-6 md:p-8")}>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-medium tracking-tight">
                  Start with the free journal. Upgrade when you want deeper
                  reflection.
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Premium unlocks AI-guided reflection and pattern summaries. No
                  ads. No feed. No noise.
                </p>
              </div>
              <Button
                variant="glass"
                size="lg"
                asChild
                className="w-full md:w-auto"
              >
                <Link href="/register">Get started</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Short form (optional, minimal) */}
        <section className="mt-12">
          <div className={cn(liquidGlassCard, "p-6")}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium tracking-tight">
                  Want updates?
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Leave an email for early access.
                </p>
              </div>

              {/* Keep this simple—wire to your backend later */}
              <form className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className={cn(
                    liquidGlassCard,
                    "h-11 w-full px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                />
                <Button variant="glass" className="h-11">
                  Join
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer (no distraction links) */}
        <footer className="mt-10 pb-16 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} meletaó • Built for calm reflection
        </footer>
      </section>
    </main>
  );
}
