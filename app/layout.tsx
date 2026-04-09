import { ThemeProvider } from "@/context/ThemeContext";
import { FlyToCartProvider } from "@/context/FlyToCartContext";
import { CartProvider } from "@/hooks/useCart";
import { UserProvider } from "@/context/UserContext";
import { MessageProvider } from "@/components/ui/Message";
import { ChatRealtimeProvider } from "@/context/ChatRealtimeContext";
import QueryProvider from "@/components/providers/QueryProvider";
import FloatingThemeButton from "@/components/mobile/FloatingThemeButton";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FrontendErrorReporter from "@/components/providers/FrontendErrorReporter";
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

export const viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen`}
      >
        <ThemeProvider>
          <QueryProvider>
            <UserProvider>
              <FlyToCartProvider>
                <CartProvider>
                  <MessageProvider>
                    <ChatRealtimeProvider>
                      <FrontendErrorReporter />
                      <div id="app-root" className="relative w-full">
                        {children}
                        <FloatingThemeButton />
                      </div>
                    </ChatRealtimeProvider>
                  </MessageProvider>
                </CartProvider>
              </FlyToCartProvider>
            </UserProvider>
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
