import { ThemeName } from "../types";
import { coupleTheme } from "../themes/couple";
import { cuteTheme } from "../themes/cute";
import { minimalTheme } from "../themes/minimal";
import { nightTheme } from "../themes/night";

export const themes = [coupleTheme, cuteTheme, minimalTheme, nightTheme];

export const defaultTheme: ThemeName = "couple";

export const setDocumentTheme = (theme: ThemeName) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
};
