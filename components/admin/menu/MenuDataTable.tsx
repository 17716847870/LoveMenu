import { Dish, DishCategory } from '@/types';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { formatDateTime } from '@/utils/format';

interface MenuDataTableProps {
  data: Dish[];
  categories?: DishCategory[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (dish: Dish) => void;
  onPreviewImage?: (src: string) => void;
}

function SkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-36"></div>
      </TableCell>
      <TableCell>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-12 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function MenuDataTable({ 
  data, 
  categories = [],
  isLoading = false, 
  onDelete,
  onEdit,
  onPreviewImage
}: MenuDataTableProps) {

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '未分类';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-50 h-fit mb-6 relative w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-pink-50/50 hover:bg-pink-50/50 border-b border-pink-100">
            <TableHead className="text-gray-600 font-medium">图片</TableHead>
            <TableHead className="text-gray-600 font-medium w-32">名称</TableHead>
            <TableHead className="text-gray-600 font-medium w-48">描述</TableHead>
            <TableHead className="text-gray-600 font-medium w-28">分类</TableHead>
            <TableHead className="text-gray-600 font-medium w-28">
              价格
            </TableHead>
            <TableHead className="text-gray-600 font-medium w-28">
              热度
            </TableHead>
            <TableHead className="text-gray-600 font-medium w-40">
              创建时间
            </TableHead>
            <TableHead className="text-gray-600 font-medium w-52">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-pink-50/50">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonRow key={i} />
              ))}
            </>
          ) : (
            data.map((item) => (
              <TableRow key={item.id} className="hover:bg-pink-50/30 transition-colors group">
                <TableCell>
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center text-2xl group">
                    {item.image ? (
                      <>
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                        <div 
                          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center cursor-pointer"
                          onClick={() => onPreviewImage?.(item.image!)}
                        >
                          <Search 
                            size={20} 
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                          />
                        </div>
                      </>
                    ) : (
                      <span>🥘</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-gray-800 text-base truncate block w-32">{item.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-400 text-sm truncate block w-48">{item.description || '-'}</span>
                </TableCell>
                <TableCell>
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                    {getCategoryName(item.categoryId)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                     <span className="text-pink-600 font-semibold">💋 {item.kissPrice}</span>
                     <span className="text-blue-500 font-semibold">🤗 {item.hugPrice}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <span className="text-orange-500">🔥</span>
                    <span className="font-medium">{item.popularity}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-500 text-sm whitespace-nowrap">{formatDateTime(item.createdAt)}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit?.(item)}
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <span>✏️</span> 编辑
                    </button>
                    <button 
                      onClick={() => onDelete?.(item.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-md transition-colors text-sm font-medium flex items-center gap-1"
                    >
                      <span>🗑️</span> 删除
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {!isLoading && data.length === 0 && (
        <div className="p-8 text-center text-gray-500 flex items-center justify-center h-40 w-full">
          暂无数据
        </div>
      )}
    </div>
  );
}
