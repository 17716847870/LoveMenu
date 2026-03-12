"use client";

import { useEffect, useState } from "react";
import { ThemeName } from "../types";
import { defaultTheme, setDocumentTheme } from "../lib/theme";

const storageKey = "lovemenu-theme";

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return defaultTheme;
    const stored = localStorage.getItem(storageKey) as ThemeName | null;
    return stored ?? defaultTheme;
  });

  useEffect(() => {
    setDocumentTheme(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, theme);
    }
  }, [theme]);

  return {
    theme,
    setTheme,
  };
};
