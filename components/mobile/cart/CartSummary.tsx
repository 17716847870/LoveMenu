"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

interface CartSummaryProps {
  totals: { kiss: number; hug: number };
}

const themeStyles: Record<ThemeName, { container: string; text: string }> = {
  couple: {
    container: "bg-white border-t border-pink-100",
    text: "text-pink-900",
  },
  cute: {
    container: "bg-[#fff5fb] border-t border-orange-100",
    text: "text-orange-900",
  },
  minimal: {
    container: "bg-white border-t border-gray-100",
    text: "text-gray-900",
  },
  night: {
    container: "bg-[#1f1f1f] border-t border-gray-800",
    text: "text-white",
  },
};

export default function CartSummary({ totals }: CartSummaryProps) {
  const { theme } = useTheme();
  const styles = themeStyles[theme];

  return (
    <div className={cn("px-4 py-4 pb-28", styles.container)}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">商品小计</span>
          <div className={cn("font-medium flex gap-2", styles.text)}>
            <span>❤️ {totals.kiss}</span>
            <span>🤗 {totals.hug}</span>
          </div>
        </div>

        {/* Placeholder for future features like discounts or balance deduction */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">亲亲余额抵扣</span>
          <span className="text-gray-400">-0</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">贴贴余额抵扣</span>
          <span className="text-gray-400">-0</span>
        </div>

        <div className="border-t border-dashed my-2 opacity-20" />

        <div className="flex justify-between items-center font-bold text-lg">
          <span className={styles.text}>总计</span>
          <div className={cn("flex gap-3", styles.text)}>
            <span>❤️ {totals.kiss}</span>
            <span>🤗 {totals.hug}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
