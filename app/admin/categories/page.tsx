"use client";

import React, { useState, useMemo } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import PageHeader from "@/components/admin/shared/PageHeader";
import CategoryDataTable from "@/components/admin/categories/CategoryDataTable";
import MobileCategoryListView from "@/components/admin/categories/MobileCategoryListView";
import CategoryFormModal from "@/components/admin/categories/CategoryFormModal";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";
import { DishCategory } from "@/types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/Loading";
import { useMessage } from "@/components/ui/Message";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/apis/category";
import { useDishes } from "@/apis/dishes";

export default function AdminCategoriesPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DishCategory | null>(
    null
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const message = useMessage();

  const { data: categories = [], isLoading, error } = useCategories();
  const { data: dishes = [] } = useDishes();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const processedData = useMemo(() => {
    return categories
      .map((cat) => {
        const dishCount = dishes.filter((d) => d.categoryId === cat.id).length;
        return { ...cat, dishCount };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories, dishes]);

  const handleAddClick = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (category: DishCategory) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const dishCount = dishes.filter((d) => d.categoryId === id).length;
    if (dishCount > 0) {
      message.warning(
        `该分类下还有 ${dishCount} 道菜品，请先删除或转移菜品后再删除分类！`
      );
      return;
    }

    setSelectedCategoryId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCategoryId) {
      try {
        await deleteCategory.mutateAsync(selectedCategoryId);
        message.success("分类删除成功");
      } catch (error) {
        message.error(error instanceof Error ? error.message : "删除失败");
      }
    }
    setIsConfirmOpen(false);
    setSelectedCategoryId(null);
  };

  const handleSaveCategory = async (categoryData: Partial<DishCategory>) => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: categoryData,
        });
        message.success("分类更新成功");
      } else {
        await createCategory.mutateAsync(categoryData as any);
        message.success("分类创建成功");
      }
      setIsFormModalOpen(false);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "保存失败");
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="分类管理" subtitle="管理菜品和菜单分类" />
        <PageLoading text="加载分类列表" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader title="分类管理" subtitle="管理菜品和菜单分类" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500">加载失败: {error.message}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
              variant="outline"
            >
              刷新重试
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mx-auto pb-20 md:pb-0">
        <PageHeader
          title="分类管理"
          subtitle="管理菜品和菜单分类"
          action={
            <Button
              onClick={handleAddClick}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> 添加新分类
            </Button>
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
        isSubmitting={createCategory.isPending || updateCategory.isPending}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="确认删除"
        message={`确定要删除该分类吗？此操作不可撤销。`}
      />
    </PageContainer>
  );
}
