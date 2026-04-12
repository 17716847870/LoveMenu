"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarHeart,
  ChevronRight,
  Heart,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { ThemeName } from "@/types";
import { cycleStyles } from "./cycle/config";

const themeIcons: Record<ThemeName, LucideIcon> = {
  couple: Heart,
  cute: Sparkles,
  minimal: CalendarHeart,
  night: Zap,
};

export default function CycleEntryCard() {
  const { theme } = useTheme();
  const styles = cycleStyles[theme];
  const Icon = themeIcons[theme];

  const title =
    theme === "cute"
      ? "🌷 姨妈日历"
      : theme === "minimal"
        ? "Cycle Calendar"
        : theme === "night"
          ? "⚡ 周期记录"
          : "❤️ 生理周期";

  const subTitle =
    theme === "minimal"
      ? "Track periods, symptoms and predictions in calendar view"
      : "日历化记录经期、症状、预测日期，先看页面，后接逻辑。";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Link
        href="/cycle"
        className={cn(
          "block rounded-[2rem] border p-6 transition-all duration-300",
          styles.entry
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl",
                styles.entryIcon
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className={cn("text-lg font-bold", styles.entryText)}>
                {title}
              </h3>
              <p className={cn("mt-1 text-sm leading-6", styles.entrySub)}>
                {subTitle}
              </p>
            </div>
          </div>

          <ChevronRight className={cn("mt-1 h-5 w-5", styles.entryAction)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {["经期记录", "日历视图", "主题适配", "预测快照"].map((item) => (
            <span key={item} className={cn("rounded-full border px-3 py-1.5", styles.chip)}>
              {item}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
