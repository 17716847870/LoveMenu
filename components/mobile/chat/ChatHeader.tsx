"use client";

import { MoreHorizontal, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { useUser } from "@/context/UserContext";
import { useUsers } from "@/apis/user";
import { useMemo } from "react";

const themeStyles: Record<ThemeName, {
  container: string;
  title: string;
  status: string;
  icon: string;
}> = {
  couple: {
    container: "bg-white/80 backdrop-blur-md border-b border-pink-100",
    title: "text-pink-900",
    status: "text-green-500",
    icon: "text-pink-400 hover:bg-pink-50",
  },
  cute: {
    container: "bg-white/80 backdrop-blur-md border-b border-orange-100",
    title: "text-orange-900",
    status: "text-green-500",
    icon: "text-orange-400 hover:bg-orange-50",
  },
  minimal: {
    container: "bg-white border-b border-gray-100",
    title: "text-gray-900",
    status: "text-green-600",
    icon: "text-gray-400 hover:bg-gray-50",
  },
  night: {
    container: "bg-slate-900/80 backdrop-blur-md border-b border-slate-800",
    title: "text-blue-100",
    status: "text-green-400",
    icon: "text-slate-400 hover:bg-slate-800",
  },
};

export default function ChatHeader() {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  const { user: currentUser } = useUser();
  const { data: users = [] } = useUsers();

  const partner = useMemo(() => {
    return users.find((u) => u.id !== currentUser?.id);
  }, [users, currentUser]);

  const partnerName = partner?.name || partner?.username || "伴侣";
  const partnerAvatar = partner?.avatar || "";
  const partnerInitial = partnerName.charAt(0).toUpperCase();

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 h-16 px-4 flex items-center justify-between",
      currentTheme.container
    )}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className={cn(
            "p-2 -ml-2 rounded-full transition-colors",
            currentTheme.icon
          )}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="relative">
          <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
            <AvatarImage src={partnerAvatar} />
            <AvatarFallback>{partnerInitial}</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
        </div>

        <div className="flex flex-col">
          <span className={cn("font-bold text-sm leading-none", currentTheme.title)}>
            {partnerName}
          </span>
          <span className={cn("text-[10px] font-medium mt-1 leading-none", currentTheme.status)}>
            在线
          </span>
        </div>
      </div>

      <button className={cn(
        "p-2 rounded-full transition-colors",
        currentTheme.icon
      )}>
        <MoreHorizontal className="w-6 h-6" />
      </button>
    </div>
  );
}
