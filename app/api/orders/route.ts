import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logApiError } from '@/lib/error-log';

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
    await logApiError({ req, scope: '/api/orders[GET]' }, error);
    return NextResponse.json({ message: '获取订单失败' }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { userId, items, totalKiss, totalHug, note, reason, isEmergency } = body;

    // 检查用户是否存在且获取当前余额
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { kissBalance: true, hugBalance: true },
    });

    if (!user) {
      return NextResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    // 检查余额是否足够
    if ((user.kissBalance || 0) < totalKiss || (user.hugBalance || 0) < totalHug) {
      return NextResponse.json(
        { message: '亲亲或抱抱余额不足，无法完成下单' },
        { status: 400 }
      );
    }

    // 创建订单并扣除余额（使用事务确保原子性）
    const result = await prisma.$transaction(async (tx) => {
      // 创建订单
      const order = await tx.order.create({
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

      // 扣除用户余额
      await tx.user.update({
        where: { id: userId },
        data: {
          kissBalance: (user.kissBalance || 0) - totalKiss,
          hugBalance: (user.hugBalance || 0) - totalHug,
        },
      });

      return order;
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('[api/orders][POST] 创建订单失败', error);
    await logApiError({ req, scope: '/api/orders[POST]' }, error);
    return NextResponse.json({ message: '创建订单失败' }, { status: 500 });
  }
};
