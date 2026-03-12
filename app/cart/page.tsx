"use client";

import Link from "next/link";
import { PageContainer } from "../../components/ui/PageContainer";
import { EmptyState } from "../../components/ui/EmptyState";
import { CartItem } from "../../components/order/CartItem";
import { Button } from "../../components/ui/Button";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../utils/format";

export default function CartPage() {
  const { items, totals, updateQuantity, removeItem } = useCart();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">购物车</h1>
        <Link href="/menu" className="text-sm text-[var(--color-primary)]">
          继续点餐
        </Link>
      </div>
      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <EmptyState title="购物车是空的" description="挑选几道喜欢的菜吧">
            <Link href="/menu">
              <Button>去点餐</Button>
            </Link>
          </EmptyState>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdate={updateQuantity}
              onRemove={removeItem}
            />
          ))
        )}
      </div>
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-[var(--color-accent)] px-4 py-3">
        <span className="text-sm text-[var(--color-muted)]">合计</span>
        <span className="text-base font-semibold">
          {formatPrice(totals.kiss, totals.hug)}
        </span>
      </div>
    </PageContainer>
  );
}
