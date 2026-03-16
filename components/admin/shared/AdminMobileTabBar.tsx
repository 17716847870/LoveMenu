"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ShoppingBag, Users, MessageSquare } from "lucide-react";

export default function AdminMobileTabBar() {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "菜单",
      href: "/admin/dishes",
      icon: Menu
    },
    {
      label: "订单",
      href: "/admin/orders",
      icon: ShoppingBag
    },
    {
      label: "用户",
      href: "/admin/users",
      icon: Users
    },
    {
      label: "请求",
      href: "/admin/requests",
      icon: MessageSquare
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around z-50 shadow-lg">
      {menuItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
              isActive ? "text-pink-500" : "text-gray-400 hover:text-pink-300"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
