"use client";

import { useState } from "react";
import { dishCategories, dishes } from "@/lib/mock-data";
import DishCard from "@/components/dish/DishCard";
import { Dish } from "@/types";
import { Button } from "@/components/ui/Button";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredDishes = activeCategory === "all"
    ? dishes
    : dishes.filter((d) => d.categoryId === activeCategory);

  const handleAddToCart = (dish: Dish) => {
    // TODO: Implement cart logic
    console.log("Added to cart:", dish.name);
  };

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center h-14 px-4 font-semibold text-lg">
          菜单
        </div>
        {/* Categories */}
        <div className="flex overflow-x-auto px-4 pb-2 gap-2 scrollbar-hide">
          <Button
            variant={activeCategory === "all" ? "default" : "secondary"}
            size="sm"
            className="rounded-full px-4"
            onClick={() => setActiveCategory("all")}
          >
            全部
          </Button>
          {dishCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "secondary"}
              size="sm"
              className="rounded-full px-4 whitespace-nowrap"
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Dish List */}
      <div className="p-4 grid grid-cols-2 gap-4 pb-20">
        {filteredDishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}
