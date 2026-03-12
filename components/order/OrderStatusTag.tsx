import { OrderStatus } from "../../types";
import { Badge } from "../ui/Badge";

const statusMap: Record<OrderStatus, { label: string; variant: "default" | "success" | "warning" }> = {
  pending: { label: "待处理", variant: "warning" },
  preparing: { label: "制作中", variant: "warning" },
  ready: { label: "可取餐", variant: "success" },
  completed: { label: "已完成", variant: "success" },
  canceled: { label: "已取消", variant: "default" },
};

export const OrderStatusTag = ({ status }: { status: OrderStatus }) => {
  const config = statusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
