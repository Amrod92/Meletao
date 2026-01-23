"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-4 text-foreground",
        "shadow-[0_16px_40px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-0",
        "before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),rgba(255,255,255,0.2)_45%,transparent_70%)]",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-3",
        month: "space-y-3",
        month_caption: "flex items-center gap-2",
        caption_label: "order-1 text-sm font-medium tracking-tight",
        nav: "order-2 ml-auto flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 rounded-full border border-white/40 bg-white/60 p-0 text-foreground/80",
          "shadow-[0_8px_18px_-12px_rgba(15,23,42,0.45)]",
          "hover:bg-white hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/30"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 rounded-full border border-white/40 bg-white/60 p-0 text-foreground/80",
          "shadow-[0_8px_18px_-12px_rgba(15,23,42,0.45)]",
          "hover:bg-white hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/30"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "w-8 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground",
        weeks: "flex flex-col",
        week: "mt-1.5 flex w-full",
        day: [
          "relative h-8 w-8 p-0 text-center text-sm",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md",
          "last:[&:has([aria-selected])]:rounded-r-md",
          "focus-within:relative focus-within:z-20",
        ].join(" "),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 rounded-lg p-0 text-[0.82rem] font-medium text-foreground",
          "hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-primary/30",
          "aria-selected:opacity-100"
        ),
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected:
          "bg-primary text-primary-foreground shadow-[0_10px_22px_-14px_rgba(15,23,42,0.6)]",
        today: "border border-primary/30 bg-white/60",
        outside:
          "day-outside text-muted-foreground/70 opacity-60 aria-selected:bg-white/40 aria-selected:text-muted-foreground aria-selected:opacity-40",
        disabled: "text-muted-foreground/60 opacity-60",
        range_middle: "aria-selected:bg-white/50 aria-selected:text-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className: iconClassName, ...iconProps }) => (
          <ChevronLeft className={cn("h-4 w-4", iconClassName)} {...iconProps} />
        ),
        IconRight: ({ className: iconClassName, ...iconProps }) => (
          <ChevronRight
            className={cn("h-4 w-4", iconClassName)}
            {...iconProps}
          />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
