import { Order } from "../../types";
import { Card } from "../ui/Card";
import { OrderStatusTag } from "../order/OrderStatusTag";

type TodayOrderListProps = {
  orders: Order[];
};

export const TodayOrderList = ({ orders }: TodayOrderListProps) => {
  return (
    <Card>
      <h3 className="mb-3 text-base font-semibold">今日已点</h3>
      <div className="space-y-2 text-sm">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between">
            <span>订单 #{order.id}</span>
            <OrderStatusTag status={order.status} />
          </div>
        ))}
      </div>
    </Card>
  );
};
