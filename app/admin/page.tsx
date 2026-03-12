import Link from "next/link";
import { PageContainer } from "../../components/ui/PageContainer";
import { Card } from "../../components/ui/Card";

export default function AdminPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">管理后台</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          { href: "/admin/dishes", label: "菜品管理" },
          { href: "/admin/categories", label: "分类管理" },
          { href: "/admin/orders", label: "订单管理" },
          { href: "/admin/chat", label: "聊天管理" },
          { href: "/admin/ui", label: "UI 配置管理" },
        ].map((item) => (
          <Card key={item.href} className="flex items-center justify-between">
            <span>{item.label}</span>
            <Link href={item.href} className="text-sm text-[var(--color-primary)]">
              进入
            </Link>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
