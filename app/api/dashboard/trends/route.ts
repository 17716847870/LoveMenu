import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logApiError } from '@/lib/error-log';

export async function GET() {
  try {
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const trends = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const orders = await prisma.order.findMany({
        where: {
          createdAt: { gte: date, lt: nextDate }
        },
        select: {
          isEmergency: true,
          totalKiss: true,
          totalHug: true
        }
      });

      const dayName = dayNames[date.getDay()];
      const interactions = orders.length;
      const priority = orders.filter(o => o.isEmergency).length;
      const points = orders.reduce((sum, o) => sum + o.totalKiss + o.totalHug, 0);

      trends.push({
        name: dayName,
        interactions,
        points,
        priority
      });
    }

    return NextResponse.json(trends);
  } catch (error) {
    console.error('Trends API error:', error);
    await logApiError({ scope: '/api/dashboard/trends[GET]', path: '/api/dashboard/trends', method: 'GET' }, error);
    return NextResponse.json(
      { message: '获取趋势数据失败' },
      { status: 500 }
    );
  }
}
