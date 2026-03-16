import React, { useMemo, useState, useEffect } from 'react';
import LoveSelect from '../LoveSelect/LoveSelect';

export type LovePaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
};

export default function LovePagination({
  total,
  page,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
  className = '',
}: LovePaginationProps) {
  const [jumpPage, setJumpPage] = useState('');
  const totalPages = Math.ceil(total / pageSize);

  // 确保当前页在合法范围内
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  // 监听 page 变化，同步更新 jumpPage 输入框
  useEffect(() => {
    setJumpPage('');
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    onPageChange?.(newPage);
  };

  const handleJump = () => {
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setJumpPage(''); // 跳转成功后清空输入框
    }
  };

  const handleJumpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJump();
    }
  };

  // 生成页码数组
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // 页数少时全显示
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 始终显示第一页
      pages.push(1);

      if (currentPage > 4) {
        pages.push('...');
      }

      // 显示当前页附近的页码
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push('...');
      }

      // 始终显示最后一页
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (total === 0) return null;

  return (
    <div className={`flex flex-wrap justify-between items-center py-4 text-sm text-gray-600 bg-white px-6 rounded-xl shadow-sm border border-pink-50 gap-4 ${className}`}>
      {/* 左侧：数据统计 */}
      <div className="flex items-center gap-3">
        <span className="text-gray-500">共 {total} 条数据</span>
      </div>

      {/* 中间：分页按钮 */}
      <div className="flex items-center gap-1.5 justify-center flex-1">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium bg-white"
        >
          上一页
        </button>
        
        <div className="flex items-center gap-1 px-2">
          {pageNumbers.map((num, index) => {
            if (num === '...') {
              return <span key={`ellipsis-${index}`} className="px-1 text-gray-400">...</span>;
            }
            
            const isCurrent = num === currentPage;
            return (
              <button
                key={num}
                onClick={() => handlePageChange(num as number)}
                className={`
                  w-9 h-9 rounded-lg flex items-center justify-center font-medium transition-all
                  ${isCurrent 
                    ? 'bg-pink-500 text-white shadow-sm shadow-pink-200 border border-transparent' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600'}
                `}
              >
                {num}
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-200 hover:text-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium bg-white"
        >
          下一页
        </button>
      </div>
      
      {/* 右侧：页大小 + 跳页 */}
      <div className="flex items-center gap-4">
        <div className="w-[150px]">
          <LoveSelect
            options={pageSizeOptions.map(size => ({ 
              label: `${size} 条/页`, 
              value: String(size) 
            }))}
            value={String(pageSize)}
            onChange={(val) => onPageSizeChange?.(Number(val))}
            placeholder="每页条数"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">跳至</span>
          <div className="relative">
            <input 
              type="text" 
              value={jumpPage}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setJumpPage(val);
              }}
              onKeyDown={handleJumpKeyDown}
              className="w-12 h-[36px] border border-gray-200 rounded-lg px-1 text-center outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 hover:border-pink-200 transition-all text-gray-700"
              placeholder={String(currentPage)}
            />
          </div>
          <span className="text-gray-500">页</span>
        </div>
      </div>
    </div>
  );
}
