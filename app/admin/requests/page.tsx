"use client";

import { useState } from "react";
import { Search, Check, X, Trash2, Clock, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { FoodRequest } from "@/types";
import Image from "next/image";

// Mock Data
const requests: FoodRequest[] = [
  {
    id: "req-001",
    name: "韩式炸鸡",
    description: "很想吃甜辣口味的韩式炸鸡，配上腌萝卜",
    status: "pending",
    createdAt: "2024-03-16",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "req-002",
    name: "抹茶千层",
    description: "下午茶想吃这个，稍微苦一点的那种",
    status: "approved",
    createdAt: "2024-03-15",
    image: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "req-003",
    name: "螺蛳粉",
    description: "偶尔也想吃点重口味的嘛",
    status: "rejected",
    createdAt: "2024-03-14",
  }
];

const statusConfig = {
  pending: { label: "待审核", color: "text-orange-500 bg-orange-50", icon: Clock },
  approved: { label: "已通过", color: "text-green-500 bg-green-50", icon: ThumbsUp },
  rejected: { label: "已拒绝", color: "text-red-500 bg-red-50", icon: X },
};

export default function AdminRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRequests = requests.filter(req => 
    (req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     req.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "all" || req.status === filterStatus)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">食物请求</h1>
          <p className="text-sm text-gray-500 mt-1">处理用户的点餐心愿</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="搜索食物名称或描述..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {["all", "pending", "approved", "rejected"].map((status) => (
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
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">请求内容</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">描述</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">提交时间</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">状态</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRequests.map((req) => {
              const StatusIcon = statusConfig[req.status as keyof typeof statusConfig]?.icon || Clock;
              return (
                <tr key={req.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden shrink-0">
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
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {req.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {req.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusConfig[req.status as keyof typeof statusConfig]?.color)}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig[req.status as keyof typeof statusConfig]?.label}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {req.status === "pending" && (
                        <>
                          <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="通过">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="拒绝">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredRequests.map((req) => {
          const StatusIcon = statusConfig[req.status as keyof typeof statusConfig]?.icon || Clock;
          return (
            <div key={req.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-gray-100 relative overflow-hidden shrink-0">
                {req.image ? (
                  <Image src={req.image} alt={req.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    无图
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800">{req.name}</h3>
                    <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", statusConfig[req.status as keyof typeof statusConfig]?.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[req.status as keyof typeof statusConfig]?.label}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{req.description}</p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{req.createdAt}</span>
                  <div className="flex gap-2">
                    {req.status === "pending" && (
                      <>
                        <button className="p-1.5 text-green-500 bg-green-50 rounded-lg">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-red-500 bg-red-50 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button className="p-1.5 text-gray-400 bg-gray-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
