import Link from "next/link";
import { PageContainer } from "../components/ui/PageContainer";
import { Card } from "../components/ui/Card";
import { ThemeSwitcher } from "../components/ui/ThemeSwitcher";
import { PopularDishList } from "../components/stats/PopularDishList";
import { WeeklyFavoriteList } from "../components/stats/WeeklyFavoriteList";
import { TodayOrderList } from "../components/stats/TodayOrderList";
import { dishes, orders } from "../lib/mock-data";

export default function Home() {
  return (
    <PageContainer>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">LoveMenu</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            用亲亲和贴贴点餐，让今天更甜一点
          </p>
        </div>
        <ThemeSwitcher />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">快速入口</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm text-white"
            >
              去点餐
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-text)]"
            >
              我的购物车
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-text)]"
            >
              订单状态
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-text)]"
            >
              情侣聊天
            </Link>
          </div>
        </Card>
        <PopularDishList dishes={dishes} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <WeeklyFavoriteList orders={orders} />
        <TodayOrderList orders={orders} />
      </div>
    </PageContainer>
  );
}
