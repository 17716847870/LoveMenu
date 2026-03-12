"use client";

import { useState } from "react";
import DishCard, { Dish } from "@/components/mobile/DishCard";
import CategoryTabs from "@/components/mobile/CategoryTabs";
import FloatingCartButton from "@/components/mobile/FloatingCartButton";

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

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [cartCount, setCartCount] = useState(0);

  const filteredDishes = activeCategory === "全部" 
    ? dishes 
    : dishes.filter(d => d.category === activeCategory);

  const handleAddToCart = (dish: Dish) => {
    setCartCount(prev => prev + 1);
    // Here you would typically add to actual cart state/context
  };

  return (
    <div className="min-h-screen bg-background pb-[90px]">
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

        {/* Floating Cart Button */}
        <FloatingCartButton count={cartCount} />
      </div>
    </div>
  );
}
