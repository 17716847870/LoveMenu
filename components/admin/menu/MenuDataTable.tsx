import React from 'react';
import { Dish } from '@/types';

type SortField = 'price' | 'popularity' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface MenuDataTableProps {
  data: Dish[];
  sortField: SortField | null;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onDelete?: (id: string) => void;
  onEdit?: (dish: Dish) => void;
}

export default function MenuDataTable({ 
  data, 
  sortField, 
  sortOrder, 
  onSort, 
  onDelete,
  onEdit 
}: MenuDataTableProps) {

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <span className="text-gray-300 ml-1 text-xs">↕</span>;
    }
    return <span className="text-pink-500 ml-1 text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-50 overflow-hidden mb-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-pink-50/50 text-gray-600 text-sm border-b border-pink-100">
            <th className="py-4 px-6 font-medium">菜品信息</th>
            <th className="py-4 px-6 font-medium w-28">分类</th>
            <th 
              className="py-4 px-6 font-medium w-28 cursor-pointer hover:bg-pink-100/50 transition-colors select-none"
              onClick={() => onSort('price')}
            >
              价格 {renderSortIcon('price')}
            </th>
            <th 
              className="py-4 px-6 font-medium w-28 cursor-pointer hover:bg-pink-100/50 transition-colors select-none"
              onClick={() => onSort('popularity')}
            >
              热度 {renderSortIcon('popularity')}
            </th>
            <th 
              className="py-4 px-6 font-medium w-32 cursor-pointer hover:bg-pink-100/50 transition-colors select-none"
              onClick={() => onSort('createdAt')}
            >
              创建时间 {renderSortIcon('createdAt')}
            </th>
            <th className="py-4 px-6 font-medium w-52 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pink-50/50">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-pink-50/30 transition-colors group">
              <td className="py-4 px-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center text-2xl">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span>🥘</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 text-base">{item.name}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-1 max-w-[200px]">{item.description}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium">
                  {/* 这里应该根据 categoryId 获取分类名称，暂时直接显示 ID 或者需要父组件处理数据 */}
                  {/* 为了简单，我们假设父组件已经处理了数据，或者我们在这里做一个简单的映射 */}
                  {/* 实际上 Dish 类型里只有 categoryId，展示的时候最好是名字。*/}
                  {/* 暂时显示 categoryId，后续可以在 page 层面做 join 或者 mock data 直接包含 categoryName */}
                  {item.categoryId === 'c1' ? '甜品' : item.categoryId === 'c2' ? '主食' : item.categoryId === 'c3' ? '小食' : '其他'}
                </span>
              </td>
              <td className="py-4 px-6">
                <div className="flex flex-col text-xs">
                   <span className="text-pink-600 font-semibold">💋 {item.kissPrice}</span>
                   <span className="text-blue-500 font-semibold">🤗 {item.hugPrice}</span>
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="text-orange-500">🔥</span>
                  <span className="font-medium">{item.popularity}</span>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className="text-gray-500 text-sm">{item.createdAt || '-'}</span>
              </td>
              <td className="py-4 px-6 text-right">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          暂无数据
        </div>
      )}
    </div>
  );
}
