"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useFoodRequests, useCreateFoodRequest, useUpdateFoodRequest, FoodRequest } from "@/apis/foodRequests";

import WishlistHeader from "@/components/mobile/wishlist/WishlistHeader";
import RequestList from "@/components/mobile/wishlist/RequestList";
import CreateFoodRequest from "@/components/mobile/wishlist/CreateFoodRequest";
import EditFoodRequest from "@/components/mobile/wishlist/EditFoodRequest";
import EmptyRequest from "@/components/mobile/wishlist/EmptyRequest";

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-linear-to-b from-pink-50 to-white",
  cute: "bg-[#fff5fb]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

export default function WishlistPage() {
  const { theme } = useTheme();
  const { data: requests = [], isLoading } = useFoodRequests();
  const createMutation = useCreateFoodRequest();
  const updateMutation = useUpdateFoodRequest();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<FoodRequest | null>(null);

  const handleCreate = (data: Omit<FoodRequest, "id" | "status" | "createdAt">) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateOpen(false);
      }
    });
  };

  const handleEdit = (data: Partial<FoodRequest> & { id: string }) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        setEditingRequest(null);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个提议吗？")) {
      updateMutation.mutate({ id, status: "deleted" });
    }
  };

  return (
    <div className={cn("min-h-screen pb-24 transition-colors duration-300", pageStyles[theme])}>
      <WishlistHeader />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full" />
        </div>
      ) : requests.length > 0 ? (
        <RequestList 
          requests={requests} 
          onEdit={setEditingRequest} 
          onDelete={handleDelete} 
        />
      ) : (
        <EmptyRequest onAdd={() => setIsCreateOpen(true)} />
      )}

      {requests.length > 0 && (
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

      <CreateFoodRequest 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handleCreate} 
      />

      <EditFoodRequest 
        isOpen={!!editingRequest} 
        onClose={() => setEditingRequest(null)} 
        request={editingRequest}
        onSubmit={handleEdit} 
      />
    </div>
  );
}
