import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        items: {
          include: {
            dish: true,
          }
        },
        feedback: true,
      }
    });

    // 格式化以适配前端类型
    const formattedOrders = orders.map((order: any) => {
      let memoryImage = undefined;
      if (order.feedback?.image) {
        try {
          memoryImage = JSON.parse(order.feedback.image);
        } catch {
          memoryImage = order.feedback.image;
        }
      }
      
      return {
        ...order,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          note: item.note,
          dish: item.dish || { id: '', name: '已删除菜品', category: { name: '' } },
        })),
        memory: order.feedback ? {
          text: order.feedback.text,
          image: memoryImage,
        } : undefined,
      };
    });

    return NextResponse.json({ data: formattedOrders });
  } catch (error) {
    console.error('获取订单失败:', error);
    return NextResponse.json({ message: '获取订单失败' }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { userId, items, totalKiss, totalHug, note, reason, isEmergency } = body;

    const order = await prisma.order.create({
      data: {
        userId,
        status: 'pending',
        totalKiss,
        totalHug,
        note,
        reason,
        isEmergency,
        items: {
          create: items.map((item: any) => ({
            dishId: item.dish.id,
            quantity: item.quantity,
            note: item.note,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ message: '创建订单失败' }, { status: 500 });
  }
};
