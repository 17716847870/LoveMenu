import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logApiError } from '@/lib/error-log';

export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: thirtyDaysAgo }
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
        status: '已上菜单'
      }));

    const topWishlist = await prisma.foodRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const formattedWishlist = topWishlist.map((item, idx) => ({
      id: item.id,
      name: item.name,
      category: '待分类',
      mentionCount: 1,
      likes: 0,
      status: item.status === 'pending' ? '待审核' : '已添加'
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
