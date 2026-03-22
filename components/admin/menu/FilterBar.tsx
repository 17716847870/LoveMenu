import React from 'react';
import LoveSelect from '@/components/admin/ui/LoveSelect/LoveSelect';
import { useCategories } from '@/apis/category';

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '上架', value: 'active' },
  { label: '下架', value: 'inactive' },
];

const sortOptions = [
  { label: '最新', value: 'newest' },
  { label: '热度最高', value: 'popular' },
  { label: '价格', value: 'price' },
];

interface FilterBarProps {
  activeCategory?: string;
  activeSort?: string;
  onSearch?: (term: string) => void;
  onCategoryChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onReset?: () => void;
}

export default function FilterBar({
  activeCategory = 'all',
  activeSort = 'newest',
  onSearch,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onReset
}: FilterBarProps) {
  const { data: categories = [] } = useCategories();

  const categoryOptions = [
    { label: '全部', value: 'all' },
    ...categories.map(cat => ({ label: cat.name, value: cat.id })),
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-end border border-pink-50">
      <div className="flex-1 min-w-[240px]">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">搜索菜品</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder="输入菜品名称..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors h-[40px]"
          />
        </div>
      </div>
      
      <div className="w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">分类</label>
        <LoveSelect 
          options={categoryOptions} 
          value={activeCategory}
          onChange={(val) => {
            const stringVal = typeof val === 'string' ? val : val[0];
            onCategoryChange?.(stringVal);
          }}
          placeholder="全部"
          searchable
        />
      </div>

      <div className="w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
        <LoveSelect 
          options={statusOptions} 
          value="all" 
          onChange={(val) => {
            const stringVal = typeof val === 'string' ? val : val[0];
            onStatusChange?.(stringVal);
          }}
          placeholder="全部"
        />
      </div>

      <div className="w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">排序</label>
        <LoveSelect 
          options={sortOptions} 
          value={activeSort}
          onChange={(val) => {
            const stringVal = typeof val === 'string' ? val : val[0];
            onSortChange?.(stringVal);
          }}
          placeholder="排序方式"
        />
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onReset}
          className="bg-pink-50 hover:bg-pink-100 text-pink-600 px-6 py-2 rounded-xl transition-all font-medium h-[40px] border border-transparent hover:border-pink-200 active:scale-95"
        >
          重置
        </button>
      </div>
    </div>
  );
}
