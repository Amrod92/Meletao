import * as React from "react";

import { cn } from "@/lib/utils";
import { liquidGlassCard } from "@/lib/liquid-glass";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      liquidGlassCard,
      "flex min-h-[140px] w-full rounded-xl p-3 text-sm outline-none",
      "placeholder:text-muted-foreground",
      "focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
