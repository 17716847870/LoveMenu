import { Order } from "../../types";
import { Card } from "../ui/Card";
import { OrderStatusTag } from "./OrderStatusTag";
import { formatDate, formatPrice } from "../../utils/format";

type OrderCardProps = {
  order: Order;
};

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-semibold">订单 #{order.id}</h4>
          <p className="text-xs text-[var(--color-muted)]">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusTag status={order.status} />
      </div>
      <div className="flex flex-wrap gap-2 text-sm text-[var(--color-muted)]">
        {order.items.map((item) => (
          <span key={item.id}>
            {item.name} × {item.quantity}
          </span>
        ))}
      </div>
      <p className="text-sm font-medium">
        {formatPrice(order.totalKiss, order.totalHug)}
      </p>
    </Card>
  );
};
