import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { liquidGlassButton } from "@/lib/liquid-glass";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]",

        glass: cn(
          liquidGlassButton,
          "text-foreground " +
            "focus-visible:outline-none " +
            "focus-visible:ring-2 focus-visible:ring-ring " +
            "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
            "disabled:hover:bg-white/5 disabled:active:scale-100"
        ),

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost: "hover:bg-muted hover:text-foreground",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-6 rounded-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
