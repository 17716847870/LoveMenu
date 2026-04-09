"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Menu, Receipt, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import TabItem from "./TabItem";
import CartButton from "./CartButton";

// Left tabs (before cart)
const leftTabs = [
  {
    label: "首页",
    path: "/",
    icon: Home,
  },
  {
    label: "菜单",
    path: "/menu",
    icon: Menu,
  },
];

// Right tabs (after cart)
const rightTabs = [
  {
    label: "订单",
    path: "/orders",
    icon: Receipt,
  },
  {
    label: "我的",
    path: "/profile",
    icon: User,
  },
];

const visiblePaths = ["/", "/menu", "/orders", "/profile"];

export default function BottomTabBar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { items } = useCart();

  const shouldShow = visiblePaths.includes(pathname);

  if (!shouldShow) {
    return null;
  }

  const getContainerStyles = () => {
    switch (theme) {
      case "couple":
        return "bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100/50 shadow-[0_8px_30px_rgba(255,182,193,0.4)]";
      case "cute":
        return "bg-[#fffcf3] border-2 border-orange-100 shadow-[0_8px_30px_rgba(255,200,100,0.2)]";
      case "night":
        return "bg-[#1f1f1f]/90 backdrop-blur-md border border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.6)]";
      case "minimal":
      default:
        return "bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)]";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "fixed bottom-5 left-4 right-4 z-50 h-16 rounded-3xl max-w-120 mx-auto",
        getContainerStyles()
      )}
    >
      <div className="flex items-center justify-between h-full px-2 relative">
        {/* Left Tabs */}
        <div className="flex flex-1 justify-around">
          {leftTabs.map((tab) => (
            <TabItem
              key={tab.path}
              {...tab}
              isActive={pathname === tab.path}
              theme={theme}
            />
          ))}
        </div>

        {/* Center Space for Floating Cart Button */}
        <div className="w-16 flex justify-center relative">
          <CartButton
            isActive={pathname === "/cart"}
            theme={theme}
            cartCount={items.length}
          />
        </div>

        {/* Right Tabs */}
        <div className="flex flex-1 justify-around">
          {rightTabs.map((tab) => (
            <TabItem
              key={tab.path}
              {...tab}
              isActive={pathname === tab.path}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
