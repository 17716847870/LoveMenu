"use client";

import CartItem from "@/components/order/CartItem";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { Heart, User, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, totals, updateQuantity, updateNote, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Call API to create order
    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      router.push("/profile");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="购物车是空的"
        description="快去选点好吃的吧！"
        icon={<ShoppingBag className="w-16 h-16 opacity-20" />}
        actionLabel="去点餐"
        actionHref="/menu"
      />
    );
  }

  return (
    <div className="flex flex-col h-full min-h-screen pb-32">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b h-14 flex items-center justify-center font-semibold text-lg">
        购物车
      </div>

      <div className="flex flex-col gap-4 p-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onUpdateNote={updateNote}
          />
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t max-w-[480px] mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground font-medium">总计:</span>
          <div className="flex items-center gap-4 text-lg font-bold">
            {totals.kiss > 0 && (
              <span className="flex items-center gap-1 text-pink-500">
                <Heart fill="currentColor" /> {totals.kiss}
              </span>
            )}
            {totals.hug > 0 && (
              <span className="flex items-center gap-1 text-orange-500">
                <User /> {totals.hug}
              </span>
            )}
          </div>
        </div>
        <Button 
          className="w-full h-12 text-lg rounded-full shadow-lg shadow-primary/20" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "提交中..." : "提交订单"}
        </Button>
      </div>
    </div>
  );
}
