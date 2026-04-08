import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logApiError } from '@/lib/error-log';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
  noStore();
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
          createdAt: { gte: today, lt: tomorrow },
          status: { not: 'cancelled' }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: today, lt: tomorrow },
          isEmergency: true,
          status: { not: 'cancelled' }
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
          createdAt: { gte: new Date(today.getTime() - 86400000), lt: today },
          status: { not: 'cancelled' }
        }
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: new Date(today.getTime() - 86400000), lt: today },
          isEmergency: true,
          status: { not: 'cancelled' }
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
        createdAt: { gte: today, lt: tomorrow },
        status: { not: 'cancelled' }
      },
      _sum: { totalKiss: true, totalHug: true }
    });

    const ordersYesterdayData = await prisma.order.aggregate({
      where: {
        createdAt: { gte: new Date(today.getTime() - 86400000), lt: today },
        status: { not: 'cancelled' }
      },
      _sum: { totalKiss: true, totalHug: true }
    });

    const pointsToday = (ordersTodayData._sum.totalKiss || 0) + (ordersTodayData._sum.totalHug || 0);
    const pointsYesterday = (ordersYesterdayData._sum.totalKiss || 0) + (ordersYesterdayData._sum.totalHug || 0);

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
      pointsTrend: getTrend(pointsToday, pointsYesterday),
      priorityTrend: getTrend(emergencyOrdersToday, emergencyOrdersYesterday),
      feedbackTrend: getTrend(newFeedbackCount, feedbackYesterday),
      wishlistTrend: getTrend(newWishlistCount, wishlistYesterday),
    });
  } catch (error) {
    console.error('Stats API error:', error);
    await logApiError({ scope: '/api/dashboard/stats[GET]', path: '/api/dashboard/stats', method: 'GET' }, error);
    return NextResponse.json(
      { message: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
