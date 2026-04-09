"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import DailyRecommendation from "@/components/mobile/recommendation/DailyRecommendation";

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-linear-to-b from-pink-50 to-white",
  cute: "bg-[#fff5fb]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

const headerStyles: Record<ThemeName, string> = {
  couple: "text-pink-900",
  cute: "text-orange-900",
  minimal: "text-gray-900",
  night: "text-white",
};

export default function RecommendationPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const currentTheme = pageStyles[theme] || pageStyles.couple;
  const currentHeader = headerStyles[theme] || headerStyles.couple;

  return (
    <div
      className={cn(
        "min-h-screen p-4 transition-colors duration-300",
        currentTheme
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-2">
        <button
          onClick={() => router.back()}
          className={cn(
            "p-2 rounded-full hover:bg-black/5 transition-colors",
            currentHeader
          )}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className={cn("text-xl font-bold", currentHeader)}>更多推荐</h1>
      </div>

      <DailyRecommendation compact={false} />
    </div>
  );
}
