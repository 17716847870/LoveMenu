import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      ordersToday,
      emergencyOrdersToday,
      newFeedbackCount,
      newWishlistCount,
      ordersYesterday,
      emergencyOrdersYesterday,
      feedbackYesterday,
      wishlistYesterday
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: today, lt: tomorrow }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: today, lt: tomorrow },
          isEmergency: true
        }
      }),
      prisma.feedback.count({
        where: {
          createdAt: { gte: today, lt: tomorrow }
        }
      }),
      prisma.foodRequest.count({
        where: {
          createdAt: { gte: today, lt: tomorrow }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: new Date(today.getTime() - 86400000), lt: today }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: new Date(today.getTime() - 86400000), lt: today },
          isEmergency: true
        }
      }),
      prisma.feedback.count({
        where: {
          createdAt: { gte: new Date(today.getTime() - 86400000), lt: today }
        }
      }),
      prisma.foodRequest.count({
        where: {
          createdAt: { gte: new Date(today.getTime() - 86400000), lt: today }
        }
      })
    ]);

    const ordersTodayData = await prisma.order.aggregate({
      where: {
        createdAt: { gte: today, lt: tomorrow }
      },
      _sum: { totalKiss: true, totalHug: true }
    });

    const pointsToday = (ordersTodayData._sum.totalKiss || 0) + (ordersTodayData._sum.totalHug || 0);

    const getTrend = (today: number, yesterday: number): 'up' | 'down' | 'neutral' => {
      if (today > yesterday) return 'up';
      if (today < yesterday) return 'down';
      return 'neutral';
    };

    return NextResponse.json({
      interactionsToday: ordersToday,
      pointsToday,
      priorityOrders: emergencyOrdersToday,
      newFeedback: newFeedbackCount,
      newWishlist: newWishlistCount,
      interactionsTrend: getTrend(ordersToday, ordersYesterday),
      pointsTrend: 'up',
      priorityTrend: getTrend(emergencyOrdersToday, emergencyOrdersYesterday),
      feedbackTrend: getTrend(newFeedbackCount, feedbackYesterday),
      wishlistTrend: getTrend(newWishlistCount, wishlistYesterday),
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { message: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
