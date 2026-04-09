import { Order } from "@/types";
import { Card } from "@/components/ui/Card";
import { OrderStatusTag } from "@/components/order/OrderStatusTag";
import { Heart, User } from "lucide-react";
import { formatDateTime } from "@/utils/format";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {formatDateTime(order.createdAt)}
        </span>
        <OrderStatusTag status={order.status} />
      </div>

      <div className="flex flex-col gap-1">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.dish.name} × {item.quantity}
            </span>
            <div className="flex gap-2 text-muted-foreground text-xs">
              {item.dish.kissPrice > 0 && (
                <span>❤️ {item.dish.kissPrice * item.quantity}</span>
              )}
              {item.dish.hugPrice > 0 && (
                <span>🤗 {item.dish.hugPrice * item.quantity}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t">
        <span className="flex items-center gap-1 text-pink-500 font-medium">
          <Heart size={16} fill="currentColor" /> {order.totalKiss}
        </span>
        <span className="flex items-center gap-1 text-orange-500 font-medium">
          <User size={16} /> {order.totalHug}
        </span>
      </div>
    </Card>
  );
}
