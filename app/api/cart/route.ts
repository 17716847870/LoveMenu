import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "用户ID不能为空" }, { status: 400 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        dish: true,
      },
      orderBy: { id: "asc" },
    });

    const formattedItems = cartItems.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      dish: item.dish,
    }));

    return NextResponse.json({ data: formattedItems });
  } catch (error) {
    return NextResponse.json({ message: "获取购物车失败" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { userId, dishId, quantity = 1 } = body;

    if (!userId || !dishId) {
      return NextResponse.json({ message: "用户ID和菜品ID不能为空" }, { status: 400 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId, dishId },
    });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { dish: true },
      });
      return NextResponse.json({ success: true, data: updatedItem });
    }

    const newItem = await prisma.cartItem.create({
      data: { userId, dishId, quantity },
      include: { dish: true },
    });

    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    return NextResponse.json({ message: "添加到购物车失败" }, { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");
    const userId = searchParams.get("userId");

    if (itemId) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else if (userId) {
      await prisma.cartItem.deleteMany({ where: { userId } });
    } else {
      return NextResponse.json({ message: "缺少参数" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "删除购物车项失败" }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  try {
    const body = await req.json();
    const { itemId, quantity } = body;

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ message: "缺少参数" }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return NextResponse.json({ success: true, data: null });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { dish: true },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    return NextResponse.json({ message: "更新购物车失败" }, { status: 500 });
  }
};
