"use client";

import FoodRouletteCard from "@/components/mobile/FoodRouletteCard";
import CoupleMoodCard from "@/components/mobile/CoupleMoodCard";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Order } from "@/types";

export default function HomePage() {

  const todayOrders: Order[] = [
    {
      id: "1001",
      userId: "1",
      status: "completed",
      totalKiss: 2,
      totalHug: 1,
      items: [],
      createdAt: "2024-03-12",
    },
    {
      id: "1002",
      userId: "1",
      status: "preparing",
      totalKiss: 1,
      totalHug: 0,
      items: [],
      createdAt: "2024-03-12",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 pt-8">
      {/* Mood Card */}
      <CoupleMoodCard />

      {/* Random Dish */}
      <FoodRouletteCard />

      {/* Today's Orders */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">今日已点</h2>
          <Link href="/profile" className="text-sm text-primary">查看全部</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 flex flex-col gap-2 bg-card/50">
            <span className="text-2xl">🍗</span>
            <span className="font-medium">可乐鸡翅</span>
            <span className="text-xs text-muted-foreground">中午</span>
          </Card>
          <Card className="p-4 flex flex-col gap-2 bg-card/50">
            <span className="text-2xl">🍜</span>
            <span className="font-medium">豚骨拉面</span>
            <span className="text-xs text-muted-foreground">晚上</span>
          </Card>
        </div>
      </div>

      {/* Weekly Favorites */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">本周最爱</h2>
        <Card className="divide-y divide-border">
          <div className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">1</div>
            <div className="flex-1 font-medium">红烧肉</div>
            <div className="text-sm text-muted-foreground">3次</div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold">2</div>
            <div className="flex-1 font-medium">炒饭</div>
            <div className="text-sm text-muted-foreground">2次</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
