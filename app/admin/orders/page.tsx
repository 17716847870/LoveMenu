"use client";

import { useState } from "react";
import { Search, Filter, Eye, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Order } from "@/types";
import PageHeader from "@/components/admin/shared/PageHeader";

// Mock Data
const orders: Order[] = [
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
    isEmergency: true
  }
];

const statusConfig = {
  pending: { label: "待处理", color: "text-orange-500 bg-orange-50", icon: Clock },
  preparing: { label: "制作中", color: "text-blue-500 bg-blue-50", icon: AlertCircle },
  completed: { label: "已完成", color: "text-green-500 bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "已取消", color: "text-gray-500 bg-gray-50", icon: XCircle },
};

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = orders.filter(order => 
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     order.reason?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "all" || order.status === filterStatus)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="订单管理" subtitle="查看和处理所有订单" />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="搜索订单号或备注..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {["all", "pending", "preparing", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                filterStatus === status 
                  ? "bg-pink-100 text-pink-600" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              {status === "all" ? "全部" : statusConfig[status as keyof typeof statusConfig]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">订单号</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">下单时间</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">内容</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">总价</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">状态</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
              return (
                <tr key={order.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.id}
                    {order.isEmergency && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-500 rounded-full">紧急</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{order.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="max-w-[200px] truncate">
                      {order.items.map(item => item.dish.name).join(", ")}
                    </div>
                    {order.reason && <div className="text-xs text-gray-400 mt-1">备注: {order.reason}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-pink-500">
                      <span>🍬 {order.totalKiss}</span>
                      <span>🤗 {order.totalHug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusConfig[order.status as keyof typeof statusConfig]?.color)}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig[order.status as keyof typeof statusConfig]?.label}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-pink-500 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => {
          const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
          return (
            <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">{order.id}</span>
                    {order.isEmergency && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-500 rounded-full">紧急</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{order.createdAt}</div>
                </div>
                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusConfig[order.status as keyof typeof statusConfig]?.color)}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusConfig[order.status as keyof typeof statusConfig]?.label}
                </div>
              </div>

              <div className="py-2 border-t border-b border-gray-50">
                <div className="text-sm text-gray-700 font-medium">
                  {order.items.map(item => `${item.dish.name} x${item.quantity}`).join(", ")}
                </div>
                {order.reason && <div className="text-xs text-gray-400 mt-1">备注: {order.reason}</div>}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm font-bold text-pink-500">
                  <span>🍬 {order.totalKiss}</span>
                  <span>🤗 {order.totalHug}</span>
                </div>
                <button className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                  查看详情
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
