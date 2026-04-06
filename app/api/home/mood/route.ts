import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [configs, todayOrders, todayEmergencyOrders, latestFoodRequest, topDish] = await Promise.all([
      prisma.systemConfig.findMany({
        where: {
          key: {
            in: ["homeMoodText", "homeCravingText"],
          },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: today },
          isEmergency: true,
        },
      }),
      prisma.foodRequest.findFirst({
        where: {
          status: { in: ["pending", "approved"] },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.orderItem.groupBy({
        by: ["dishId"],
        where: {
          order: {
            createdAt: { gte: thirtyDaysAgo },
          },
        },
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 1,
      }),
    ]);

    const configMap = new Map(configs.map((item) => [item.key, item.value]));

    const topDishInfo = topDish[0]
      ? await prisma.dish.findUnique({
          where: { id: topDish[0].dishId },
          select: { name: true },
        })
      : null;

    let mood = configMap.get("homeMoodText") || "";
    if (!mood) {
      if (todayEmergencyOrders > 0) {
        mood = "⚡ 今天有点忙，先吃点好的补补能量";
      } else if (todayOrders >= 3) {
        mood = "🥰 今天被投喂得很幸福";
      } else if (todayOrders > 0) {
        mood = "😊 今天已经有期待的味道啦";
      } else {
        mood = "🌤️ 今天也很适合好好吃饭";
      }
    }

    const craving =
      configMap.get("homeCravingText") ||
      latestFoodRequest?.name ||
      topDishInfo?.name ||
      "还没想好，去菜单里挑挑吧";

    return NextResponse.json({
      data: {
        mood,
        craving,
      },
    });
  } catch (error) {
    console.error("[api/home/mood][GET] 获取首页状态失败", error);
    return NextResponse.json({ message: "获取首页状态失败" }, { status: 500 });
  }
}
