"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 聊天页面在移动端不需要外层 padding，以便全屏铺满
  const isChatPage = pathname === "/admin/chat";

  return (
    <div 
      className={cn(
        "flex-1 md:ml-64",
        // PC端总是保持 padding
        "md:p-8",
        // 移动端：如果是聊天页面则去除所有 padding 和底部留白，否则保持默认的 p-4
        isChatPage ? "p-0 pb-0" : "p-4 pb-20 md:pb-8"
      )}
    >
      {children}
    </div>
  );
}
