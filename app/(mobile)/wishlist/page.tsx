"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName, FoodRequest } from "@/types";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import WishlistHeader from "@/components/mobile/wishlist/WishlistHeader";
import RequestList from "@/components/mobile/wishlist/RequestList";
import CreateFoodRequest from "@/components/mobile/wishlist/CreateFoodRequest";
import EditFoodRequest from "@/components/mobile/wishlist/EditFoodRequest";
import EmptyRequest from "@/components/mobile/wishlist/EmptyRequest";

// Mock Data
const initialRequests: FoodRequest[] = [
  {
    id: "1",
    name: "韩式炸鸡",
    description: "很想吃甜辣口味的韩式炸鸡，配上腌萝卜",
    status: "pending",
    createdAt: "2024-03-14",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    name: "抹茶千层",
    description: "下午茶想吃这个，稍微苦一点的那种",
    status: "approved",
    createdAt: "2024-03-10",
    image: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "3",
    name: "螺蛳粉",
    description: "偶尔也想吃点重口味的嘛",
    status: "rejected",
    createdAt: "2024-03-01",
  }
];

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-linear-to-b from-pink-50 to-white",
  cute: "bg-[#fff5fb]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

export default function WishlistPage() {
  const { theme } = useTheme();
  const [requests, setRequests] = useState<FoodRequest[]>(initialRequests);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<FoodRequest | null>(null);

  const handleCreate = (data: Omit<FoodRequest, "id" | "status" | "createdAt">) => {
    const newRequest: FoodRequest = {
      ...data,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRequests([newRequest, ...requests]);
  };

  const handleEdit = (data: Partial<FoodRequest>) => {
    setRequests(requests.map(r => r.id === data.id ? { ...r, ...data } as FoodRequest : r));
    setEditingRequest(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个提议吗？")) {
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  return (
    <div className={cn("min-h-screen pb-24 transition-colors duration-300", pageStyles[theme])}>
      <WishlistHeader />

      {requests.length > 0 ? (
        <RequestList 
          requests={requests} 
          onEdit={setEditingRequest} 
          onDelete={handleDelete} 
        />
      ) : (
        <EmptyRequest onAdd={() => setIsCreateOpen(true)} />
      )}

      {/* Floating Add Button (only visible when list is not empty) */}
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
