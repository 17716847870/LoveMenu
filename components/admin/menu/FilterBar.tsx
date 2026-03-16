import React, { useState } from 'react';
import LoveSelect from '@/components/admin/ui/LoveSelect/LoveSelect';

const categoryOptions = [
  { label: '全部', value: '' },
  { label: '主食', value: 'c2' },
  { label: '甜品', value: 'c1' },
  { label: '小食', value: 'c3' },
  { label: '饮品', value: 'c4' }, // 假设有饮品
];

const statusOptions = [
  { label: '全部', value: '' },
  { label: '上架', value: 'active' },
  { label: '下架', value: 'inactive' },
];

const sortOptions = [
  { label: '最新', value: 'newest' },
  { label: '热度最高', value: 'popular' },
  { label: '价格', value: 'price' },
];

export default function FilterBar({
  onSearch,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onReset
}: {
  onSearch?: (term: string) => void;
  onCategoryChange?: (value: string | string[]) => void;
  onStatusChange?: (value: string | string[]) => void;
  onSortChange?: (value: string | string[]) => void;
  onReset?: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [sort, setSort] = useState<string>('newest');

  const handleSearch = () => {
    onSearch?.(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    setStatus('');
    setSort('newest');
    onReset?.();
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-end border border-pink-50">
      <div className="flex-1 min-w-[240px]">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">搜索菜品</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入菜品名称..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors h-[40px]"
          />
        </div>
      </div>
      
      <div className="w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">分类</label>
        <LoveSelect 
          options={categoryOptions} 
          value={category} 
          onChange={(val) => {
            setCategory(val as string);
            onCategoryChange?.(val);
          }}
          placeholder="全部"
          searchable
        />
      </div>

      <div className="w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
        <LoveSelect 
          options={statusOptions} 
          value={status} 
          onChange={(val) => {
            setStatus(val as string);
            onStatusChange?.(val);
          }}
          placeholder="全部"
        />
      </div>

      <div className="w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">排序</label>
        <LoveSelect 
          options={sortOptions} 
          value={sort} 
          onChange={(val) => {
            setSort(val as string);
            onSortChange?.(val);
          }}
          placeholder="排序方式"
        />
      </div>

      <div className="flex gap-3">
        <button 
          onClick={handleSearch}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl shadow-sm shadow-pink-200 transition-all font-medium h-[40px] flex items-center gap-2 active:scale-95"
        >
          <span>🔍</span> 查询
        </button>
        <button 
          onClick={handleReset}
          className="bg-pink-50 hover:bg-pink-100 text-pink-600 px-6 py-2 rounded-xl transition-all font-medium h-[40px] border border-transparent hover:border-pink-200 active:scale-95"
        >
          重置
        </button>
      </div>
    </div>
  );
}
