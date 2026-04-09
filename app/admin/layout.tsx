"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/shared/AdminSidebar";
import AdminMobileTabBar, {
  FloatingButtonPosition,
} from "@/components/admin/shared/AdminMobileTabBar";
import AdminContentWrapper from "@/components/admin/shared/AdminContentWrapper";
import { Toaster } from "@/components/ui/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 聊天页面中将按钮移到右上角或左上角，避免遮挡底部输入框
  const isChatPage = pathname === "/admin/chat";
  const buttonPosition: FloatingButtonPosition = isChatPage
    ? "top-right"
    : "bottom-left";

  return (
    <>
      <Toaster />
      <div className="flex flex-col md:flex-row h-screen overflow-auto bg-pink-50/30">
        {/* Desktop Sidebar */}
        <AdminSidebar />

        {/* Main Content with smart padding based on route */}
        <AdminContentWrapper>{children}</AdminContentWrapper>

        {/* Mobile Tab Bar */}
        <AdminMobileTabBar buttonPosition={buttonPosition} />
      </div>
    </>
  );
}
