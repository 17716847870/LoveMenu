import React, { useMemo, useState, useEffect } from "react";
import LoveSelect from "../LoveSelect/LoveSelect";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  className = "",
}: LovePaginationProps) {
  const [jumpPage, setJumpPage] = useState("");
  const totalPages = Math.ceil(total / pageSize);

  // 确保当前页在合法范围内
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  // 监听 page 变化，同步更新 jumpPage 输入框
  useEffect(() => {
    setJumpPage("");
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    onPageChange?.(newPage);
  };

  const handleJump = () => {
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setJumpPage(""); // 跳转成功后清空输入框
    }
  };

  const handleJumpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
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
        pages.push("...");
      }

      // 显示当前页附近的页码
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      // 始终显示最后一页
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (total === 0) return null;

  return (
    <div
      className={`flex flex-wrap justify-between items-center py-4 text-sm text-gray-600 bg-white px-6 rounded-xl shadow-sm border border-pink-50 gap-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-500">共 {total} 条数据</span>
      </div>

      <Pagination className="flex-1 justify-center">
        <PaginationContent className="flex gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={
                currentPage <= 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-pink-50 hover:text-pink-600"
              }
            />
          </PaginationItem>

          {pageNumbers.map((num, index) => {
            if (num === "...") {
              return <PaginationEllipsis key={`ellipsis-${index}`} />;
            }

            const isCurrent = num === currentPage;
            return (
              <PaginationItem key={num}>
                <PaginationLink
                  onClick={() => handlePageChange(num as number)}
                  isActive={isCurrent}
                  className={
                    isCurrent
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      : "hover:bg-pink-50 hover:text-pink-600 cursor-pointer"
                  }
                >
                  {num}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-pink-50 hover:text-pink-600"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-4">
        <div className="w-[150px]">
          <LoveSelect
            options={pageSizeOptions.map((size) => ({
              label: `${size} 条/页`,
              value: String(size),
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
                const val = e.target.value.replace(/\D/g, "");
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
