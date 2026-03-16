"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react";
import { dishes as initialDishes } from "@/lib/mock-data";
import { Dish } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function AdminMenuPage() {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredDishes = dishes.filter(dish => 
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "all" || dish.categoryId === selectedCategory)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">菜单管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理所有菜品信息</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200">
          <Plus className="w-5 h-5" />
          <span>添加新菜品</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="搜索菜品名称..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {["all", "c1", "c2", "c3"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                selectedCategory === cat 
                  ? "bg-pink-100 text-pink-600" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              {cat === "all" ? "全部" : cat === "c1" ? "甜品" : cat === "c2" ? "主食" : "小食"}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">菜品信息</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">价格 (亲亲/抱抱)</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">分类</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">热度</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDishes.map((dish) => (
              <tr key={dish.id} className="hover:bg-pink-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden">
                      {dish.image && (
                        <Image src={dish.image} alt={dish.name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{dish.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{dish.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-pink-500 font-medium">🍬 {dish.kissPrice}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-pink-500 font-medium">🤗 {dish.hugPrice}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    {dish.categoryId === "c1" ? "甜品" : dish.categoryId === "c2" ? "主食" : "小食"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  🔥 {dish.popularity}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredDishes.map((dish) => (
          <div key={dish.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
            <div className="w-20 h-20 rounded-xl bg-gray-100 relative overflow-hidden shrink-0">
              {dish.image && (
                <Image src={dish.image} alt={dish.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800">{dish.name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {dish.categoryId === "c1" ? "甜品" : dish.categoryId === "c2" ? "主食" : "小食"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{dish.description}</p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-pink-500">
                  <span>🍬 {dish.kissPrice}</span>
                  <span>🤗 {dish.hugPrice}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-500 bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-500 bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
