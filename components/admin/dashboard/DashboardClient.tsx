"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, AlertCircle, MessageSquare, TrendingUp, Flame, Star, ListPlus } from 'lucide-react';
import LoveStatCard from './LoveStatCard';
import LoveChart from './LoveChart';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import PageHeader from '../shared/PageHeader';

export default function DashboardClient({ 
  initialStats, 
  initialTrends, 
  initialDistribution, 
  initialTopItems 
}: any) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeChart, setActiveChart] = useState<'interactions' | 'points' | 'priority'>('interactions');
  const [activeTab, setActiveTab] = useState<'categoryDistribution' | 'sourceDistribution'>('categoryDistribution');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    { title: '今日互动订单', value: initialStats.interactionsToday, trend: initialStats.interactionsTrend, icon: ShoppingBag },
    { title: '今日亲亲+贴贴', value: initialStats.pointsToday, trend: initialStats.pointsTrend, icon: Heart },
    { title: '紧急想吃订单', value: initialStats.priorityOrders, trend: initialStats.priorityTrend, icon: AlertCircle },
    { title: '新增反馈', value: initialStats.newFeedback, trend: initialStats.feedbackTrend, icon: MessageSquare },
    { title: '新增想吃清单', value: initialStats.newWishlist, trend: initialStats.wishlistTrend, icon: ListPlus },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col gap-6 pb-20">
        <PageHeader title="LoveMenu" subtitle="数据概览" className="mb-2" />

        {/* 移动端数据卡片（横滑） */}
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x hide-scrollbar">
          {stats.map((stat, idx) => (
            <div key={idx} className="snap-center min-w-[240px]">
              <LoveStatCard {...stat as any} className="h-full bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] border-none" />
            </div>
          ))}
        </div>

        {/* 趋势图 */}
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-4 shadow-sm border border-[var(--border)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[var(--foreground)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
              趋势分析
            </h3>
            <div className="flex bg-[var(--secondary)] rounded-full p-1 overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setActiveChart('interactions')}
                className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap", activeChart === 'interactions' ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--muted-foreground)]")}
              >
                互动订单
              </button>
              <button 
                onClick={() => setActiveChart('points')}
                className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap", activeChart === 'points' ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--muted-foreground)]")}
              >
                积分趋势
              </button>
              <button 
                onClick={() => setActiveChart('priority')}
                className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap", activeChart === 'priority' ? "bg-[var(--primary)] text-white shadow-sm" : "text-[var(--muted-foreground)]")}
              >
                紧急想吃
              </button>
            </div>
          </div>
          <LoveChart 
            type="line" 
            data={initialTrends} 
            dataKeys={[activeChart]} 
            colors={activeChart === 'interactions' ? ['#ff4d7d'] : activeChart === 'points' ? ['#ffb347'] : ['#ef4444']}
          />
        </div>

        {/* 分布图 */}
        <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-4 shadow-sm border border-[var(--border)]">
          <div className="flex justify-center gap-4 mb-4 border-b border-[var(--border)] pb-2">
            <button 
              onClick={() => setActiveTab('categoryDistribution')}
              className={cn("pb-2 px-2 text-sm font-medium transition-all relative", activeTab === 'categoryDistribution' ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]")}
            >
              分类占比
              {activeTab === 'categoryDistribution' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('sourceDistribution')}
              className={cn("pb-2 px-2 text-sm font-medium transition-all relative", activeTab === 'sourceDistribution' ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]")}
            >
              来源占比
              {activeTab === 'sourceDistribution' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-t-full" />}
            </button>
          </div>
          <LoveChart 
            type="pie" 
            data={initialDistribution[activeTab]} 
            colors={['#ff4d7d', '#ffb347', '#6366f1', '#10b981', '#f43f5e']}
          />
        </div>

        {/* 热门菜品（卡片） */}
        <div className="mb-6">
          <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            热门菜品 TOP5
          </h3>
          <div className="flex flex-col gap-3">
            {initialTopItems.topDishes.map((item: any, idx: number) => (
              <div key={item.id} className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center font-bold text-[var(--primary)]">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)]">{item.name}</h4>
                    <p className="text-xs text-[var(--muted-foreground)]">{item.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm font-medium text-[var(--foreground)]">点餐 {item.orderCount} 次</div>
                  <div className="flex items-center text-xs text-rose-500">
                    <Heart className="w-3 h-3 mr-1 fill-current" /> {item.likes}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门想吃清单（卡片） */}
        <div>
          <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            热门想吃清单 TOP5
          </h3>
          <div className="flex flex-col gap-3">
            {initialTopItems.topWishlist.map((item: any, idx: number) => (
              <div key={item.id} className="bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center font-bold text-[var(--primary)]">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)]">{item.name}</h4>
                    <p className="text-xs text-[var(--muted-foreground)]">{item.category}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm font-medium text-[var(--foreground)]">提及 {item.mentionCount} 次</div>
                  <div className="flex items-center text-xs text-[var(--muted-foreground)]">
                    <span className="px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--primary)] text-[10px]">{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PC Layout
  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title="Dashboard" 
        subtitle="核心数据分析与总览" 
        className="mb-0" 
      />

      {/* 数据卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <LoveStatCard key={idx} {...stat as any} />
        ))}
      </div>

      {/* 趋势图 */}
      <LoveChart 
        title="近期趋势分析 (近7天)" 
        type="line" 
        data={initialTrends} 
        dataKeys={['interactions', 'points', 'priority']} 
        colors={['#ff4d7d', '#ffb347', '#ef4444']}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 分布图 */}
        <div className="flex flex-col gap-6 xl:col-span-1">
          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-[var(--foreground)] text-center">菜品分类占比</h3>
            <LoveChart type="pie" data={initialDistribution.categoryDistribution} className="border-none shadow-none p-0 flex-1" />
          </div>
          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-[var(--foreground)] text-center">订单来源占比</h3>
            <LoveChart type="pie" data={initialDistribution.sourceDistribution} className="border-none shadow-none p-0 flex-1" />
          </div>
        </div>

        {/* 热门菜品与想吃清单 */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          {/* 热门菜品表格 */}
          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm flex-1">
            <h3 className="text-lg font-bold mb-6 text-[var(--foreground)]">热门菜品 TOP5</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                    <th className="pb-3 font-medium">排名</th>
                    <th className="pb-3 font-medium">菜名</th>
                    <th className="pb-3 font-medium">分类</th>
                    <th className="pb-3 font-medium">点餐次数</th>
                    <th className="pb-3 font-medium">点赞数</th>
                    <th className="pb-3 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {initialTopItems.topDishes.map((item: any, idx: number) => (
                    <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/50 transition-colors">
                      <td className="py-4">
                        <span className={cn(
                          "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                          idx === 0 ? "bg-yellow-100 text-yellow-600" :
                          idx === 1 ? "bg-gray-100 text-gray-600" :
                          idx === 2 ? "bg-orange-100 text-orange-600" :
                          "bg-[var(--secondary)] text-[var(--primary)]"
                        )}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-[var(--foreground)]">{item.name}</td>
                      <td className="py-4 text-[var(--muted-foreground)]">{item.category}</td>
                      <td className="py-4 font-bold text-[var(--foreground)]">{item.orderCount}</td>
                      <td className="py-4">
                        <div className="flex items-center text-rose-500">
                          <Heart className="w-4 h-4 mr-1 fill-current" /> {item.likes}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded-md bg-[var(--secondary)] text-[var(--primary)] text-xs">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 热门想吃清单表格 */}
          <div className="bg-[var(--card)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm flex-1">
            <h3 className="text-lg font-bold mb-6 text-[var(--foreground)]">热门想吃清单 TOP5</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
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
                    <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/50 transition-colors">
                      <td className="py-4">
                        <span className={cn(
                          "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                          idx === 0 ? "bg-yellow-100 text-yellow-600" :
                          idx === 1 ? "bg-gray-100 text-gray-600" :
                          idx === 2 ? "bg-orange-100 text-orange-600" :
                          "bg-[var(--secondary)] text-[var(--primary)]"
                        )}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-[var(--foreground)]">{item.name}</td>
                      <td className="py-4 text-[var(--muted-foreground)]">{item.category}</td>
                      <td className="py-4 font-bold text-[var(--foreground)]">{item.mentionCount}</td>
                      <td className="py-4">
                        <div className="flex items-center text-rose-500">
                          <Heart className="w-4 h-4 mr-1 fill-current" /> {item.likes}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 text-xs">{item.status}</span>
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
