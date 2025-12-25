"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { liquidGlassButton, liquidGlassNav } from "@/lib/liquid-glass";

export function TopBar() {
  return (
    <header className="sticky top-3 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className={cn(liquidGlassNav, "px-3")}>
          <div className="relative flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-base font-medium tracking-tight text-foreground">
                meletaó
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/today"
                className={cn(
                  liquidGlassButton,
                  "h-10 px-4 text-sm font-medium text-foreground"
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  liquidGlassButton,
                  "h-10 px-4 text-sm font-medium text-foreground"
                )}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
