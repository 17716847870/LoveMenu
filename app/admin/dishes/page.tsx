import { PageContainer } from "../../../components/ui/PageContainer";
import { Card } from "../../../components/ui/Card";
import { dishes } from "../../../lib/mock-data";
import { formatPrice } from "../../../utils/format";

export default function AdminDishesPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">菜品管理</h1>
      <div className="mt-6 space-y-3">
        {dishes.map((dish) => (
          <Card key={dish.id} className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">{dish.name}</h3>
              <p className="text-sm text-[var(--color-muted)]">
                {formatPrice(dish.kissPrice, dish.hugPrice)}
              </p>
            </div>
            <span className="text-sm text-[var(--color-muted)]">
              热度 {dish.popularity}
            </span>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
