'use client';

import React, { useState, useMemo, useEffect } from 'react';
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

type SortField = 'price' | 'popularity' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function AdminMenuPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  
  // 状态管理
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 默认每页10条

  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchDishes = async () => {
    try {
      const res = await fetch('/api/dishes');
      const data = await res.json();
      if (data.data) setAllDishes(data.data);
    } catch (error) {
      console.error('Failed to fetch dishes');
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

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

  const handleSaveDish = async (dishData: Partial<Dish>) => {
    try {
      if (editingDish) {
        await fetch(`/api/dishes/${editingDish.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dishData),
        });
      } else {
        await fetch('/api/dishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dishData),
        });
      }
      fetchDishes();
      setIsFormModalOpen(false);
    } catch (error) {
      alert('保存失败');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedMenuId) {
      try {
        const res = await fetch(`/api/dishes/${selectedMenuId}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '删除失败');
        fetchDishes();
      } catch (error: any) {
        alert(error.message);
      }
    }
    setIsConfirmOpen(false);
    setSelectedMenuId(null);
  };

  const handleCloseDialog = () => {
    setIsConfirmOpen(false);
    setSelectedMenuId(null);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // 数据处理逻辑：筛选 -> 排序 -> 分页
  const processedData = useMemo(() => {
    let result = [...allDishes];

    // 1. 筛选
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      result = result.filter(item => item.categoryId === categoryFilter);
    }
    // 注意：mock 数据目前没有 status 字段，如果添加了字段这里需要开启
    // if (statusFilter) {
    //   result = result.filter(item => item.status === statusFilter);
    // }

    // 2. 排序
    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;
        if (sortField === 'price') {
            // 价格排序逻辑：优先按 kissPrice，如果相等按 hugPrice
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

  // 2. 分页
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // 确保当前页码有效
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages > 0 ? totalPages : 1));
  
  const currentData = processedData.slice(
    (validCurrentPage - 1) * pageSize, 
    validCurrentPage * pageSize
  );

  return (
    <PageContainer>
      <div className="mx-auto pb-20 md:pb-0">
        <PageHeader 
          title="菜单管理" 
          subtitle="管理所有菜单数据"
          action={
            <button 
              onClick={handleAddClick}
              className="hidden md:flex bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> 添加新菜品
            </button>
          }
        />
        
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
              // 这里 FilterBar 的排序主要是业务排序（如最新、热度），
              // 如果和表格表头排序有冲突，需要协调。
              // 暂时简单映射：
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
          />
        </div>

        <MobileMenuListView 
          data={currentData}
          onDelete={handleDeleteClick}
          onEdit={handleEditClick}
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
          className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-pink-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-600 transition-colors z-50"
        >
          <Plus size={24} />
        </button>

      </div>

      <DishFormModal 
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveDish}
        editingDish={editingDish}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
}
