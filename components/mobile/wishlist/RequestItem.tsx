"use client";

import React from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { FoodRequest, ThemeName } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Clock, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

interface RequestItemProps {
  request: FoodRequest;
  onEdit: (request: FoodRequest) => void;
  onDelete: (id: string) => void;
}

const themeStyles: Record<ThemeName, {
  card: string;
  title: string;
  desc: string;
  statusBadge: Record<string, string>;
}> = {
  couple: {
    card: "bg-white border border-pink-100 shadow-sm rounded-2xl",
    title: "text-pink-900",
    desc: "text-pink-400",
    statusBadge: {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
    },
  },
  cute: {
    card: "bg-white border-2 border-orange-100 shadow-[4px_4px_0px_0px_rgba(255,237,213,1)] rounded-2xl",
    title: "text-orange-900",
    desc: "text-orange-400",
    statusBadge: {
      pending: "bg-yellow-100 text-yellow-600 border-2 border-yellow-200",
      approved: "bg-green-100 text-green-600 border-2 border-green-200",
      rejected: "bg-red-100 text-red-600 border-2 border-red-200",
    },
  },
  minimal: {
    card: "bg-white border border-gray-200 rounded-lg",
    title: "text-gray-900",
    desc: "text-gray-500",
    statusBadge: {
      pending: "bg-gray-100 text-gray-700 border-gray-200",
      approved: "bg-gray-100 text-gray-900 border-gray-300",
      rejected: "bg-gray-50 text-gray-400 border-gray-200 line-through",
    },
  },
  night: {
    card: "bg-slate-800 border border-slate-700 rounded-2xl shadow-lg",
    title: "text-white",
    desc: "text-slate-400",
    statusBadge: {
      pending: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
      approved: "bg-green-900/30 text-green-400 border-green-800",
      rejected: "bg-red-900/30 text-red-400 border-red-800",
    },
  },
};

const statusConfig = {
  pending: { label: "审核中", icon: Clock },
  approved: { label: "已加入", icon: CheckCircle2 },
  rejected: { label: "未通过", icon: XCircle },
};

export default function RequestItem({ request, onEdit, onDelete }: RequestItemProps) {
  const { theme } = useTheme();
  const styles = themeStyles[theme];
  const StatusIcon = statusConfig[request.status].icon;

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [0, 1]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -100) {
      onDelete(request.id);
    } else {
      x.set(0);
    }
  };

  return (
    <motion.div
      style={{ x, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="relative mb-3 touch-pan-y"
    >
      {/* Delete Background */}
      <div className="absolute inset-y-0 right-0 w-full bg-red-500 rounded-2xl flex items-center justify-end px-6 -z-10">
        <Trash2 className="text-white" />
      </div>

      <div className={cn("p-4 flex gap-4 relative z-0 bg-white", styles.card)}>
        {/* Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
          {request.image ? (
            <Image
              src={request.image}
              alt={request.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              😋
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className={cn("font-bold text-base", styles.title)}>
                {request.name}
              </h3>
              <div className="flex gap-2">
                <button 
                    onClick={() => onEdit(request)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                >
                    <Edit2 size={16} />
                </button>
              </div>
            </div>
            <p className={cn("text-sm mt-1 line-clamp-2", styles.desc)}>
              {request.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className={cn(
              "text-xs px-2 py-1 rounded-full flex items-center gap-1 border",
              styles.statusBadge[request.status]
            )}>
              <StatusIcon size={12} />
              <span>{statusConfig[request.status].label}</span>
            </div>
            <span className={cn("text-xs opacity-60", styles.desc)}>
              {request.createdAt}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
