import { PageContainer } from "../../../components/ui/PageContainer";
import { Card } from "../../../components/ui/Card";
import { dishCategories } from "../../../lib/mock-data";

export default function AdminCategoriesPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">分类管理</h1>
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
