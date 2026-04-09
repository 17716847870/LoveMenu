"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

const themeStyles: Record<
  ThemeName,
  { container: string; text: string; icon: string }
> = {
  couple: {
    container: "bg-white/80 backdrop-blur-md border-b border-pink-100",
    text: "text-pink-900",
    icon: "text-pink-600 hover:bg-pink-50",
  },
  cute: {
    container: "bg-[#fff5fb]/90 backdrop-blur-md border-b border-orange-100",
    text: "text-orange-900",
    icon: "text-orange-500 hover:bg-orange-50",
  },
  minimal: {
    container: "bg-white/90 backdrop-blur-md border-b border-gray-100",
    text: "text-gray-900",
    icon: "text-gray-900 hover:bg-gray-50",
  },
  night: {
    container: "bg-[#1f1f1f]/90 backdrop-blur-md border-b border-gray-800",
    text: "text-white",
    icon: "text-white hover:bg-white/10",
  },
};

export default function EmergencyHeader() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = themeStyles[theme];

  return (
    <div
      className={cn(
        "sticky top-0 z-50 px-4 py-3 flex items-center justify-between",
        styles.container
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className={cn("p-2 rounded-full transition-colors", styles.icon)}
          aria-label="返回"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className={cn("text-lg font-bold", styles.text)}>紧急想吃</h1>
      </div>
    </div>
  );
}
