"use client";

import { useState, useMemo } from "react";
import { Order } from "@/types";
import PageHeader from "@/components/admin/shared/PageHeader";
import { PageContainer } from "@/components/ui/PageContainer";
import OrderFilterBar from "@/components/admin/orders/OrderFilterBar";
import MobileOrderFilterBar from "@/components/admin/orders/MobileOrderFilterBar";
import OrderDataTable from "@/components/admin/orders/OrderDataTable";
import MobileOrderListView from "@/components/admin/orders/MobileOrderListView";
import LovePagination from "@/components/admin/ui/LovePagination/LovePagination";
import OrderDetailModal from "@/components/admin/orders/OrderDetailModal";
import { useOrders, useUpdateOrder } from "@/apis/orders";
import { useMessage } from "@/components/ui/Message";

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [] } = useOrders();
  const updateOrder = useUpdateOrder();
  const message = useMessage();

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    const targetOrder =
      orders.find((order) => order.id === orderId) ?? selectedOrder ?? null;

    try {
      await updateOrder.mutateAsync({ id: orderId, status: newStatus });
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      if (newStatus === "cancelled" && targetOrder) {
        message.success(
          `订单已取消，已退回 💋 ${targetOrder.totalKiss} / 🫂 ${targetOrder.totalHug}`
        );
      } else if (newStatus === "preparing") {
        message.success("订单已进入制作中");
      } else if (newStatus === "completed") {
        message.success("订单已标记完成");
      }
    } catch (error) {
      console.error("更新状态失败", error);
      message.error(error instanceof Error ? error.message : "更新状态失败");
    }
  };

  const processedData = useMemo(() => {
    return orders.filter(
      (order) =>
        (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.reason?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === "all" || order.status === filterStatus)
    );
  }, [orders, searchTerm, filterStatus]);

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const validCurrentPage = Math.max(
    1,
    Math.min(currentPage, totalPages > 0 ? totalPages : 1)
  );

  const currentData = processedData.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize
  );

  return (
    <PageContainer>
      <div className="mx-auto pb-20 md:pb-0">
        <PageHeader title="订单管理" subtitle="查看和处理所有订单" />

        <div className="hidden md:block">
          <OrderFilterBar
            onSearch={(term) => {
              setSearchTerm(term);
              setCurrentPage(1);
            }}
            onStatusChange={(val) => {
              setFilterStatus(val);
              setCurrentPage(1);
            }}
            onReset={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setCurrentPage(1);
            }}
          />
        </div>

        <MobileOrderFilterBar
          onSearch={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          onStatusChange={(val) => {
            setFilterStatus(val);
            setCurrentPage(1);
          }}
        />

        <div className="hidden md:block">
          <OrderDataTable
            data={currentData}
            onView={(order) => setSelectedOrder(order)}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>

        <MobileOrderListView
          data={currentData}
          onView={(order) => setSelectedOrder(order)}
          onUpdateStatus={handleUpdateStatus}
        />

        <LovePagination
          total={totalItems}
          page={currentPage}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={(newStatus) =>
            handleUpdateStatus(selectedOrder.id, newStatus)
          }
        />
      )}
    </PageContainer>
  );
}
