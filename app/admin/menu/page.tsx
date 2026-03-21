'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/admin/shared/PageHeader';
import FilterBar from '@/components/admin/menu/FilterBar';
import MobileMenuFilterBar from '@/components/admin/menu/MobileMenuFilterBar';
import MenuDataTable from '@/components/admin/menu/MenuDataTable';
import MobileMenuListView from '@/components/admin/menu/MobileMenuListView';
import LovePagination from '@/components/admin/ui/LovePagination/LovePagination';
import ConfirmDialog from '@/components/admin/common/ConfirmDialog';
import DishFormModal from '@/components/admin/menu/DishFormModal';
import { Dish } from '@/types';
import { PageContainer } from "@/components/ui/PageContainer";
import { Plus } from 'lucide-react';
import { useCategories } from '@/apis/category';
import { useDishes, useCreateDish, useUpdateDish, useDeleteDish } from '@/apis/dishes';
import { useMessage } from '@/components/ui/Message';
import ImagePreview from '@/components/common/ImagePreview';

type SortField = 'price' | 'popularity' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function AdminMenuPage() {
  const message = useMessage();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const [previewImage, setPreviewImage] = useState<{ isOpen: boolean; src: string }>({ 
    isOpen: false, 
    src: '' 
  });
  
  // 排序和筛选状态
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 使用 TanStack Query 获取数据
  const { data: allDishes = [], isLoading, error } = useDishes();
  const { data: categories = [] } = useCategories();

  // 使用 mutations
  const createDish = useCreateDish();
  const updateDish = useUpdateDish();
  const deleteDish = useDeleteDish();

  // 转换分类数据为选项
  const categoryOptions = useMemo(() => {
    return categories.map(cat => ({
      label: cat.name,
      value: cat.id,
    }));
  }, [categories]);

  // 处理删除点击
  const handleDeleteClick = (id: string) => {
    setSelectedMenuId(id);
    setIsConfirmOpen(true);
  };

  // 处理新增点击
  const handleAddClick = () => {
    setEditingDish(null);
    setIsFormModalOpen(true);
  };

  // 处理编辑点击
  const handleEditClick = (dish: Dish) => {
    setEditingDish(dish);
    setIsFormModalOpen(true);
  };

  // 处理图片预览
  const handlePreviewImage = (src: string) => {
    setPreviewImage({ isOpen: true, src });
  };

  // 保存菜品（创建或更新）
  const handleSaveDish = async (dishData: Partial<Dish>) => {
    try {
      if (editingDish) {
        await updateDish.mutateAsync({ 
          id: editingDish.id, 
          data: dishData 
        });
        message.success('菜品更新成功');
      } else {
        await createDish.mutateAsync(dishData as any);
        message.success('菜品创建成功');
      }
      setIsFormModalOpen(false);
    } catch (error) {
      message.error('保存失败');
      throw error;
    }
  };

  // 确认删除
  const handleConfirmDelete = async () => {
    if (selectedMenuId) {
      try {
        await deleteDish.mutateAsync(selectedMenuId);
        message.success('菜品删除成功');
      } catch (error: any) {
        message.error(error.message || '删除失败');
      }
    }
    setIsConfirmOpen(false);
    setSelectedMenuId(null);
  };

  // 关闭确认对话框
  const handleCloseDialog = () => {
    setIsConfirmOpen(false);
    setSelectedMenuId(null);
  };

  // 处理排序
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // 数据处理：筛选 -> 排序 -> 分页
  const processedData = useMemo(() => {
    let result = [...allDishes];

    // 筛选
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      result = result.filter(item => item.categoryId === categoryFilter);
    }

    // 排序
    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;
        if (sortField === 'price') {
          if (a.kissPrice !== b.kissPrice) {
            comparison = a.kissPrice - b.kissPrice;
          } else {
            comparison = a.hugPrice - b.hugPrice;
          }
        } else if (sortField === 'popularity') {
          comparison = (a.popularity || 0) - (b.popularity || 0);
        } else if (sortField === 'createdAt') {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          comparison = dateA - dateB;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [allDishes, sortField, sortOrder, searchTerm, categoryFilter, statusFilter]);

  // 分页
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages > 0 ? totalPages : 1));
  
  const currentData = processedData.slice(
    (validCurrentPage - 1) * pageSize, 
    validCurrentPage * pageSize
  );

  // 判断是否有操作正在进行
  const isOperating = createDish.isPending || updateDish.isPending || deleteDish.isPending;

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

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-500">加载中...</div>
          </div>
        )}

        {/* 错误状态 */}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-500">加载数据失败</div>
          </div>
        )}

        {/* 数据展示 */}
        {!isLoading && !error && (
          <>
            <div className="hidden md:block">
              <FilterBar 
                onSearch={(term) => {
                  setSearchTerm(term);
                  setCurrentPage(1);
                }}
                onCategoryChange={(val) => {
                  setCategoryFilter(val as string);
                  setCurrentPage(1);
                }}
                onStatusChange={(val) => {
                  setStatusFilter(val as string);
                  setCurrentPage(1);
                }}
                onSortChange={(val) => {
                  if (val === 'newest') {
                    setSortField('createdAt');
                    setSortOrder('desc');
                  } else if (val === 'popular') {
                    setSortField('popularity');
                    setSortOrder('desc');
                  } else if (val === 'price') {
                    setSortField('price');
                    setSortOrder('asc');
                  }
                  setCurrentPage(1);
                }}
                onReset={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setStatusFilter('');
                  setSortField(null);
                  setSortOrder('desc');
                  setCurrentPage(1);
                }}
              />
            </div>

            <MobileMenuFilterBar 
              onSearch={(term) => {
                setSearchTerm(term);
                setCurrentPage(1);
              }}
              onCategoryChange={(val) => {
                setCategoryFilter(val as string);
                setCurrentPage(1);
              }}
              onSortChange={(val) => {
                if (val === 'newest') {
                  setSortField('createdAt');
                  setSortOrder('desc');
                } else if (val === 'popular') {
                  setSortField('popularity');
                  setSortOrder('desc');
                } else if (val === 'price') {
                  setSortField('price');
                  setSortOrder('asc');
                }
                setCurrentPage(1);
              }}
            />
            
            <div className="hidden md:block">
              <MenuDataTable 
                data={currentData}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
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

            {/* 移动端悬浮添加按钮 */}
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
        onClose={() => setPreviewImage({ isOpen: false, src: '' })}
      />
    </PageContainer>
  );
}
