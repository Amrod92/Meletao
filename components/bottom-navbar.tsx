"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { liquidGlassNav } from "@/lib/liquid-glass";
import { BookOpen, HeartHandshake, Target, Sun } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { label: "Today", href: "/", icon: Sun },
  { label: "Journal", href: "/journal", icon: BookOpen },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Gratitude", href: "/gratitude", icon: HeartHandshake },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-3 z-50">
      <div className="mx-auto max-w-md px-4">
        <div className={cn(liquidGlassNav, "px-2")}>
          <div className="relative flex h-16 items-center justify-between">
            {NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex w-full flex-col items-center justify-center gap-1 rounded-xl py-2 text-xs transition-all duration-300",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className={cn(active && "font-medium")}>
                    {item.label}
                  </span>

                  {/* active indicator (quiet, olive) */}
                  {active && (
                    <span className="absolute -bottom-1 h-1 w-10 rounded-full bg-primary/60" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
