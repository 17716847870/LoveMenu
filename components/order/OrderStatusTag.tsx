import { Badge } from "@/components/ui/Badge";

type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export const OrderStatusTag = ({ status }: { status: OrderStatus }) => {
  const variants = {
    pending: "secondary",
    preparing: "default",
    ready: "default",
    completed: "outline",
    cancelled: "destructive",
  } as const;

  const labels = {
    pending: "等待接单",
    preparing: "制作中",
    ready: "做好了",
    completed: "已完成",
    cancelled: "已取消",
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
};
