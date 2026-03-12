"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Home,  
  MessageCircle, 
  User, 
  Heart, 
  Plus, 
  Zap, 
  Menu as MenuIcon,
  Utensils
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { ThemeName } from "@/types";

// Theme Configuration Types
interface ThemeStyle {
  container: string;
  itemWrapper: string;
  itemActive: string;
  itemInactive: string;
  centerButton: string;
  centerIconColor: string;
  centerIcon: React.ElementType;
  centerLabel: string;
  indicator?: string;
}

// Theme Configurations
const themeStyles: Record<ThemeName, ThemeStyle> = {
  couple: {
    container: "bg-pink-50/90 backdrop-blur-md rounded-full shadow-lg mx-4 mb-4 border border-pink-100 h-16",
    itemWrapper: "flex flex-col items-center justify-center gap-1",
    itemActive: "text-pink-500",
    itemInactive: "text-pink-300 hover:text-pink-400",
    centerButton: "bg-gradient-to-tr from-pink-400 to-rose-400 shadow-lg shadow-pink-200 -mt-6 h-14 w-14 rounded-full flex items-center justify-center border-4 border-white",
    centerIconColor: "text-white",
    centerIcon: Heart,
    centerLabel: "",
    indicator: "bg-pink-500",
  },
  cute: {
    container: "bg-orange-50/95 backdrop-blur-sm rounded-t-[2rem] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] h-20 pb-4",
    itemWrapper: "flex flex-col items-center justify-center gap-1 p-2 rounded-full transition-all",
    itemActive: "text-orange-600 bg-yellow-100 scale-110",
    itemInactive: "text-orange-300 hover:bg-orange-100/50",
    centerButton: "bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-orange-200 -mt-8 h-16 w-16 rounded-full flex items-center justify-center border-[6px] border-orange-50",
    centerIconColor: "text-white",
    centerIcon: Utensils,
    centerLabel: "",
  },
  minimal: {
    container: "bg-white border-t border-gray-100 h-16",
    itemWrapper: "flex flex-col items-center justify-center gap-1 h-full w-full relative",
    itemActive: "text-black font-medium",
    itemInactive: "text-gray-400 hover:text-gray-600",
    centerButton: "bg-white border-2 border-black h-12 w-12 rounded-full flex items-center justify-center -mt-6 shadow-sm",
    centerIconColor: "text-black",
    centerIcon: Plus,
    centerLabel: "",
    indicator: "absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-black rounded-t-full",
  },
  night: {
    container: "bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 h-16",
    itemWrapper: "flex flex-col items-center justify-center gap-1",
    itemActive: "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]",
    itemInactive: "text-slate-600 hover:text-slate-400",
    centerButton: "bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-900/50 -mt-6 h-14 w-14 rounded-xl rotate-45 flex items-center justify-center border-2 border-slate-700",
    centerIconColor: "text-white -rotate-45", // Counter-rotate icon
    centerIcon: Zap,
    centerLabel: "",
  },
};

const navItems = [
  { path: "/", label: "首页", icon: Home },
  { path: "/menu", label: "菜单", icon: MenuIcon },
  { path: "/chat", label: "聊天", icon: MessageCircle },
  { path: "/profile", label: "我的", icon: User },
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme] || themeStyles.couple;
  
  const CenterIcon = currentTheme.centerIcon;

  // Split items for left and right of center button
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2, 4);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center w-full">
      <div className={cn(
        "w-full max-w-[480px] pointer-events-auto transition-all duration-300 ease-in-out px-2 flex items-center justify-between",
        currentTheme.container
      )}>
        
        {/* Left Items */}
        <div className="flex flex-1 justify-around items-center">
          {leftItems.map((item) => (
            <TabItem 
              key={item.path} 
              item={item} 
              isActive={pathname === item.path} 
              theme={currentTheme}
              themeName={theme}
            />
          ))}
        </div>

        {/* Center Button */}
        <div className="relative px-2 shrink-0 flex flex-col items-center justify-center">
          <Link href="/menu">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={theme === 'couple' ? { 
                y: [0, -4, 0],
                scale: [1, 1.05, 1]
              } : {}}
              transition={theme === 'couple' ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
              className={cn(currentTheme.centerButton)}
            >
              <CenterIcon className={cn("w-6 h-6", currentTheme.centerIconColor)} />
            </motion.div>
          </Link>
          {currentTheme.centerLabel && (
            <span className={cn(
              "text-[10px] font-medium mt-1 absolute -bottom-2 w-full text-center",
              theme === 'night' ? "text-slate-400" : "text-gray-500"
            )}>
              {currentTheme.centerLabel}
            </span>
          )}
        </div>

        {/* Right Items */}
        <div className="flex flex-1 justify-around items-center">
          {rightItems.map((item) => (
            <TabItem 
              key={item.path} 
              item={item} 
              isActive={pathname === item.path} 
              theme={currentTheme}
              themeName={theme}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

interface TabItemProps {
  item: { path: string; label: string; icon: React.ElementType };
  isActive: boolean;
  theme: ThemeStyle;
  themeName: ThemeName;
}

function TabItem({ item, isActive, theme, themeName }: TabItemProps) {
  const Icon = item.icon;
  
  return (
    <Link href={item.path} className="w-full flex justify-center">
      <motion.div 
        className={cn(theme.itemWrapper, isActive ? theme.itemActive : theme.itemInactive)}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          {isActive && themeName === 'cute' && (
            <motion.div
              layoutId="cute-bubble"
              className="absolute -inset-2 bg-yellow-100 -z-10 rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {isActive && theme.indicator && (
            <motion.div
              layoutId="indicator"
              className={theme.indicator}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </div>
        <span className="text-[10px] font-medium">
          {item.label}
        </span>
      </motion.div>
    </Link>
  );
}
