import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.dishCategory.findMany({
      include: {
        _count: {
          select: { dishes: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    const categoryDistribution = categories.map(cat => ({
      name: cat.name,
      value: cat._count.dishes
    }));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [allOrders, emergencyOrders, wishlistRequests] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          isEmergency: true
        }
      }),
      prisma.foodRequest.count({
        where: {
          createdAt: { gte: thirtyDaysAgo }
        }
      })
    ]);

    const normalOrders = Math.max(0, allOrders - emergencyOrders);

    const total = normalOrders + emergencyOrders + wishlistRequests;
    
    const sourceDistribution = [
      { name: '普通点餐', value: total > 0 ? Math.round((normalOrders / total) * 100) : 0 },
      { name: '紧急想吃', value: total > 0 ? Math.round((emergencyOrders / total) * 100) : 0 },
      { name: '想吃清单', value: total > 0 ? Math.round((wishlistRequests / total) * 100) : 0 },
    ];

    return NextResponse.json({
      categoryDistribution,
      sourceDistribution
    });
  } catch (error) {
    console.error('Distribution API error:', error);
    return NextResponse.json(
      { message: '获取分布数据失败' },
      { status: 500 }
    );
  }
}
