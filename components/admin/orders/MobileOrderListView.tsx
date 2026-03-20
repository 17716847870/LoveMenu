import React from 'react';
import { Order } from '@/types';
import { Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileOrderListViewProps {
  data: Order[];
  onView?: (order: Order) => void;
}

const statusConfig = {
  pending: { label: "待处理", color: "text-orange-500 bg-orange-50", icon: Clock },
  preparing: { label: "制作中", color: "text-blue-500 bg-blue-50", icon: AlertCircle },
  completed: { label: "已完成", color: "text-green-500 bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "已取消", color: "text-gray-500 bg-gray-50", icon: XCircle },
};

export default function MobileOrderListView({ data, onView }: MobileOrderListViewProps) {
  return (
    <div className="flex flex-col gap-3 mb-6 md:hidden">
      {data.map((order) => {
        const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock;
        return (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-pink-50/50 p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{order.id}</span>
                  {order.isEmergency && (
                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-500 rounded-full font-medium">紧急</span>
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
              <div className="text-sm text-gray-700 font-medium line-clamp-2">
                {order.items.map(item => `${item.dish.name} x${item.quantity}`).join(", ")}
              </div>
              {order.reason && <div className="text-xs text-gray-400 mt-1.5 bg-gray-50 p-2 rounded-lg">备注: {order.reason}</div>}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-sm font-bold">
                <span className="text-pink-500">💋 {order.totalKiss}</span>
                <span className="text-blue-500">🤗 {order.totalHug}</span>
              </div>
              <button 
                onClick={() => onView?.(order)}
                className="px-4 py-1.5 text-sm bg-pink-50 text-pink-600 font-medium rounded-xl hover:bg-pink-100 transition-colors"
              >
                查看详情
              </button>
            </div>
          </div>
        );
      })}

      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
          暂无订单数据
        </div>
      )}
    </div>
  );
}
