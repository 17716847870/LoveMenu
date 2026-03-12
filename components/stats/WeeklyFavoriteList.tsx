import { Order } from "../../types";
import { Card } from "../ui/Card";

type WeeklyFavoriteListProps = {
  orders: Order[];
};

export const WeeklyFavoriteList = ({ orders }: WeeklyFavoriteListProps) => {
  const dishCount = orders.flatMap((order) => order.items).length;
  return (
    <Card>
      <h3 className="mb-3 text-base font-semibold">本周最爱</h3>
      <p className="text-sm text-[var(--color-muted)]">
        本周共点了 {dishCount} 份菜品
      </p>
    </Card>
  );
};
