"use client";

import { useMemo, useState } from "react";
import { PageContainer } from "../../components/ui/PageContainer";
import { Grid } from "../../components/ui/Grid";
import { DishCard } from "../../components/dish/DishCard";
import { DishCategoryTag } from "../../components/dish/DishCategory";
import { useCart } from "../../hooks/useCart";
import { dishCategories, dishes } from "../../lib/mock-data";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { addItem } = useCart();
  const filtered = useMemo(() => {
    if (activeCategory === "all") return dishes;
    return dishes.filter((dish) => dish.categoryId === activeCategory);
  }, [activeCategory]);

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">菜单</h1>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <DishCategoryTag
          category={{ id: "all", name: "全部", sortOrder: 0 }}
          active={activeCategory === "all"}
          onSelect={setActiveCategory}
        />
        {dishCategories.map((category) => (
          <DishCategoryTag
            key={category.id}
            category={category}
            active={activeCategory === category.id}
            onSelect={setActiveCategory}
          />
        ))}
      </div>
      <div className="mt-6">
        <Grid columns="3">
          {filtered.map((dish) => (
            <DishCard key={dish.id} dish={dish} onAdd={addItem} />
          ))}
        </Grid>
      </div>
    </PageContainer>
  );
}
