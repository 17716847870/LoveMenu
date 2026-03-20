import React, { useState } from 'react';
import LoveSelect from '@/components/admin/ui/LoveSelect/LoveSelect';
import { Search } from 'lucide-react';

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '待处理', value: 'pending' },
  { label: '制作中', value: 'preparing' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
];

export default function OrderFilterBar({
  onSearch,
  onStatusChange,
  onReset
}: {
  onSearch?: (term: string) => void;
  onStatusChange?: (value: string) => void;
  onReset?: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<string>('all');

  const handleReset = () => {
    setSearchTerm('');
    setStatus('all');
    onReset?.();
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-end border border-pink-50">
      <div className="flex-1 min-w-[240px]">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">搜索订单</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="搜索订单号或备注..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors h-[40px]"
          />
        </div>
      </div>

      <div className="w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">订单状态</label>
        <LoveSelect 
          options={statusOptions} 
          value={status} 
          onChange={(val) => {
            setStatus(val as string);
            onStatusChange?.(val as string);
          }}
          placeholder="全部"
        />
      </div>

      <div className="flex gap-2 h-[40px]">
        <button 
          onClick={handleReset}
          className="px-6 h-full border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          重置
        </button>
      </div>
    </div>
  );
}
