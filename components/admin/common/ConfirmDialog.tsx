import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = '确认删除',
  message = '确认删除这个菜品吗？',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-pink-50 transform transition-all scale-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl flex-shrink-0">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>
          <p className="text-gray-600 ml-13">{message}</p>
        </div>
        
        <div className="bg-pink-50/30 px-6 py-4 flex justify-end gap-3 border-t border-pink-50">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
          >
            取消
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm transition-colors font-medium"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
}
