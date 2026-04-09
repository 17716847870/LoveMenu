"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Heart,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  Flame,
  Star,
  ListPlus,
  Search,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import LoveStatCard from "./LoveStatCard";
import LoveChart from "./LoveChart";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import PageHeader from "../shared/PageHeader";

const CATEGORY_COLORS = [
  "#ff4d7d",
  "#10b981",
  "#6366f1",
  "#ffb347",
  "#8b5cf6",
  "#fb7185",
  "#f59e0b",
];
const SOURCE_COLORS = ["#ff4d7d", "#ffb347", "#6366f1"];

export default function DashboardClient({
  initialStats,
  initialTrends,
  initialDistribution,
  initialTopItems,
}: any) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [activeChart, setActiveChart] = useState<
    "interactions" | "points" | "priority"
  >("interactions");
  const [activeTab, setActiveTab] = useState<
    "categoryDistribution" | "sourceDistribution"
  >("categoryDistribution");
  const [categoryKeyword, setCategoryKeyword] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLastUpdatedAt(new Date());
    router.refresh();
  };

  useEffect(() => {
    if (!isRefreshing) return;
    const timer = window.setTimeout(() => setIsRefreshing(false), 900);
    return () => window.clearTimeout(timer);
  }, [isRefreshing]);
  const stats = [
    {
      title: "今日互动订单",
      value: initialStats.interactionsToday,
      trend: initialStats.interactionsTrend,
      icon: ShoppingBag,
    },
    {
      title: "今日亲亲+贴贴",
      value: initialStats.pointsToday,
      trend: initialStats.pointsTrend,
      icon: Heart,
    },
    {
      title: "紧急想吃订单",
      value: initialStats.priorityOrders,
      trend: initialStats.priorityTrend,
      icon: AlertCircle,
    },
    {
      title: "新增反馈",
      value: initialStats.newFeedback,
      trend: initialStats.feedbackTrend,
      icon: MessageSquare,
    },
    {
      title: "新增想吃清单",
      value: initialStats.newWishlist,
      trend: initialStats.wishlistTrend,
      icon: ListPlus,
    },
  ];

  const fullCategoryDistribution = useMemo(() => {
    return initialDistribution.categoryDistribution ?? [];
  }, [initialDistribution]);
  const sourceDistribution = initialDistribution.sourceDistribution ?? [];
  const filteredCategoryDistribution = useMemo(() => {
    const keyword = categoryKeyword.trim().toLowerCase();
    if (!keyword) return fullCategoryDistribution;
    return fullCategoryDistribution.filter((item: { name: string }) =>
      item.name.toLowerCase().includes(keyword)
    );
  }, [fullCategoryDistribution, categoryKeyword]);

  const visibleCategoryDistribution = useMemo(() => {
    if (filteredCategoryDistribution.length <= 6)
      return filteredCategoryDistribution;
    const sorted = [...filteredCategoryDistribution].sort(
      (a, b) => b.value - a.value
    );
    const othersValue = sorted
      .slice(5)
      .reduce((sum, item) => sum + item.value, 0);
    return [...sorted.slice(0, 5), { name: "更多分类", value: othersValue }];
  }, [filteredCategoryDistribution]);

  const totalCategoryCount = fullCategoryDistribution.reduce(
    (sum: number, item: { value: number }) => sum + item.value,
    0
  );
  const activeDistributionData =
    activeTab === "categoryDistribution"
      ? visibleCategoryDistribution
      : sourceDistribution;

  const refreshAction = (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-xs text-muted-foreground">最近更新时间</div>
        <div className="text-sm font-medium text-foreground">
          {lastUpdatedAt.toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
      >
        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        {isRefreshing ? "刷新中..." : "手动刷新"}
      </button>
    </div>
  );
  const categoryPanel = (
    <>
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={categoryKeyword}
          onChange={(e) => setCategoryKeyword(e.target.value)}
          placeholder="搜索分类名称"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <LoveChart
        type="pie"
        data={visibleCategoryDistribution}
        colors={CATEGORY_COLORS}
        showLegend={false}
        pieOuterRadius={94}
        className="border-none shadow-none p-0"
      />
      <div className="mt-4 grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1">
        {filteredCategoryDistribution.length > 0 ? (
          filteredCategoryDistribution.map((item: any, idx: number) => (
            <div
              key={`${item.name}-${idx}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-secondary/20 px-3 py-2.5 text-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                  }}
                />
                <span className="truncate text-foreground">{item.name}</span>
              </div>
              <span className="ml-4 shrink-0 font-medium text-muted-foreground">
                {item.value} 道
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            没有找到匹配的分类
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col gap-6 pb-20">
        <PageHeader
          title="LoveMenu"
          subtitle="数据概览"
          className="mb-2"
          action={refreshAction}
        />
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 hide-scrollbar">
          {stats.map((stat, idx) => (
            <div key={idx} className="min-w-[240px] snap-center">
              <LoveStatCard
                {...(stat as any)}
                className="h-full border-none bg-linear-to-br from-card to-secondary"
              />
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold text-foreground">
              <TrendingUp className="h-5 w-5 text-primary" />
              趋势分析
            </h3>
            <div className="flex overflow-x-auto rounded-full bg-secondary p-1 hide-scrollbar">
              {["interactions", "points", "priority"].map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveChart(key as any)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-all",
                    activeChart === key
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  {key === "interactions"
                    ? "互动订单"
                    : key === "points"
                      ? "积分趋势"
                      : "紧急想吃"}
                </button>
              ))}
            </div>
          </div>
          <LoveChart
            type="line"
            data={initialTrends}
            dataKeys={[activeChart]}
            colors={
              activeChart === "interactions"
                ? ["#ff4d7d"]
                : activeChart === "points"
                  ? ["#ffb347"]
                  : ["#ef4444"]
            }
          />
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex justify-center gap-4 border-b border-border pb-2">
            {["categoryDistribution", "sourceDistribution"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "relative px-2 pb-2 text-sm font-medium transition-all",
                  activeTab === tab ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab === "categoryDistribution" ? "分类占比" : "来源占比"}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
          {activeTab === "categoryDistribution" ? (
            <>
              <div className="mb-3 text-xs text-muted-foreground">
                共 {fullCategoryDistribution.length} 个分类 · 菜品总数{" "}
                {totalCategoryCount}
              </div>
              {categoryPanel}
            </>
          ) : (
            <LoveChart
              type="pie"
              data={activeDistributionData}
              colors={SOURCE_COLORS}
              className="border-none shadow-none p-0"
            />
          )}
        </div>
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-bold text-foreground">
              <Flame className="h-5 w-5 text-orange-500" />
              热门菜品 TOP5
            </h3>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-medium text-orange-600">
              已排除退单影响
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {initialTopItems.topDishes.map((item: any, idx: number) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-primary">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate font-bold text-foreground">
                        {item.name}
                      </h4>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-rose-50 px-3 py-2 text-right">
                    <div className="text-base font-bold text-rose-500">
                      {item.orderCount}
                    </div>
                    <div className="text-[11px] text-rose-400">有效下单</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center text-rose-500">
                    <Heart className="mr-1 h-3 w-3 fill-current" /> {item.likes}
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-1 text-primary">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
            <Star className="h-5 w-5 text-yellow-500" />
            热门想吃清单 TOP5
          </h3>
          <div className="flex flex-col gap-3">
            {initialTopItems.topWishlist.map((item: any, idx: number) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-primary">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate font-bold text-foreground">
                      {item.name}
                    </h4>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-medium text-foreground">
                    提及 {item.mentionCount} 次
                  </div>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-primary">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        subtitle="核心数据分析与总览"
        className="mb-0"
        action={refreshAction}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, idx) => (
          <LoveStatCard key={idx} {...(stat as any)} />
        ))}
      </div>
      <LoveChart
        title="近期趋势分析 (近7天)"
        type="line"
        data={initialTrends}
        dataKeys={["interactions", "points", "priority"]}
        colors={["#ff4d7d", "#ffb347", "#ef4444"]}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="flex flex-col gap-6 xl:col-span-1">
          <div className="flex flex-1 flex-col rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  菜品分类占比
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  分类增多后会聚合尾部分类，并支持快速搜索
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {fullCategoryDistribution.length} 个分类
              </div>
            </div>
            {categoryPanel}
          </div>
          <div className="flex flex-1 flex-col rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-bold text-foreground">
              订单来源占比
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              最近 30 天有效来源分布
            </p>
            <LoveChart
              type="pie"
              data={sourceDistribution}
              colors={SOURCE_COLORS}
              className="flex-1 border-none shadow-none p-0"
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 xl:col-span-2">
          <div className="flex-1 rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  热门菜品 TOP5
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  基于有效订单统计，退单不会继续占用热度
                </p>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                净下单次数
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-medium">排名</th>
                    <th className="pb-3 font-medium">菜名</th>
                    <th className="pb-3 font-medium">分类</th>
                    <th className="pb-3 font-medium">有效下单</th>
                    <th className="pb-3 font-medium">点赞数</th>
                    <th className="pb-3 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {initialTopItems.topDishes.map((item: any, idx: number) => (
                    <tr
                      key={item.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-secondary/50"
                    >
                      <td className="py-4">
                        <span
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                            idx === 0
                              ? "bg-yellow-100 text-yellow-600"
                              : idx === 1
                                ? "bg-gray-100 text-gray-600"
                                : idx === 2
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-secondary text-primary"
                          )}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-foreground">
                        {item.name}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {item.category}
                      </td>
                      <td className="py-4 font-bold text-foreground">
                        {item.orderCount}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center text-rose-500">
                          <Heart className="mr-1 h-4 w-4 fill-current" />{" "}
                          {item.likes}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="rounded-md bg-secondary px-2 py-1 text-xs text-primary">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-foreground">
              热门想吃清单 TOP5
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-3 font-medium">排名</th>
                    <th className="pb-3 font-medium">想吃名称</th>
                    <th className="pb-3 font-medium">分类</th>
                    <th className="pb-3 font-medium">被提次数</th>
                    <th className="pb-3 font-medium">点赞数</th>
                    <th className="pb-3 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {initialTopItems.topWishlist.map((item: any, idx: number) => (
                    <tr
                      key={item.id}
                      className="border-b border-border transition-colors last:border-0 hover:bg-secondary/50"
                    >
                      <td className="py-4">
                        <span
                          className={cn(
                            "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                            idx === 0
                              ? "bg-yellow-100 text-yellow-600"
                              : idx === 1
                                ? "bg-gray-100 text-gray-600"
                                : idx === 2
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-secondary text-primary"
                          )}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-foreground">
                        {item.name}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {item.category}
                      </td>
                      <td className="py-4 font-bold text-foreground">
                        {item.mentionCount}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center text-rose-500">
                          <Heart className="mr-1 h-4 w-4 fill-current" />{" "}
                          {item.likes}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="rounded-md bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
