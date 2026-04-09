import React, { useState, useEffect } from "react";
import { DishCategory } from "@/types";
import { X } from "lucide-react";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<DishCategory, "id"> | DishCategory) => void;
  editingCategory: DishCategory | null;
  isSubmitting?: boolean;
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  isSubmitting = false,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sortOrder: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name,
          sortOrder: editingCategory.sortOrder,
        });
      } else {
        setFormData({
          name: "",
          sortOrder: 0,
        });
      }
    }
  }, [isOpen, editingCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      onSave({
        ...editingCategory,
        ...formData,
      });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-pink-50 flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-pink-50/30">
          <h2 className="text-xl font-bold text-gray-800">
            {editingCategory ? "编辑分类" : "新增分类"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <form
            id="category-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类名称 *
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
                placeholder="例如：主食、甜点..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                排序权重 (越小越靠前)
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors"
              />
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            取消
          </button>
          <button
            type="submit"
            form="category-form"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow-sm transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                保存中...
              </>
            ) : (
              "保存"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
