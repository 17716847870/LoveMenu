"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName, Dish } from "@/types";
import { useCart } from "@/hooks/useCart";
import { useFlyToCart } from "@/context/FlyToCartContext";
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
  const { addToCartWithAnimation } = useFlyToCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const res = await fetch("/api/dishes");
        const data = await res.json();
        const foundDish = data.data?.find((d: Dish) => d.id === id);
        setDish(foundDish || null);
      } catch (error) {
        console.error("Failed to fetch dish");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDish();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        加载中...
      </div>
    );
  }

  if (!dish) {
    return <NotFound />;
  }

  const handleAddToCart = () => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      addToCartWithAnimation(rect, dish.image || "", () => {
        addItem(dish);
        router.back();
      });
    } else {
      addItem(dish);
      router.back();
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className={cn(
        "min-h-screen pb-24 transition-colors duration-300",
        pageStyles[theme] || pageStyles.couple
      )}
    >
      <DishHeader
        onBack={() => router.back()}
        onFavorite={toggleFavorite}
        isFavorite={isFavorite}
        theme={theme}
      />

      <DishHero
        image={
          dish.image ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        }
        name={dish.name}
        theme={theme}
        imageRef={imageRef}
      />

      <div className="flex flex-col gap-6 pb-24">
        <DishMainCard
          description={dish.description}
          popularity={dish.popularity}
          theme={theme}
        />

        <LoveInteraction popularity={dish.popularity} theme={theme} />

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
