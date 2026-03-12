"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeName } from "@/types";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("couple");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem("love-menu-theme") as ThemeName;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  const handleSetTheme = (newTheme: ThemeName) => {
    setTheme(newTheme);
    localStorage.setItem("love-menu-theme", newTheme);
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      <div data-theme={theme} className="transition-colors duration-300 min-h-screen bg-background text-foreground w-full">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
