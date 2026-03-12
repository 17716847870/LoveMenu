import { ThemeName } from "@/types";

export const defaultTheme: ThemeName = "couple";

export const themes: { name: ThemeName; label: string }[] = [
  { name: "couple", label: "情侣风" },
  { name: "cute", label: "可爱风" },
  { name: "minimal", label: "极简风" },
  { name: "night", label: "夜间模式" },
];

export const setDocumentTheme = (theme: ThemeName) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
};
