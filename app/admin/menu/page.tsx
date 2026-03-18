'use client';

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/admin/shared/PageHeader';
import FilterBar from '@/components/admin/menu/FilterBar';
import MenuDataTable from '@/components/admin/menu/MenuDataTable';
import LovePagination from '@/components/admin/ui/LovePagination/LovePagination';
import ConfirmDialog from '@/components/admin/common/ConfirmDialog';
import { dishes } from '@/lib/mock-data'; // 使用 mock 数据作为初始数据
import { Dish } from '@/types';
import { PageContainer } from "@/components/ui/PageContainer";



type SortField = 'price' | 'popularity' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function AdminMenuPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  
  // 状态管理
  const [allDishes, setAllDishes] = useState<Dish[]>(dishes);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 默认每页10条

  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleDeleteClick = (id: string) => {
    setSelectedMenuId(id);
    setIsConfirmOpen(true);
  };

  const handleEditClick = (dish: Dish) => {
    console.log('Edit dish:', dish);
    // TODO: 实现编辑弹窗逻辑
  };

  const handleConfirmDelete = () => {
    if (selectedMenuId) {
      setAllDishes(prev => prev.filter(item => item.id !== selectedMenuId));
      console.log('Deleted menu item with ID:', selectedMenuId);
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
      <div className="mx-auto">
        <PageHeader 
          title="菜单管理" 
          subtitle="管理所有菜单数据"
          action={
            <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium flex items-center gap-2">
              <span className="text-lg leading-none">+</span> 添加新菜品
            </button>
          }
        />
        
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
        
        <MenuDataTable 
          data={currentData}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
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

      </div>

      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
}
