import OrderCard from "@/components/order/OrderCard";

export default function AdminOrdersPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">订单管理</h1>
      <div className="border rounded-lg p-4 bg-muted/10">
        <p className="text-muted-foreground text-center">暂无订单</p>
      </div>
    </div>
  );
}
