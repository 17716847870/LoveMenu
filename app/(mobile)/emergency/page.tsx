"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { ThemeName, Dish } from "@/types";

// Import new components
import EmergencyHeader from "@/components/mobile/emergency/EmergencyHeader";
import EmergencyTip from "@/components/mobile/emergency/EmergencyTip";
import EmergencyFoodList from "@/components/mobile/emergency/EmergencyFoodList";
import EmptyEmergency from "@/components/mobile/emergency/EmptyEmergency";

// Mock Data - should fetch top popular/quick dishes
const emergencyDishes: Dish[] = [
  {
    id: "101",
    name: "巨无霸汉堡套餐",
    desc: "双层牛肉，现炸薯条",
    kissPrice: 2,
    hugPrice: 1,
    hotScore: 99,
    categoryId: "c1",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "102",
    name: "豚骨拉面",
    desc: "浓郁骨汤，大片叉烧",
    kissPrice: 1,
    hugPrice: 1,
    hotScore: 95,
    categoryId: "c2",
    image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "103",
    name: "韩式炸鸡 (甜辣)",
    desc: "外酥里嫩，配快乐水绝佳",
    kissPrice: 3,
    hugPrice: 0,
    hotScore: 92,
    categoryId: "c3",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=60"
  }
];

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-linear-to-b from-pink-50 to-white",
  cute: "bg-[#fff5fb]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

export default function EmergencyPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { clearCart, addItem } = useCart(); // Assuming we clear cart for emergency order or just add and checkout

  const handleQuickOrder = async (dish: Dish) => {
    // 1. Add to cart (or directly create order payload)
    addItem(dish);
    
    // 2. Mock: Create emergency order
    console.log("Creating Emergency Order for:", dish.name, "isEmergency: true");
    
    // 3. Navigate to success or order tracking
    router.push("/orders");
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-300", pageStyles[theme])}>
      <EmergencyHeader />
      
      <EmergencyTip />

      {emergencyDishes.length > 0 ? (
        <EmergencyFoodList 
          dishes={emergencyDishes} 
          onQuickOrder={handleQuickOrder} 
        />
      ) : (
        <EmptyEmergency />
      )}
    </div>
  );
}
