import * as React from "react";

import { cn } from "@/lib/utils";
import { liquidGlassCard } from "@/lib/liquid-glass";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          liquidGlassCard,
          "flex h-11 w-full rounded-xl px-3 text-sm outline-none",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
