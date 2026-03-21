import React from 'react';
import { Dish } from '@/types';
import { Edit2, Trash2, Search } from 'lucide-react';

interface MobileMenuListViewProps {
  data: Dish[];
  onDelete?: (id: string) => void;
  onEdit?: (dish: Dish) => void;
  onPreviewImage?: (src: string) => void;
}

export default function MobileMenuListView({ data, onDelete, onEdit, onPreviewImage }: MobileMenuListViewProps) {
  return (
    <div className="flex flex-col gap-3 mb-6 md:hidden">
      {data.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-pink-50/50 p-3 flex gap-3">
          <div className="w-22 h-22 rounded-xl overflow-hidden shrink-0 bg-gray-50 relative border border-gray-50 group">
            {item.image ? (
              <>
                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                <div 
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center cursor-pointer"
                  onClick={() => onPreviewImage?.(item.image!)}
                >
                  <Search 
                    size={18} 
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl bg-pink-50/30">🥘</div>
            )}
            <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium text-pink-600 shadow-sm">
              {item.categoryId === 'c1' ? '甜品' : item.categoryId === 'c2' ? '主食' : item.categoryId === 'c3' ? '小食' : '其他'}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 text-base truncate pr-2 leading-tight">{item.name}</h3>
                <div className="flex items-center gap-0.5 text-xs text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                  🔥 <span className="font-medium">{item.popularity}</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs line-clamp-1 mt-1">{item.description}</p>
            </div>
            
            <div className="flex justify-between items-end mt-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-pink-600 font-bold text-sm leading-none">💋 {item.kissPrice}</span>
                <span className="text-blue-500 font-bold text-sm leading-none">🤗 {item.hugPrice}</span>
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => onEdit?.(item)}
                  className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => onDelete?.(item.id)}
                  className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
          暂无菜品数据
        </div>
      )}
    </div>
  );
}
