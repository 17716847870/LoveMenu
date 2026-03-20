"use client";

import { useState } from "react";
import DishCard from "@/components/mobile/DishCard";
import CategoryTabs from "@/components/mobile/CategoryTabs";
import { Dish, ThemeName } from "@/types";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

// Mock Data
const dishes: Dish[] = [
  {
    id: "1",
    name: "草莓松饼",
    description: "微甜松软，配草莓酱",
    kissPrice: 2,
    hugPrice: 1,
    popularity: 82,
    categoryId: "甜品",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "2",
    name: "日式炸猪排",
    description: "外酥里嫩，配特制酱汁",
    kissPrice: 3,
    hugPrice: 2,
    popularity: 95,
    categoryId: "主食",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "3",
    name: "芝士热狗",
    description: "满满芝士，快乐源泉",
    kissPrice: 2,
    hugPrice: 0,
    popularity: 78,
    categoryId: "小食",
    image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "4",
    name: "焦糖布丁",
    description: "入口即化，甜蜜加倍",
    kissPrice: 1,
    hugPrice: 1,
    popularity: 88,
    categoryId: "甜品",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=60"
  }
];

const categories = ["全部", "甜品", "主食", "小食", "饮品"];

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-pink-50",
  cute: "bg-[#fffcf3]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const { addItem } = useCart();
  const { theme } = useTheme();

  const filteredDishes = activeCategory === "全部" 
    ? dishes 
    : dishes.filter(d => d.categoryId === activeCategory);

  const handleAddToCart = (dish: Dish) => {
    addItem(dish);
  };

  return (
    <div className={cn("min-h-screen pb-[90px] transition-colors duration-300", pageStyles[theme])}>
      <div className="max-w-[480px] mx-auto relative">
        {/* Header */}
        <div className="px-4 py-6">
          <h1 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
            LoveMenu
          </h1>
          <h2 className="text-2xl font-bold">
            今天想吃什么？
          </h2>
        </div>

        {/* Category Tabs */}
        <CategoryTabs 
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* Dish Grid */}
        <div className="p-4 grid grid-cols-2 gap-4">
          {filteredDishes.map((dish, index) => (
            <DishCard 
              key={dish.id} 
              dish={dish}
              onAdd={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
