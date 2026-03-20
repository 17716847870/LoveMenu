"use client";

import React, { useState, useMemo } from 'react';
import { PageContainer } from "@/components/ui/PageContainer";
import PageHeader from "@/components/admin/shared/PageHeader";
import CategoryDataTable from "@/components/admin/categories/CategoryDataTable";
import MobileCategoryListView from "@/components/admin/categories/MobileCategoryListView";
import CategoryFormModal from "@/components/admin/categories/CategoryFormModal";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";
import { dishCategories, dishes } from "@/lib/mock-data";
import { DishCategory } from "@/types";
import { Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<DishCategory[]>(dishCategories);
  
  // 弹窗状态
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DishCategory | null>(null);
  
  // 删除确认状态
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // 计算每个分类下的菜品数量并排序
  const processedData = useMemo(() => {
    return categories.map(cat => {
      const dishCount = dishes.filter(d => d.categoryId === cat.id).length;
      return { ...cat, dishCount };
    }).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories]);

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (category: DishCategory) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    // 检查是否有菜品关联
    const dishCount = dishes.filter(d => d.categoryId === id).length;
    if (dishCount > 0) {
      alert(`该分类下还有 ${dishCount} 道菜品，请先删除或转移菜品后再删除分类！`);
      return;
    }
    
    setSelectedCategoryId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategoryId) {
      setCategories(prev => prev.filter(item => item.id !== selectedCategoryId));
    }
    setIsConfirmOpen(false);
    setSelectedCategoryId(null);
  };

  const handleSaveCategory = (categoryData: Partial<DishCategory>) => {
    if (editingCategory) {
      setCategories(prev => prev.map(item => item.id === editingCategory.id ? { ...item, ...categoryData } as DishCategory : item));
    } else {
      const newCategory: DishCategory = {
        ...(categoryData as DishCategory),
        id: `c_${Date.now()}`,
      };
      setCategories(prev => [...prev, newCategory]);
    }
    setIsFormModalOpen(false);
  };

  return (
    <PageContainer>
      <div className="mx-auto pb-20 md:pb-0">
        <PageHeader 
          title="分类管理" 
          subtitle="管理菜品和菜单分类" 
          action={
            <button 
              onClick={handleAddClick}
              className="hidden md:flex bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> 添加新分类
            </button>
          }
        />

        <CategoryDataTable 
          data={processedData}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <MobileCategoryListView 
          data={processedData}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {/* 移动端悬浮添加按钮 */}
        <button 
          onClick={handleAddClick}
          className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 transition-colors z-50"
        >
          <Plus size={24} />
        </button>
      </div>

      <CategoryFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
}
