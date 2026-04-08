import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logApiError } from '@/lib/error-log';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET() {
  noStore();
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: thirtyDaysAgo },
          status: { not: 'cancelled' }
        }
      },
      include: {
        dish: {
          include: {
            category: true
          }
        }
      }
    });

    const dishStats = new Map<string, { count: number; dish: typeof orderItems[0]['dish'] }>();
    
    for (const item of orderItems) {
      const existing = dishStats.get(item.dishId);
      if (existing) {
        existing.count += item.quantity;
      } else {
        dishStats.set(item.dishId, { count: item.quantity, dish: item.dish });
      }
    }

    const topDishes = Array.from(dishStats.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item, idx) => ({
        id: item.dish.id,
        name: item.dish.name,
        category: item.dish.category.name,
        orderCount: item.count,
        likes: item.dish.popularity,
        status: '有效订单中'
      }));

    const topWishlist = await prisma.foodRequest.groupBy({
      by: ['name', 'status'],
      _count: { _all: true },
      _max: { createdAt: true },
      orderBy: [
        { _count: { name: 'desc' } },
        { _max: { createdAt: 'desc' } }
      ],
      take: 5
    });

    const formattedWishlist = topWishlist.map((item, idx) => ({
      id: `${item.name}-${item.status}-${idx}`,
      name: item.name,
      category: '待分类',
      mentionCount: item._count._all,
      likes: 0,
      status: item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已添加' : '已拒绝'
    }));

    return NextResponse.json({
      topDishes,
      topWishlist: formattedWishlist
    });
  } catch (error) {
    console.error('Top items API error:', error);
    await logApiError({ scope: '/api/dashboard/top-items[GET]', path: '/api/dashboard/top-items', method: 'GET' }, error);
    return NextResponse.json(
      { message: '获取热门数据失败' },
      { status: 500 }
    );
  }
}
