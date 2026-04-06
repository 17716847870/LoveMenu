"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName, Feedback } from "@/types";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useCreateFeedback, useDeleteFeedback, useFeedbacks, useUpdateFeedback } from "@/apis/feedback";

import FeedbackHeader from "@/components/mobile/feedback/FeedbackHeader";
import FeedbackList from "@/components/mobile/feedback/FeedbackList";
import CreateFeedback from "@/components/mobile/feedback/CreateFeedback";
import EditFeedback from "@/components/mobile/feedback/EditFeedback";
import EmptyFeedback from "@/components/mobile/feedback/EmptyFeedback";

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-linear-to-b from-pink-50 to-white",
  cute: "bg-[#fff5fb]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

export default function FeedbackPage() {
  const { theme } = useTheme();
  const { data: feedbacks = [], isLoading } = useFeedbacks();
  const createMutation = useCreateFeedback();
  const updateMutation = useUpdateFeedback();
  const deleteMutation = useDeleteFeedback();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  const handleCreate = (data: Omit<Feedback, "id" | "status" | "createdAt">) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
      },
    });
  };

  const handleEdit = (data: Partial<Feedback>) => {
    if (!data.id) return;

    updateMutation.mutate(data as { id: string } & Partial<Feedback>, {
      onSuccess: () => {
        setEditingFeedback(null);
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条反馈吗？")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className={cn("min-h-screen pb-24 transition-colors duration-300", pageStyles[theme])}>
      <FeedbackHeader />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
        </div>
      ) : feedbacks.length > 0 ? (
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
