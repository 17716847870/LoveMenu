import React from 'react';
import { FoodRequest } from '@/types';
import { Check, X, Trash2, Clock, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface RequestDataTableProps {
  data: FoodRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  pending: { label: "待审核", color: "text-orange-500 bg-orange-50", icon: Clock },
  approved: { label: "已通过", color: "text-green-500 bg-green-50", icon: ThumbsUp },
  rejected: { label: "已拒绝", color: "text-red-500 bg-red-50", icon: X },
};

export default function RequestDataTable({ data, onApprove, onReject, onDelete }: RequestDataTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-50 overflow-hidden mb-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-pink-50/50 text-gray-600 text-sm border-b border-pink-100">
            <th className="py-4 px-6 font-medium">请求内容</th>
            <th className="py-4 px-6 font-medium">描述</th>
            <th className="py-4 px-6 font-medium">提交时间</th>
            <th className="py-4 px-6 font-medium">状态</th>
            <th className="py-4 px-6 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pink-50/50">
          {data.map((req) => {
            const StatusIcon = statusConfig[req.status as keyof typeof statusConfig]?.icon || Clock;
            return (
              <tr key={req.id} className="hover:bg-pink-50/30 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200">
                      {req.image ? (
                        <Image src={req.image} alt={req.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          无图
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-gray-900">{req.name}</div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600 max-w-xs truncate">
                  {req.description}
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {req.createdAt}
                </td>
                <td className="py-4 px-6">
                  <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusConfig[req.status as keyof typeof statusConfig]?.color)}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig[req.status as keyof typeof statusConfig]?.label}
                  </div>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    {req.status === "pending" && (
                      <>
                        <button 
                          onClick={() => onApprove?.(req.id)}
                          className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="通过"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onReject?.(req.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="拒绝"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => onDelete?.(req.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
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
          暂无请求数据
        </div>
      )}
    </div>
  );
}
