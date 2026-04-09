import React from "react";
import { DishCategory } from "@/types";
import { Edit2, Trash2, Tag } from "lucide-react";

interface CategoryWithCount extends DishCategory {
  dishCount: number;
}

interface MobileCategoryListViewProps {
  data: CategoryWithCount[];
  onEdit?: (category: DishCategory) => void;
  onDelete?: (id: string) => void;
}

export default function MobileCategoryListView({
  data,
  onEdit,
  onDelete,
}: MobileCategoryListViewProps) {
  return (
    <div className="flex flex-col gap-3 mb-6 md:hidden">
      {data.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-2xl shadow-sm border border-pink-50/50 p-4 flex flex-col gap-3"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                <Tag size={16} />
              </div>
              <h3 className="font-bold text-gray-800">{category.name}</h3>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
              排序: {category.sortOrder}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
            <div className="text-sm font-medium text-pink-500">
              关联了 {category.dishCount} 道菜
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(category)}
                className="w-8 h-8 flex items-center justify-center text-blue-500 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete?.(category.id)}
                className="w-8 h-8 flex items-center justify-center text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
          暂无分类数据
        </div>
      )}
    </div>
  );
}
