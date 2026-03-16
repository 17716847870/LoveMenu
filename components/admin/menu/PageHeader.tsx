import React from 'react';

export default function PageHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">菜单管理</h1>
        <p className="text-sm text-gray-500 mt-1">管理所有菜单数据</p>
      </div>
      <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium flex items-center gap-2">
        <span className="text-lg leading-none">+</span> 添加新菜品
      </button>
    </div>
  );
}
