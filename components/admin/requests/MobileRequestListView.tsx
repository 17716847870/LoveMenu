import React from "react";
import { FoodRequest } from "@/types";
import { Check, X, Trash2, Clock, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MobileRequestListViewProps {
  data: FoodRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  pending: {
    label: "待审核",
    color: "text-orange-500 bg-orange-50",
    icon: Clock,
  },
  approved: {
    label: "已通过",
    color: "text-green-500 bg-green-50",
    icon: ThumbsUp,
  },
  rejected: { label: "已拒绝", color: "text-red-500 bg-red-50", icon: X },
};

export default function MobileRequestListView({
  data,
  onApprove,
  onReject,
  onDelete,
}: MobileRequestListViewProps) {
  return (
    <div className="flex flex-col gap-3 mb-6 md:hidden">
      {data.map((req) => {
        const StatusIcon =
          statusConfig[req.status as keyof typeof statusConfig]?.icon || Clock;
        return (
          <div
            key={req.id}
            className="bg-white p-4 rounded-2xl shadow-sm border border-pink-50/50 flex gap-4"
          >
            <div className="w-20 h-20 rounded-xl bg-gray-50 relative overflow-hidden shrink-0 border border-gray-100">
              {req.image ? (
                <Image
                  src={req.image}
                  alt={req.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  无图
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800 pr-2 line-clamp-1">
                    {req.name}
                  </h3>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap",
                      statusConfig[req.status as keyof typeof statusConfig]
                        ?.color
                    )}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {
                      statusConfig[req.status as keyof typeof statusConfig]
                        ?.label
                    }
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">{req.createdAt}</span>
                <div className="flex gap-2">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => onApprove?.(req.id)}
                        className="w-8 h-8 flex items-center justify-center text-green-500 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => onReject?.(req.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onDelete?.(req.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
          暂无心愿数据
        </div>
      )}
    </div>
  );
}
