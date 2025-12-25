import { cn } from "@/lib/utils";
import { liquidGlassCard } from "@/lib/liquid-glass";

export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-4 pt-6 pb-28 space-y-4">
      <div className={cn(liquidGlassCard, "h-14")} />
      <div className={cn(liquidGlassCard, "h-40")} />
      <div className={cn(liquidGlassCard, "h-44")} />
      <div className={cn(liquidGlassCard, "h-44")} />
      <div className={cn(liquidGlassCard, "h-36")} />
    </main>
  );
}
