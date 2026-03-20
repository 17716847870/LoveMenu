"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { ThemeName } from "@/types";
import { cn } from "@/lib/utils";

const themeStyles: Record<ThemeName, string> = {
  couple: "text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 bg-white",
  cute: "text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600 bg-white shadow-[4px_4px_0px_0px_rgba(251,146,60,0.2)]",
  minimal: "text-gray-900 border-gray-200 hover:bg-gray-100 bg-white",
  night: "text-red-400 border-red-900/50 hover:bg-red-900/20 bg-slate-800 shadow-[0_0_20px_rgba(239,68,68,0.1)]",
};

export default function LogoutButton() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className={cn(
        "w-full mt-4 flex items-center justify-center gap-2 py-6 rounded-2xl shadow-sm transition-all duration-300",
        themeStyles[theme]
      )}
    >
      <LogOut className="w-5 h-5" />
      <span className="font-medium text-base">退出登录</span>
    </Button>
  );
}
