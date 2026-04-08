import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logApiError } from '@/lib/error-log';

function normalizeText(value: string) {
  return value.replace(/\s+/g, "").toLowerCase();
}

export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [dishes, recentOrderItems, recentFoodRequests] = await Promise.all([
      prisma.dish.findMany({
        include: {
          category: true,
        },
        orderBy: [{ popularity: "desc" }, { createdAt: "desc" }],
      }),
      prisma.orderItem.findMany({
        where: {
          order: {
            createdAt: { gte: thirtyDaysAgo },
          },
        },
        include: {
          dish: true,
        },
      }),
      prisma.foodRequest.findMany({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          status: { in: ["pending", "approved"] },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    const dishOrderCount = new Map<string, number>();
    const categoryOrderCount = new Map<string, number>();

    for (const item of recentOrderItems) {
      dishOrderCount.set(item.dishId, (dishOrderCount.get(item.dishId) || 0) + item.quantity);
      categoryOrderCount.set(item.dish.categoryId, (categoryOrderCount.get(item.dish.categoryId) || 0) + item.quantity);
    }

    const requestKeywords = recentFoodRequests.map((item) => normalizeText(item.name));
    const latestRequestedName = recentFoodRequests[0]?.name;

    const recommendations = dishes
      .map((dish) => {
        const orderScore = (dishOrderCount.get(dish.id) || 0) * 5;
        const categoryScore = (categoryOrderCount.get(dish.categoryId) || 0) * 2;
        const popularityScore = dish.popularity || 0;
        const freshnessScore = dish.createdAt.getTime() >= thirtyDaysAgo.getTime() ? 3 : 0;
        const requestMatched = requestKeywords.some((keyword) => keyword && normalizeText(dish.name).includes(keyword));
        const requestScore = requestMatched ? 12 : 0;

        let reason = "根据最近点单记录推荐";
        if (requestMatched && latestRequestedName) {
          reason = `和“${latestRequestedName}”口味接近`;
        } else if ((dishOrderCount.get(dish.id) || 0) > 0) {
          reason = "你们最近经常点这道菜";
        } else if ((categoryOrderCount.get(dish.categoryId) || 0) > 0) {
          reason = `最近偏爱${dish.category.name}`;
        } else if ((dish.popularity || 0) > 0) {
          reason = "这道菜近期人气很高";
        } else if (freshnessScore > 0) {
          reason = "新上架，值得试试看";
        }

        return {
          id: dish.id,
          name: dish.name,
          image: dish.image,
          kissPrice: dish.kissPrice,
          hugPrice: dish.hugPrice,
          categoryId: dish.categoryId,
          description: dish.description,
          popularity: dish.popularity,
          allowCook: dish.allowCook,
          allowRestaurant: dish.allowRestaurant,
          createdAt: dish.createdAt.toISOString(),
          reason,
          score: requestScore + orderScore + categoryScore + popularityScore + freshnessScore,
        };
      })
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "zh-CN"));

    return NextResponse.json({
      data: recommendations,
    });
  } catch (error) {
    console.error("[api/recommendations][GET] 获取推荐失败", error);
    await logApiError({ scope: '/api/recommendations[GET]', path: '/api/recommendations', method: 'GET' }, error);
    return NextResponse.json({ message: "获取推荐失败" }, { status: 500 });
  }
}
