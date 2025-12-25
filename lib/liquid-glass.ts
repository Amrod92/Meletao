// lib/liquid-glass.ts
import { cn } from "@/lib/utils";

/**
 * Core Liquid Glass (matches your example: border highlight, inset shine,
 * soft glow, before/after gradients).
 */
export const liquidGlassBase =
  "relative overflow-hidden antialiased " +
  "backdrop-blur-sm " +
  "bg-white/5 dark:bg-white/5 " +
  "border border-white/50 dark:border-white/20 " +
  "shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] " +
  "before:absolute before:inset-0 before:rounded-[inherit] " +
  "before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none " +
  "after:absolute after:inset-0 after:rounded-[inherit] " +
  "after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none";

/** Nav containers **/
export const liquidGlassNav = cn(
  liquidGlassBase,
  "backdrop-blur-md rounded-2xl"
);

/** Cards / panels **/
export const liquidGlassCard = cn(
  liquidGlassBase,
  "rounded-2xl bg-black/5 dark:bg-white/5"
);

/** Buttons **/
export const liquidGlassButton = cn(
  liquidGlassBase,
  "rounded-xl " +
    "inline-flex items-center justify-center " +
    "transition-all duration-300 " +
    "hover:bg-white/30 active:scale-[0.98]"
);
