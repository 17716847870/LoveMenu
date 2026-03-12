import { ThemeProvider } from "@/context/ThemeContext";
import FloatingThemeButton from "@/components/mobile/FloatingThemeButton";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveMenu",
  description: "情侣互动点餐系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen`}>
        <ThemeProvider>
          <div id="app-root" className="relative w-full">
            {children}
            <FloatingThemeButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
