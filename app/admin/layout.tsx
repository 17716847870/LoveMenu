import AdminSidebar from "@/components/admin/shared/AdminSidebar";
import AdminMobileTabBar from "@/components/admin/shared/AdminMobileTabBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-pink-50/30">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 pb-20 md:pb-4 p-4 md:p-8">
        {children}
      </div>

      {/* Mobile Tab Bar */}
      <AdminMobileTabBar />
    </div>
  );
}
