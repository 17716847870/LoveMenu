import Image from "next/image";
import { Dish } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { formatPrice } from "../../utils/format";

type DishCardProps = {
  dish: Dish;
  onAdd?: (dish: Dish) => void;
};

export const DishCard = ({ dish, onAdd }: DishCardProps) => {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-[var(--color-accent)]">
        {dish.image ? (
          <Image src={dish.image} alt={dish.name} fill className="object-cover" />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div>
          <h3 className="text-base font-semibold">{dish.name}</h3>
          <p className="text-sm text-[var(--color-muted)]">{dish.description}</p>
        </div>
        <p className="text-sm font-medium">{formatPrice(dish.kissPrice, dish.hugPrice)}</p>
      </div>
      <Button onClick={() => onAdd?.(dish)}>加入购物车</Button>
    </Card>
  );
};
