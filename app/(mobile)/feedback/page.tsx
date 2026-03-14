"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName, Feedback } from "@/types";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import FeedbackHeader from "@/components/mobile/feedback/FeedbackHeader";
import FeedbackList from "@/components/mobile/feedback/FeedbackList";
import CreateFeedback from "@/components/mobile/feedback/CreateFeedback";
import EditFeedback from "@/components/mobile/feedback/EditFeedback";
import EmptyFeedback from "@/components/mobile/feedback/EmptyFeedback";

// Mock Data
const initialFeedbacks: Feedback[] = [
  {
    id: "1",
    type: "experience",
    title: "页面加载有点慢",
    content: "有时候打开菜单需要等好几秒，希望能优化一下速度。",
    status: "processing",
    createdAt: "2024-03-14",
  },
  {
    id: "2",
    type: "menu",
    title: "希望增加日料",
    content: "最近特别想吃寿司和拉面，可以加进菜单吗？",
    status: "open",
    createdAt: "2024-03-12",
  },
  {
    id: "3",
    type: "feature",
    title: "夜间模式很好看",
    content: "特别喜欢新的夜间模式，颜色搭配很舒服！",
    status: "resolved",
    createdAt: "2024-03-10",
  }
];

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-linear-to-b from-pink-50 to-white",
  cute: "bg-[#fff5fb]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

export default function FeedbackPage() {
  const { theme } = useTheme();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  const handleCreate = (data: Omit<Feedback, "id" | "status" | "createdAt">) => {
    const newFeedback: Feedback = {
      ...data,
      id: Date.now().toString(),
      status: "open",
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFeedbacks([newFeedback, ...feedbacks]);
  };

  const handleEdit = (data: Partial<Feedback>) => {
    setFeedbacks(feedbacks.map(f => f.id === data.id ? { ...f, ...data } as Feedback : f));
    setEditingFeedback(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条反馈吗？")) {
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    }
  };

  return (
    <div className={cn("min-h-screen pb-24 transition-colors duration-300", pageStyles[theme])}>
      <FeedbackHeader />

      {feedbacks.length > 0 ? (
        <FeedbackList 
          feedbacks={feedbacks} 
          onEdit={setEditingFeedback} 
          onDelete={handleDelete} 
        />
      ) : (
        <EmptyFeedback onAdd={() => setIsCreateOpen(true)} />
      )}

      {/* Floating Add Button (only visible when list is not empty) */}
      {feedbacks.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 transition-all",
            theme === 'couple' && "bg-pink-500 text-white shadow-pink-300",
            theme === 'cute' && "bg-orange-400 text-white shadow-orange-300",
            theme === 'minimal' && "bg-black text-white shadow-gray-400",
            theme === 'night' && "bg-purple-600 text-white shadow-purple-900"
          )}
        >
          <Plus size={28} />
        </motion.button>
      )}

      <CreateFeedback 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handleCreate} 
      />

      <EditFeedback 
        isOpen={!!editingFeedback} 
        onClose={() => setEditingFeedback(null)} 
        feedback={editingFeedback}
        onSubmit={handleEdit} 
      />
    </div>
  );
}
