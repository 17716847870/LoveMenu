"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ShoppingBag, List, MessageSquare, MessageCircle, LayoutDashboard, Menu as MenuIcon, X, LogOut, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";

export type FloatingButtonPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function AdminMobileTabBar({
  buttonPosition = "bottom-left"
}: {
  buttonPosition?: FloatingButtonPosition
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const menuItems = [
    {
      label: "数据看板",
      href: "/admin",
      icon: LayoutDashboard
    },
    {
      label: "分类管理",
      href: "/admin/categories",
      icon: List
    },
    {
      label: "菜单管理",
      href: "/admin/menu",
      icon: Menu
    },
    {
      label: "订单管理",
      href: "/admin/orders",
      icon: ShoppingBag
    },
    {
      label: "食物请求",
      href: "/admin/requests",
      icon: MessageSquare
    },
    {
      label: "消息聊天",
      href: "/admin/chat",
      icon: MessageCircle
    },
    {
      label: "账号管理",
      href: "/admin/accounts",
      icon: Users
    }
  ];

  const getPositionClasses = () => {
    switch (buttonPosition) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-right":
        return "bottom-6 right-4";
      case "bottom-left":
      default:
        return "bottom-6 left-4";
    }
  };

  return (
    <>
      {/* 悬浮菜单按钮 */}
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "md:hidden fixed z-40 w-12 h-12 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 transition-colors",
          getPositionClasses()
        )}
      >
        <MenuIcon size={24} />
      </button>

      {/* 侧边抽屉 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* 抽屉面板 */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Logo & Close Button */}
              <div className="p-6 border-b border-pink-50 flex justify-between items-center bg-pink-50/30">
                <div>
                  <h1 className="text-xl font-bold text-pink-600">LoveMenu</h1>
                  <p className="text-xs text-pink-400 mt-1">情侣点餐后台管理</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-400 hover:text-gray-600 shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                {menuItems.map((item) => {
                  const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  
                  return (
                    <Link 
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium",
                        isActive 
                          ? "bg-pink-50 text-pink-600" 
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isActive ? "text-pink-500" : "text-gray-400")} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Footer / Logout */}
              <div className="p-4 border-t border-gray-50">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>退出登录</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
