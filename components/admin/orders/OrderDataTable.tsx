import React from 'react';
import { Order } from '@/types';
import { Clock, AlertCircle, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderDataTableProps {
  data: Order[];
  onView?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, newStatus: Order['status']) => void;
}

const statusConfig = {
  pending: { label: "待处理", color: "text-orange-500 bg-orange-50", icon: Clock },
  preparing: { label: "制作中", color: "text-blue-500 bg-blue-50", icon: AlertCircle },
  completed: { label: "已完成", color: "text-green-500 bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "已取消", color: "text-gray-500 bg-gray-50", icon: XCircle },
};

export default function OrderDataTable({ data, onView, onUpdateStatus }: OrderDataTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-50 overflow-hidden mb-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-pink-50/50 text-gray-600 text-sm border-b border-pink-100">
            <th className="py-4 px-6 font-medium">订单号</th>
            <th className="py-4 px-6 font-medium">下单时间</th>
            <th className="py-4 px-6 font-medium">内容</th>
            <th className="py-4 px-6 font-medium">总价</th>
            <th className="py-4 px-6 font-medium">状态</th>
            <th className="py-4 px-6 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pink-50/50">
          {data.map((order) => {
            const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
            return (
              <tr key={order.id} className="hover:bg-pink-50/30 transition-colors group">
                <td className="py-4 px-6 font-medium text-gray-900">
                  {order.id}
                  {order.isEmergency && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-500 rounded-full">紧急</span>
                  )}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">{order.createdAt}</td>
                <td className="py-4 px-6 text-sm text-gray-600">
                  <div className="max-w-[200px] truncate">
                    {order.items.map(item => item.dish.name).join(", ")}
                  </div>
                  {order.reason && <div className="text-xs text-gray-400 mt-1">备注: {order.reason}</div>}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-pink-500">
                    <span>💋 {order.totalKiss}</span>
                    <span>🤗 {order.totalHug}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusConfig[order.status as keyof typeof statusConfig]?.color)}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig[order.status as keyof typeof statusConfig]?.label}
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end items-center gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => onUpdateStatus?.(order.id, 'preparing')}
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors text-xs font-medium border border-blue-100"
                      >
                        开始制作
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => onUpdateStatus?.(order.id, 'completed')}
                        className="text-green-500 hover:text-green-600 hover:bg-green-50 px-2.5 py-1.5 rounded-md transition-colors text-xs font-medium border border-green-100"
                      >
                        标记完成
                      </button>
                    )}
                    <button 
                      onClick={() => onView?.(order)}
                      className="text-gray-400 hover:text-pink-500 transition-colors p-2"
                      title="查看详情"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          暂无订单数据
        </div>
      )}
    </div>
  );
}
