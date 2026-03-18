import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import PageHeader from "@/components/admin/shared/PageHeader";

export default function AdminUIPage() {
  return (
    <div className="p-4">
      <PageHeader title="UI 配置" subtitle="管理系统界面主题和风格" />
      <div className="max-w-md">
        <h2 className="text-lg font-semibold mb-2">系统主题</h2>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
