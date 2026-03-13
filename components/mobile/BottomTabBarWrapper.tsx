"use client";

import { usePathname } from "next/navigation";
import BottomTabBar from "./BottomTabBar";

export default function BottomTabBarWrapper() {
  const pathname = usePathname();

  // Define paths where the BottomTabBar should be hidden
  const hiddenPaths = ["/chat", "/orders", "/menu/"];

  // Check if current path starts with any of the hidden paths
  const shouldHide = hiddenPaths.some((path) => pathname.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return <BottomTabBar />;
}