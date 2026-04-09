"use client";

import { useState, useMemo } from "react";
import DishCard from "@/components/mobile/DishCard";
import CategoryTabs from "@/components/mobile/CategoryTabs";
import { Dish, ThemeName } from "@/types";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useDishes } from "@/apis/dishes";
import { useCategories } from "@/apis/category";

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

  const { data: dishes = [], isLoading: dishesLoading } = useDishes();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  const categoryNames = useMemo(() => {
    return ["全部", ...categories.map((c) => c.name)];
  }, [categories]);

  const getCategoryIdByName = (name: string): string | undefined => {
    if (name === "全部") return undefined;
    const category = categories.find((c) => c.name === name);
    return category?.id;
  };

  const getCategoryNameById = (categoryId: string): string => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "";
  };

  const filteredDishes = useMemo(() => {
    if (activeCategory === "全部") {
      return dishes;
    }
    const categoryId = getCategoryIdByName(activeCategory);
    if (!categoryId) return dishes;
    return dishes.filter((d) => d.categoryId === categoryId);
  }, [dishes, activeCategory, categories]);

  const handleAddToCart = (dish: Dish) => {
    const dishWithCategory = {
      ...dish,
      categoryName: getCategoryNameById(dish.categoryId),
    };
    addItem(dishWithCategory as any);
  };

  const isLoading = dishesLoading || categoriesLoading;

  return (
    <div
      className={cn(
        "min-h-screen pb-22.5 transition-colors duration-300",
        pageStyles[theme]
      )}
    >
      <div className="max-w-120 mx-auto relative">
        <div className="px-4 py-6">
          <h1 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
            LoveMenu
          </h1>
          <h2 className="text-2xl font-bold">今天想吃什么？</h2>
        </div>

        <CategoryTabs
          categories={categoryNames}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {isLoading ? (
          <div className="p-4 flex items-center justify-center py-20">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="p-4 flex items-center justify-center py-20">
            <div className="text-muted-foreground">暂无菜品</div>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 gap-4">
            {filteredDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} onAdd={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
