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
    desc: "微甜松软，配草莓酱",
    kissPrice: 2,
    hugPrice: 1,
    hotScore: 82,
    image: "/dish1.jpg",
    category: "甜品"
  },
  {
    id: "2",
    name: "日式炸猪排",
    desc: "外酥里嫩，配特制酱汁",
    kissPrice: 3,
    hugPrice: 0,
    hotScore: 90,
    category: "主食"
  },
  {
    id: "3",
    name: "珍珠奶茶",
    desc: "Q弹珍珠，香浓奶茶",
    kissPrice: 1,
    hugPrice: 1,
    hotScore: 65,
    category: "饮品"
  },
  {
    id: "4",
    name: "章鱼小丸子",
    desc: "满满木鱼花",
    kissPrice: 2,
    hugPrice: 0,
    hotScore: 45,
    category: "小食"
  },
  {
    id: "5",
    name: "提拉米苏",
    desc: "带我走~",
    kissPrice: 2,
    hugPrice: 2,
    hotScore: 78,
    category: "甜品"
  }
];

const categories = ["全部", "甜品", "主食", "小食", "饮品"];

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-pink-50",
  cute: "bg-[#fff5fb]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const { addItem } = useCart();
  const { theme } = useTheme();

  const filteredDishes = activeCategory === "全部" 
    ? dishes 
    : dishes.filter(d => d.category === activeCategory);

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
