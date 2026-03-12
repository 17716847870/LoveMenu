import { CartItem as CartItemType } from "../../types";
import { Button } from "../ui/Button";
import { formatPrice } from "../../utils/format";

type CartItemProps = {
  item: CartItemType;
  onUpdate?: (dishId: string, quantity: number) => void;
  onRemove?: (dishId: string) => void;
};

export const CartItem = ({ item, onUpdate, onRemove }: CartItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <div>
        <h4 className="font-medium">{item.name}</h4>
        <p className="text-xs text-[var(--color-muted)]">
          {formatPrice(item.kissPrice, item.hugPrice)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdate?.(item.dishId, item.quantity - 1)}
        >
          -
        </Button>
        <span className="text-sm">{item.quantity}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUpdate?.(item.dishId, item.quantity + 1)}
        >
          +
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onRemove?.(item.dishId)}>
          删除
        </Button>
      </div>
    </div>
  );
};
