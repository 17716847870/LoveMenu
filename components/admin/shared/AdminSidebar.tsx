"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ShoppingBag, List, MessageSquare, MessageCircle, LogOut, LayoutDashboard, Users } from "lucide-react";

import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <div className="hidden md:flex flex-col w-64 bg-pink-50 border-r border-pink-100 min-h-screen fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-pink-100">
        <h1 className="text-2xl font-bold text-pink-600">LoveMenu Admin</h1>
        <p className="text-xs text-pink-400 mt-1">情侣点餐后台管理</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-200" 
                  : "text-gray-600 hover:bg-pink-100 hover:text-pink-600"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-pink-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
}
