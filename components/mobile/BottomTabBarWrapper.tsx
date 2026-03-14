"use client";

import { usePathname } from "next/navigation";
import BottomTabBar from "./navigation/BottomTabBar";

export default function BottomTabBarWrapper() {
  const pathname = usePathname();

  // Define paths where the BottomTabBar should be hidden
  // Hide on detail pages (e.g., /menu/[id]), but show on /menu
  // Hide on chat detail if needed, but show on /chat list
  const hiddenPaths = ["/orders", "/menu/", "/chat", "/cart", "/wishlist", "/feedback", "/emergency"];

  // Check if current path starts with any of the hidden paths
  const shouldHide = hiddenPaths.some((path) => pathname.startsWith(path) && path !== "/menu");

  if (shouldHide) {
    return null;
  }

  return <BottomTabBar />;
}