import { PageContainer } from "../../components/ui/PageContainer";
import DashboardClient from "../../components/admin/dashboard/DashboardClient";
import { prisma } from "@/lib/db";

async function getStats() {
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
      prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.order.count({ where: { createdAt: { gte: today, lt: tomorrow }, isEmergency: true } }),
      prisma.feedback.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.foodRequest.count({ where: { createdAt: { gte: today, lt: tomorrow } } }),
      prisma.order.count({ where: { createdAt: { gte: new Date(today.getTime() - 86400000), lt: today } } }),
      prisma.order.count({ where: { createdAt: { gte: new Date(today.getTime() - 86400000), lt: today }, isEmergency: true } }),
      prisma.feedback.count({ where: { createdAt: { gte: new Date(today.getTime() - 86400000), lt: today } } }),
      prisma.foodRequest.count({ where: { createdAt: { gte: new Date(today.getTime() - 86400000), lt: today } } })
    ]);

    const ordersTodayData = await prisma.order.aggregate({
      where: { createdAt: { gte: today, lt: tomorrow } },
      _sum: { totalKiss: true, totalHug: true }
    });

    const pointsToday = (ordersTodayData._sum.totalKiss || 0) + (ordersTodayData._sum.totalHug || 0);

    const getTrend = (today: number, yesterday: number): 'up' | 'down' | 'neutral' => {
      if (today > yesterday) return 'up';
      if (today < yesterday) return 'down';
      return 'neutral';
    };

    return {
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
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return {
      interactionsToday: 0, pointsToday: 0, priorityOrders: 0, newFeedback: 0, newWishlist: 0,
      interactionsTrend: 'neutral', pointsTrend: 'neutral', priorityTrend: 'neutral',
      feedbackTrend: 'neutral', wishlistTrend: 'neutral',
    };
  }
}

async function getTrends() {
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
        where: { createdAt: { gte: date, lt: nextDate } },
        select: { isEmergency: true, totalKiss: true, totalHug: true }
      });

      trends.push({
        name: dayNames[date.getDay()],
        interactions: orders.length,
        points: orders.reduce((sum, o) => sum + o.totalKiss + o.totalHug, 0),
        priority: orders.filter(o => o.isEmergency).length
      });
    }

    return trends;
  } catch (error) {
    console.error('Failed to fetch trends:', error);
    return [
      { name: '周一', interactions: 0, points: 0, priority: 0 },
      { name: '周二', interactions: 0, points: 0, priority: 0 },
      { name: '周三', interactions: 0, points: 0, priority: 0 },
      { name: '周四', interactions: 0, points: 0, priority: 0 },
      { name: '周五', interactions: 0, points: 0, priority: 0 },
      { name: '周六', interactions: 0, points: 0, priority: 0 },
      { name: '周日', interactions: 0, points: 0, priority: 0 },
    ];
  }
}

async function getDistribution() {
  try {
    const categories = await prisma.dishCategory.findMany({
      include: { _count: { select: { dishes: true } } },
      orderBy: { sortOrder: 'asc' }
    });

    const categoryDistribution = categories.map(cat => ({ name: cat.name, value: cat._count.dishes }));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [allOrders, emergencyOrders, wishlistRequests] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo }, isEmergency: true } }),
      prisma.foodRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } })
    ]);

    const normalOrders = Math.max(0, allOrders - emergencyOrders);
    const total = normalOrders + emergencyOrders + wishlistRequests;

    return {
      categoryDistribution,
      sourceDistribution: [
        { name: '普通点餐', value: total > 0 ? Math.round((normalOrders / total) * 100) : 0 },
        { name: '紧急想吃', value: total > 0 ? Math.round((emergencyOrders / total) * 100) : 0 },
        { name: '想吃清单', value: total > 0 ? Math.round((wishlistRequests / total) * 100) : 0 },
      ],
    };
  } catch (error) {
    console.error('Failed to fetch distribution:', error);
    return {
      categoryDistribution: [
        { name: '主食', value: 0 }, { name: '小吃', value: 0 }, { name: '饮品', value: 0 }, { name: '甜点', value: 0 },
      ],
      sourceDistribution: [
        { name: '普通点餐', value: 0 }, { name: '紧急想吃', value: 0 }, { name: '想吃清单', value: 0 },
      ],
    };
  }
}

async function getTopItems() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orderItems = await prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: thirtyDaysAgo } } },
      include: { dish: { include: { category: true } } }
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
      .map(item => ({
        id: item.dish.id,
        name: item.dish.name,
        category: item.dish.category.name,
        orderCount: item.count,
        likes: item.dish.popularity,
        status: '已上菜单'
      }));

    const topWishlist = await prisma.foodRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    const formattedWishlist = topWishlist.map(item => ({
      id: item.id, name: item.name, category: '待分类',
      mentionCount: 1, likes: 0,
      status: item.status === 'pending' ? '待审核' : '已添加'
    }));

    return { topDishes, topWishlist: formattedWishlist };
  } catch (error) {
    console.error('Failed to fetch top items:', error);
    return { topDishes: [], topWishlist: [] };
  }
}

export default async function AdminPage() {
  const [stats, trends, distribution, topItems] = await Promise.all([
    getStats(), getTrends(), getDistribution(), getTopItems()
  ]);

  return (
    <PageContainer>
      <DashboardClient
        initialStats={stats}
        initialTrends={trends}
        initialDistribution={distribution}
        initialTopItems={topItems}
      />
    </PageContainer>
  );
}
