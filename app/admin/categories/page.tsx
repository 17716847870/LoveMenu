import { PageContainer } from "../../../components/ui/PageContainer";
import { Card } from "../../../components/ui/Card";
import { dishCategories } from "../../../lib/mock-data";
import PageHeader from "@/components/admin/shared/PageHeader";

export default function AdminCategoriesPage() {
  return (
    <PageContainer>
      <PageHeader title="分类管理" subtitle="管理菜品和菜单分类" />
      <div className="mt-6 space-y-3">
        {dishCategories.map((category) => (
          <Card key={category.id} className="flex items-center justify-between">
            <span>{category.name}</span>
            <span className="text-sm text-[var(--color-muted)]">
              排序 {category.sortOrder}
            </span>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
