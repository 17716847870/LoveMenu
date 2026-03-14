"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

// Import new components
import CartHeader from "@/components/mobile/cart/CartHeader";
import CartLoveTip from "@/components/mobile/cart/CartLoveTip";
import CartList from "@/components/mobile/cart/CartList";
import CartSummary from "@/components/mobile/cart/CartSummary";
import CheckoutBar from "@/components/mobile/cart/CheckoutBar";
import EmptyCart from "@/components/mobile/cart/EmptyCart";

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-linear-to-b from-pink-50 to-white",
  cute: "bg-[#fff5fb]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

export default function CartPage() {
  const { items, totals, updateQuantity, removeItem, clearCart } = useCart();
  const { theme } = useTheme();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      // Navigate to success or orders page
      router.push("/orders"); 
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className={cn("min-h-screen", pageStyles[theme])}>
        <CartHeader />
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen pb-32 transition-colors duration-300", pageStyles[theme])}>
      <CartHeader />
      <CartLoveTip />
      
      <CartList 
        items={items} 
        onUpdateQuantity={updateQuantity} 
        onRemove={removeItem} 
      />
      
      <CartSummary totals={totals} />
      
      <CheckoutBar 
        onCheckout={handleCheckout} 
        totals={totals} 
      />
    </div>
  );
}
