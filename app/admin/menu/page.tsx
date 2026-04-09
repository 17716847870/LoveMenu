"use client";

import React, { useState, useMemo } from "react";
import PageHeader from "@/components/admin/shared/PageHeader";
import FilterBar from "@/components/admin/menu/FilterBar";
import MobileMenuFilterBar from "@/components/admin/menu/MobileMenuFilterBar";
import MenuDataTable from "@/components/admin/menu/MenuDataTable";
import MobileMenuListView from "@/components/admin/menu/MobileMenuListView";
import LovePagination from "@/components/admin/ui/LovePagination/LovePagination";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";
import DishFormModal from "@/components/admin/menu/DishFormModal";
import { Dish } from "@/types";
import { PageContainer } from "@/components/ui/PageContainer";
import { Plus } from "lucide-react";
import { useCategories } from "@/apis/category";
import {
  useDishes,
  useCreateDish,
  useUpdateDish,
  useDeleteDish,
  DishQueryParams,
} from "@/apis/dishes";
import { useMessage } from "@/components/ui/Message";
import ImagePreview from "@/components/common/ImagePreview";

export default function AdminMenuPage() {
  const message = useMessage();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const [previewImage, setPreviewImage] = useState<{
    isOpen: boolean;
    src: string;
  }>({
    isOpen: false,
    src: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [queryParams, setQueryParams] = useState<DishQueryParams>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data: categories = [] } = useCategories();

  console.log("Menu page - queryParams:", queryParams);
  const { data: dishes = [], isLoading, error } = useDishes(queryParams);

  const createDish = useCreateDish();
  const updateDish = useUpdateDish();
  const deleteDish = useDeleteDish();

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      label: cat.name,
      value: cat.id,
    }));
  }, [categories]);

  const handleDeleteClick = (id: string) => {
    setSelectedMenuId(id);
    setIsConfirmOpen(true);
  };

  const handleAddClick = () => {
    setEditingDish(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (dish: Dish) => {
    setEditingDish(dish);
    setIsFormModalOpen(true);
  };

  const handlePreviewImage = (src: string) => {
    setPreviewImage({ isOpen: true, src });
  };

  const handleSaveDish = async (dishData: Partial<Dish>) => {
    try {
      if (editingDish) {
        await updateDish.mutateAsync({
          id: editingDish.id,
          data: dishData,
        });
        message.success("菜品更新成功");
      } else {
        await createDish.mutateAsync(dishData as any);
        message.success("菜品创建成功");
      }
      setIsFormModalOpen(false);
    } catch (error: any) {
      message.error(error?.message || "保存失败");
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedMenuId) {
      try {
        await deleteDish.mutateAsync(selectedMenuId);
        message.success("菜品删除成功");
      } catch (error: any) {
        message.error(error.message || "删除失败");
      }
    }
    setIsConfirmOpen(false);
    setSelectedMenuId(null);
  };

  const handleCloseDialog = () => {
    setIsConfirmOpen(false);
    setSelectedMenuId(null);
  };

  const handleSearch = (term: string) => {
    setQueryParams((prev) => ({ ...prev, search: term || undefined }));
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    const categoryId = val === "all" ? undefined : val;
    console.log("handleCategoryChange - val:", val, "categoryId:", categoryId);
    setQueryParams((prev) => ({ ...prev, categoryId }));
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    let sortBy: "createdAt" | "popularity" | "price" = "createdAt";
    let sortOrder: "asc" | "desc" = "desc";

    switch (val) {
      case "newest":
        sortBy = "createdAt";
        sortOrder = "desc";
        break;
      case "popular":
        sortBy = "popularity";
        sortOrder = "desc";
      case "price":
        sortBy = "price";
        sortOrder = "asc";
        break;
    }

    setQueryParams((prev) => ({ ...prev, sortBy, sortOrder }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setQueryParams({
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setCurrentPage(1);
  };

  const totalItems = dishes.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const validCurrentPage = Math.max(
    1,
    Math.min(currentPage, totalPages > 0 ? totalPages : 1)
  );

  const currentData = dishes.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize
  );

  const isOperating =
    createDish.isPending || updateDish.isPending || deleteDish.isPending;

  return (
    <PageContainer>
      <div className="mx-auto pb-20 md:pb-0">
        <PageHeader
          title="菜单管理"
          subtitle="管理所有菜单数据"
          action={
            <button
              onClick={handleAddClick}
              disabled={isOperating}
              className="hidden md:flex bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> 添加新菜品
            </button>
          }
        />

        {error && !isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-500">加载数据失败</div>
          </div>
        )}

        {!error && (
          <>
            <div className="hidden md:block">
              <FilterBar
                activeCategory={queryParams.categoryId || "all"}
                activeSort={
                  queryParams.sortBy === "createdAt"
                    ? "newest"
                    : queryParams.sortBy === "popularity"
                      ? "popular"
                      : "price"
                }
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                onStatusChange={() => {}}
                onSortChange={handleSortChange}
                onReset={handleReset}
              />
            </div>

            <MobileMenuFilterBar
              activeCategory={queryParams.categoryId || "all"}
              onSearch={handleSearch}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
            />

            <div className="hidden md:block">
              <MenuDataTable
                data={currentData}
                categories={categories}
                isLoading={isLoading}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                onPreviewImage={handlePreviewImage}
              />
            </div>

            <MobileMenuListView
              data={currentData}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
              onPreviewImage={handlePreviewImage}
            />

            <LovePagination
              total={totalItems}
              page={currentPage}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 20, 50]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />

            <button
              onClick={handleAddClick}
              disabled={isOperating}
              className="md:hidden disabled:bg-pink-300 fixed bottom-20 right-4 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 transition-colors z-50"
            >
              <Plus size={24} />
            </button>
          </>
        )}
      </div>

      <DishFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveDish}
        editingDish={editingDish}
        categories={categoryOptions}
        isSubmitting={updateDish.isPending || createDish.isPending}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        isLoading={deleteDish.isPending}
      />

      <ImagePreview
        isOpen={previewImage.isOpen}
        src={previewImage.src}
        onClose={() => setPreviewImage({ isOpen: false, src: "" })}
      />
    </PageContainer>
  );
}
