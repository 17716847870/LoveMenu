"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { dishes } from "@/lib/mock-data";
import { ThemeName } from "@/types";
import { useCart } from "@/hooks/useCart";
import NotFound from "./not-found";

// Import new components
import DishHeader from "@/components/mobile/dish/DishHeader";
import DishHero from "@/components/mobile/dish/DishHero";
import DishMainCard from "@/components/mobile/dish/DishMainCard";
import LoveInteraction from "@/components/mobile/dish/LoveInteraction";
import IngredientCost from "@/components/mobile/dish/IngredientCost";
import MemoryTip from "@/components/mobile/dish/MemoryTip";
import AddToMenuBar from "@/components/mobile/dish/AddToMenuBar";

// Page theme styles
const pageStyles: Record<ThemeName, string> = {
  couple: "bg-pink-50 text-pink-900",
  cute: "bg-yellow-50 text-orange-900",
  minimal: "bg-white text-gray-900",
  night: "bg-gray-900 text-white",
};

export default function DishDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const router = useRouter();
  const { theme } = useTheme();
  const { addItem } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const dish = dishes.find(d => d.id === id);

  if (!dish) {
    return <NotFound />;
  }

  const handleAddToCart = () => {
    addItem(dish);
    router.back();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={cn("min-h-screen pb-24 transition-colors duration-300", pageStyles[theme] || pageStyles.couple)}>
      <DishHeader 
        onBack={() => router.back()} 
        onFavorite={toggleFavorite} 
        isFavorite={isFavorite} 
        theme={theme} 
      />
      
      <DishHero 
        image={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"} 
        name={dish.name} 
        theme={theme} 
      />

      <div className="flex flex-col gap-6 pb-24">
        <DishMainCard 
          description={dish.description} 
          popularity={dish.popularity} 
          theme={theme} 
        />
        
        <LoveInteraction 
          popularity={dish.popularity} 
          theme={theme} 
        />
        
        <IngredientCost 
          kissPrice={dish.kissPrice} 
          hugPrice={dish.hugPrice} 
          theme={theme} 
        />
        
        <MemoryTip theme={theme} />
      </div>

      <AddToMenuBar onAdd={handleAddToCart} theme={theme} />
    </div>
  );
}
