"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { liquidGlassButton, liquidGlassNav } from "@/lib/liquid-glass";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export function TopBar() {
  return (
    <header className="sticky top-3 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <NavigationMenu className={cn(liquidGlassNav, "px-3")}>
          <div className="relative flex h-14 w-full items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-base font-medium tracking-tight text-foreground">
                meletaó
              </span>
            </Link>

            {/* Actions */}
            <NavigationMenuList className="flex items-center gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/today"
                    className={cn(
                      liquidGlassButton,
                      "h-10 px-4 text-sm font-medium text-foreground"
                    )}
                  >
                    Open App
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/gratitude"
                    className={cn(
                      liquidGlassButton,
                      "h-10 px-4 text-sm font-medium text-foreground"
                    )}
                  >
                    Gratitude
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </div>
        </NavigationMenu>
      </div>
    </header>
  );
}
