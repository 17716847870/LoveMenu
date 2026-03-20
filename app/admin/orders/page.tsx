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

// Mock Data
const initialOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "u1",
    status: "pending",
    totalKiss: 5,
    totalHug: 2,
    items: [
      { id: "i1", dish: { id: "d1", name: "草莓松饼", kissPrice: 2, hugPrice: 1, categoryId: "c1" }, quantity: 1 },
      { id: "i2", dish: { id: "d2", name: "日式炸猪排", kissPrice: 3, hugPrice: 1, categoryId: "c2" }, quantity: 1 }
    ],
    createdAt: "2024-03-16 12:30",
    reason: "饿了想吃好吃的",
    isEmergency: false
  },
  {
    id: "ORD-002",
    userId: "u2",
    status: "preparing",
    totalKiss: 2,
    totalHug: 1,
    items: [
      { id: "i3", dish: { id: "d3", name: "珍珠奶茶", kissPrice: 1, hugPrice: 1, categoryId: "c3" }, quantity: 2 }
    ],
    createdAt: "2024-03-16 13:00",
    reason: "下午茶时间",
    isEmergency: false
  },
  {
    id: "ORD-003",
    userId: "u1",
    status: "completed",
    totalKiss: 3,
    totalHug: 0,
    items: [
      { id: "i4", dish: { id: "d4", name: "章鱼小丸子", kissPrice: 3, hugPrice: 0, categoryId: "c3" }, quantity: 1 }
    ],
    createdAt: "2024-03-15 18:20",
    reason: "夜宵走起",
    isEmergency: true,
    memory: {
      text: "今天的章鱼小丸子特别好吃！木鱼花给得超多～",
      image: [
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60"
      ]
    }
  }
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 详情弹窗状态
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const processedData = useMemo(() => {
    return orders.filter(order => 
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
       order.reason?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || order.status === filterStatus)
    );
  }, [searchTerm, filterStatus]);

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages > 0 ? totalPages : 1));
  
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
          onUpdateStatus={(newStatus) => handleUpdateStatus(selectedOrder.id, newStatus)}
        />
      )}
    </PageContainer>
  );
}
