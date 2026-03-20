import AdminSidebar from "@/components/admin/shared/AdminSidebar";
import AdminMobileTabBar from "@/components/admin/shared/AdminMobileTabBar";
import AdminContentWrapper from "@/components/admin/shared/AdminContentWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-auto bg-pink-50/30">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content with smart padding based on route */}
      <AdminContentWrapper>
        {children}
      </AdminContentWrapper>

      {/* Mobile Tab Bar */}
      <AdminMobileTabBar />
    </div>
  );
}
