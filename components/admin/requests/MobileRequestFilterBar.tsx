import React, { useState } from 'react';
import { Search } from 'lucide-react';

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
];

export default function MobileRequestFilterBar({
  onSearch,
  onStatusChange,
}: {
  onSearch?: (term: string) => void;
  onStatusChange?: (value: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');

  return (
    <div className="md:hidden flex flex-col gap-3 mb-4 mt-2">
      <div className="relative w-full">
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
          placeholder="搜索食物名称或描述..." 
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm shadow-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {statusOptions.map(status => (
          <button
            key={status.value}
            onClick={() => {
              setActiveStatus(status.value);
              onStatusChange?.(status.value);
            }}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeStatus === status.value 
                ? 'bg-pink-500 text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-pink-50 hover:bg-pink-50'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
