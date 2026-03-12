"use client";

import { themes } from "../../lib/theme";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils/format";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-wrap gap-2">
      {themes.map((item) => (
        <button
          key={item.name}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm",
            theme === item.name
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-accent)] text-[var(--color-text)]",
          )}
          onClick={() => setTheme(item.name)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
