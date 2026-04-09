"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { useQueryClient } from "@tanstack/react-query";
import { useMessage } from "@/components/ui/Message";
import { cn } from "@/lib/utils";
import { ThemeName } from "@/types";

import CartHeader from "@/components/mobile/cart/CartHeader";
import CartLoveTip from "@/components/mobile/cart/CartLoveTip";
import CartList from "@/components/mobile/cart/CartList";
import CartSummary from "@/components/mobile/cart/CartSummary";
import CheckoutBar from "@/components/mobile/cart/CheckoutBar";
import EmptyCart from "@/components/mobile/cart/EmptyCart";
import OrderReasonSelector from "@/components/mobile/cart/OrderReasonSelector";

const pageStyles: Record<ThemeName, string> = {
  couple: "bg-linear-to-b from-pink-50 to-white",
  cute: "bg-[#fff5fb]",
  minimal: "bg-white",
  night: "bg-[#1f1f1f]",
};

export default function CartPage() {
  const { items, totals, updateQuantity, removeItem, clearCart, isLoading } =
    useCart();
  const { user, isLoading: isUserLoading } = useUser();
  const { theme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const message = useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReasonSelectorOpen, setIsReasonSelectorOpen] = useState(false);

  const handleCheckoutClick = () => {
    if (isUserLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }
    setIsReasonSelectorOpen(true);
  };

  const handleConfirmOrder = async (reason: string) => {
    if (!user || items.length === 0) return;

    setIsReasonSelectorOpen(false);
    setIsSubmitting(true);

    try {
      const orderData = {
        userId: user.id,
        items: items.map((item) => ({
          dish: { id: item.dish.id },
          quantity: item.quantity,
          note: item.note,
        })),
        totalKiss: totals.kiss,
        totalHug: totals.hug,
        reason,
        isEmergency: false,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const json = await res.json();

      if (!res.ok) {
        // 处理余额不足错误
        if (res.status === 400 && json.message?.includes("余额不足")) {
          message.error(json.message);
        } else {
          message.error(json.message || "创建订单失败");
        }
        setIsSubmitting(false);
        return;
      }

      await clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // 刷新用户余额
      router.push("/orders");
    } catch (error) {
      console.error("Order creation error:", error);
      message.error("创建订单失败，请稍后重试");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          pageStyles[theme]
        )}
      >
        <div className="animate-pulse text-pink-500">加载中...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn("min-h-screen", pageStyles[theme])}>
        <CartHeader />
        <EmptyCart />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen pb-24 transition-colors duration-300",
        pageStyles[theme]
      )}
    >
      <CartHeader />
      <CartLoveTip />

      <CartList
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
      />

      <CartSummary totals={totals} />

      <CheckoutBar
        onCheckout={handleCheckoutClick}
        totals={totals}
        isLoading={isSubmitting || isUserLoading}
      />

      <OrderReasonSelector
        isOpen={isReasonSelectorOpen}
        onClose={() => setIsReasonSelectorOpen(false)}
        onConfirm={handleConfirmOrder}
        isLoading={isSubmitting}
      />
    </div>
  );
}
