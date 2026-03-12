"use client";

import { PropsWithChildren, useEffect } from "react";
import { defaultTheme, setDocumentTheme } from "../../lib/theme";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    setDocumentTheme(defaultTheme);
  }, []);
  return <>{children}</>;
};
