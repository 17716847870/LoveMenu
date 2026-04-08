import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logApiError } from '@/lib/error-log';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "用户ID不能为空" }, { status: 400 });
    }

    const favorites = await prisma.dishFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        dishId: true,
        userId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      data: favorites.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[api/favorites][GET] 获取收藏失败", error);
    await logApiError({ req, scope: '/api/favorites[GET]' }, error);
    return NextResponse.json({ message: "获取收藏失败" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, dishId } = body as { userId?: string; dishId?: string };

    if (!userId || !dishId) {
      return NextResponse.json({ message: "收藏信息不完整" }, { status: 400 });
    }

    const favorite = await prisma.dishFavorite.upsert({
      where: {
        userId_dishId: {
          userId,
          dishId,
        },
      },
      update: {},
      create: {
        userId,
        dishId,
      },
      select: {
        id: true,
        dishId: true,
        userId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...favorite,
        createdAt: favorite.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[api/favorites][POST] 创建收藏失败", error);
    await logApiError({ req, scope: '/api/favorites[POST]' }, error);
    return NextResponse.json({ message: "创建收藏失败" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const dishId = searchParams.get("dishId");

    if (!userId || !dishId) {
      return NextResponse.json({ message: "收藏信息不完整" }, { status: 400 });
    }

    await prisma.dishFavorite.deleteMany({
      where: {
        userId,
        dishId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/favorites][DELETE] 删除收藏失败", error);
    await logApiError({ req, scope: '/api/favorites[DELETE]' }, error);
    return NextResponse.json({ message: "删除收藏失败" }, { status: 500 });
  }
}
