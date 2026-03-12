import { PageContainer } from "../../../components/ui/PageContainer";
import { OrderCard } from "../../../components/order/OrderCard";
import { orders } from "../../../lib/mock-data";

export default function AdminOrdersPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">订单管理</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </PageContainer>
  );
}
