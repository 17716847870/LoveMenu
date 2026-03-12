import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

export default function AdminUIPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">UI 配置</h1>
      <div className="max-w-md">
        <h2 className="text-lg font-semibold mb-2">系统主题</h2>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
