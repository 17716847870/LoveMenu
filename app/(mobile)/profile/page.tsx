import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import { Heart, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 pt-4">
        <Avatar className="h-20 w-20 border-2 border-primary" alt="User" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">宝贝</h1>
          <p className="text-muted-foreground">今天也要开心哦</p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="rounded-[var(--radius-lg)] bg-card p-6 shadow-[var(--shadow)] border border-border">
        <h2 className="mb-4 text-lg font-semibold">我的余额</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-md)] bg-pink-50 p-4 dark:bg-pink-950/30">
            <Heart className="mb-2 h-6 w-6 text-pink-500" fill="currentColor" />
            <span className="text-sm text-muted-foreground">亲亲余额</span>
            <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">12</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-md)] bg-orange-50 p-4 dark:bg-orange-950/30">
            <UserIcon className="mb-2 h-6 w-6 text-orange-500" />
            <span className="text-sm text-muted-foreground">贴贴余额</span>
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">8</span>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">历史订单</h2>
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-[var(--radius-md)] bg-card p-4 shadow-sm border border-border">
              <div className="flex flex-col gap-1">
                <span className="font-medium">鸡翅 + 炒饭</span>
                <span className="text-xs text-muted-foreground">2024-03-12 18:30</span>
              </div>
              <Badge variant="secondary">已完成</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Switcher */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">主题切换</h2>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
