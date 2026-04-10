"use client";

import React, { useState } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Feedback, ThemeName, FeedbackType, FeedbackStatus } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, Bug, Lightbulb, Utensils, Smile } from "lucide-react";
import ImagePreview from "@/components/common/ImagePreview";

interface FeedbackItemProps {
  feedback: Feedback;
  onEdit: (feedback: Feedback) => void;
  onDelete: (id: string) => void;
}

const themeStyles: Record<
  ThemeName,
  {
    card: string;
    title: string;
    desc: string;
    time: string;
  }
> = {
  couple: {
    card: "bg-white border border-pink-100 shadow-sm rounded-2xl",
    title: "text-pink-900",
    desc: "text-pink-500",
    time: "text-pink-300",
  },
  cute: {
    card: "bg-white border-2 border-orange-100 shadow-[4px_4px_0px_0px_rgba(255,237,213,1)] rounded-2xl",
    title: "text-orange-900",
    desc: "text-orange-500",
    time: "text-orange-300",
  },
  minimal: {
    card: "bg-white border border-gray-200 rounded-lg",
    title: "text-gray-900",
    desc: "text-gray-500",
    time: "text-gray-400",
  },
  night: {
    card: "bg-slate-800 border border-slate-700 rounded-2xl shadow-lg",
    title: "text-white",
    desc: "text-slate-400",
    time: "text-slate-500",
  },
};

const typeConfig: Record<
  FeedbackType,
  { label: string; icon: React.ElementType; color: string }
> = {
  bug: {
    label: "Bug",
    icon: Bug,
    color: "text-red-500 bg-red-50 border-red-100",
  },
  feature: {
    label: "功能建议",
    icon: Lightbulb,
    color: "text-blue-500 bg-blue-50 border-blue-100",
  },
  menu: {
    label: "菜单建议",
    icon: Utensils,
    color: "text-green-500 bg-green-50 border-green-100",
  },
  experience: {
    label: "体验反馈",
    icon: Smile,
    color: "text-purple-500 bg-purple-50 border-purple-100",
  },
};

const statusConfig: Record<FeedbackStatus, { label: string; color: string }> = {
  open: { label: "未处理", color: "text-gray-500 bg-gray-100" },
  processing: { label: "处理中", color: "text-blue-500 bg-blue-100" },
  resolved: { label: "已解决", color: "text-green-500 bg-green-100" },
};

export default function FeedbackItem({
  feedback,
  onEdit,
  onDelete,
}: FeedbackItemProps) {
  const { theme } = useTheme();
  const styles = themeStyles[theme];
  const TypeIcon = typeConfig[feedback.type].icon;

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [0, 1]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -100) {
      onDelete(feedback.id);
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

      <div
        className={cn(
          "p-4 flex flex-col gap-3 relative z-0 bg-white",
          styles.card
        )}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-1.5 rounded-lg border",
                typeConfig[feedback.type].color
              )}
            >
              <TypeIcon size={14} />
            </div>
            <h3 className={cn("font-bold text-base", styles.title)}>
              {feedback.title}
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(feedback)}
              className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit2 size={16} />
            </button>
          </div>
        </div>

        <p className={cn("text-sm line-clamp-3", styles.desc)}>
          {feedback.content}
        </p>

        {(feedback.image?.length ?? 0) > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {feedback.image!.map((url, index) => (
              <button
                key={`${feedback.id}-${index}`}
                type="button"
                onClick={() => setPreviewImage(url)}
                className="relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
              >
                <img
                  src={url}
                  alt={`反馈截图 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-1 pt-3 border-t border-dashed border-gray-100">
          <div
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              statusConfig[feedback.status].color
            )}
          >
            {statusConfig[feedback.status].label}
          </div>
          <span className={cn("text-xs", styles.time)}>
            {feedback.createdAt}
          </span>
        </div>
      </div>

      <ImagePreview
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        src={previewImage || ""}
        alt="反馈截图预览"
      />
    </motion.div>
  );
}
