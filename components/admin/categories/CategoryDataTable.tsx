import React from 'react';
import { DishCategory } from '@/types';
import { Edit2, Trash2 } from 'lucide-react';

interface CategoryWithCount extends DishCategory {
  dishCount: number;
}

interface CategoryDataTableProps {
  data: CategoryWithCount[];
  onEdit?: (category: DishCategory) => void;
  onDelete?: (id: string) => void;
}

export default function CategoryDataTable({ data, onEdit, onDelete }: CategoryDataTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-50 overflow-hidden mb-6 hidden md:block">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-pink-50/50 text-gray-600 text-sm border-b border-pink-100">
            <th className="py-4 px-6 font-medium">分类名称</th>
            <th className="py-4 px-6 font-medium">排序权重</th>
            <th className="py-4 px-6 font-medium">关联菜品数</th>
            <th className="py-4 px-6 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pink-50/50">
          {data.map((category) => (
            <tr key={category.id} className="hover:bg-pink-50/30 transition-colors group">
              <td className="py-4 px-6 font-medium text-gray-900">
                {category.name}
              </td>
              <td className="py-4 px-6 text-gray-600">
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">{category.sortOrder}</span>
              </td>
              <td className="py-4 px-6">
                <span className="text-pink-500 font-medium bg-pink-50 px-2 py-1 rounded-md">
                  {category.dishCount} 道菜
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit?.(category)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="编辑"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete?.(category.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          暂无分类数据
        </div>
      )}
    </div>
  );
}
