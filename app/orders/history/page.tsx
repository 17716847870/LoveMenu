import Link from "next/link";
import { PageContainer } from "../../../components/ui/PageContainer";
import { OrderCard } from "../../../components/order/OrderCard";
import { orders } from "../../../lib/mock-data";

export default function OrderHistoryPage() {
  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">历史订单</h1>
        <Link href="/orders" className="text-sm text-[var(--color-primary)]">
          返回订单
        </Link>
      </div>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </PageContainer>
  );
}
