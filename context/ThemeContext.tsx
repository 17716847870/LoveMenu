"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ThemeName } from "@/types";
import { defaultTheme, setDocumentTheme } from "@/lib/theme";

const storageKey = "lovemenu-theme";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as ThemeName | null;
    if (stored) {
      setThemeState(stored);
      setDocumentTheme(stored);
    } else {
      setDocumentTheme(defaultTheme);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    setDocumentTheme(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  // Prevent hydration mismatch
  // if (!mounted) {
  //   return <>{children}</>;
  // }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
