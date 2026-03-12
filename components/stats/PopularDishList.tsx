import { Dish } from "../../types";
import { Card } from "../ui/Card";

type PopularDishListProps = {
  dishes: Dish[];
};

export const PopularDishList = ({ dishes }: PopularDishListProps) => {
  return (
    <Card>
      <h3 className="mb-3 text-base font-semibold">人气菜品</h3>
      <div className="space-y-2 text-sm">
        {dishes.map((dish) => (
          <div key={dish.id} className="flex items-center justify-between">
            <span>{dish.name}</span>
            <span className="text-[var(--color-muted)]">热度 {dish.popularity}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
