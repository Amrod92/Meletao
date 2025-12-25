"use client";

import { BottomNavbar } from "@/components/bottom-navbar";
import { TopBar } from "@/components/topbar";

export function AppNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  return isLoggedIn ? <BottomNavbar /> : <TopBar />;
}
