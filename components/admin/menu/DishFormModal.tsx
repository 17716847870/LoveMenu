import React, { useState, useEffect } from 'react';
import { Dish } from '@/types';
import { X } from 'lucide-react';
import LoveSelect from '@/components/admin/ui/LoveSelect/LoveSelect';
import MultiImageUploader from '@/components/common/MultiImageUploader';
import {asyncSetState} from '@/lib/utils'

interface DishFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dish: Omit<Dish, 'id' | 'createdAt'> | Dish) => void;
  editingDish: Dish | null;
  isSubmitting?: boolean;
  categories?: Array<{ label: string; value: string }>;
}

const EMPTY_FORM_DATA = {
  name: '',
  description: '',
  categoryId: '',
  kissPrice: 0,
  hugPrice: 0,
  popularity: 0,
  image: '',
};

export default function DishFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  editingDish,
  isSubmitting = false,
  categories = []
}: DishFormModalProps) {
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  useEffect(() => {
    if (isOpen) {
      if (editingDish) {
        asyncSetState(() => {
          setFormData({
            name: editingDish.name,
            description: editingDish.description || '',
            categoryId: editingDish.categoryId,
            kissPrice: editingDish.kissPrice,
            hugPrice: editingDish.hugPrice,
            popularity: editingDish.popularity || 0,
            image: editingDish.image || '',
          });
        });
      } else {
        asyncSetState(() => {
          setFormData(EMPTY_FORM_DATA);
        });
      }
    }
  }, [isOpen, editingDish]);

  useEffect(() => {
    if (!isOpen) {
      asyncSetState(() => {
        setFormData(EMPTY_FORM_DATA);
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    setFormData(EMPTY_FORM_DATA);
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDish) {
      const dataToSave = {
        ...editingDish,
        ...formData,
      };
      onSave(dataToSave);
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4"
      onMouseDown={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-pink-50 flex flex-col max-h-[90vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-pink-50/30">
          <h2 className="text-xl font-bold text-gray-800">
            {editingDish ? '编辑菜品' : '新增菜品'}
          </h2>
          <button 
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto custom-scrollbar">
          <form id="dish-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">菜品名称 *</label>
              <input 
                required
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                placeholder="例如：草莓蛋糕"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors resize-none"
                placeholder="简短描述这道菜品..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
              <LoveSelect 
                options={categories}
                value={formData.categoryId}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, categoryId: val as string }));
                }}
                placeholder="选择分类"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">💋 亲亲价格</label>
                <input 
                  type="number" 
                  min="0"
                  name="kissPrice"
                  value={formData.kissPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🤗 抱抱价格</label>
                <input 
                  type="number" 
                  min="0"
                  name="hugPrice"
                  value={formData.hugPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🔥 初始热度</label>
                <input 
                  type="number" 
                  min="0"
                  name="popularity"
                  value={formData.popularity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">菜品图片</label>
              <MultiImageUploader
                value={formData.image}
                onChange={(urls) => {
                  setFormData(prev => ({ ...prev, image: urls as string }))
                }}
                mode="single"
                path="dishes"
                maxSize={5}
                showTitle={false}
              />
            </div>
          </form>
        </div>
        
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={handleClose}
            className="px-6 py-2 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors font-medium"
          >
            取消
          </button>
          <button 
            type="submit"
            form="dish-form"
            className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow-sm transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                保存中...
              </>
            ) : (
              '保存'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
