"use client";

import { useTheme } from "@/context/ThemeContext";
import { themes } from "@/lib/theme";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-4">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={`flex h-20 items-center justify-center rounded-[var(--radius-lg)] border-2 transition-all ${
            theme === t.name
              ? "border-primary bg-primary/10 font-bold text-primary"
              : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
