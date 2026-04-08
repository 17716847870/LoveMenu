import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logApiError } from '@/lib/error-log';

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['completed'],
  completed: [],
  cancelled: [],
};

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    const nextStatus = body.status;

    if (!nextStatus) {
      return NextResponse.json({ message: '状态不能为空' }, { status: 400 });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        select: {
          id: true,
          userId: true,
          status: true,
          totalKiss: true,
          totalHug: true,
        },
      });

      if (!order) {
        throw new Error('ORDER_NOT_FOUND');
      }

      if (order.status === nextStatus) {
        return tx.order.findUnique({ where: { id } });
      }

      const allowedNextStatuses = ALLOWED_TRANSITIONS[order.status] ?? [];
      if (!allowedNextStatuses.includes(nextStatus)) {
        throw new Error('INVALID_STATUS_TRANSITION');
      }

      if (nextStatus === 'cancelled') {
        await tx.user.update({
          where: { id: order.userId },
          data: {
            kissBalance: { increment: order.totalKiss },
            hugBalance: { increment: order.totalHug },
          },
        });
      }

      return tx.order.update({
        where: { id },
        data: {
          status: nextStatus,
        },
      });
    });

    if (!updatedOrder) {
      return NextResponse.json({ message: '订单不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    if (error instanceof Error && error.message === 'ORDER_NOT_FOUND') {
      return NextResponse.json({ message: '订单不存在' }, { status: 404 });
    }

    if (error instanceof Error && error.message === 'INVALID_STATUS_TRANSITION') {
      return NextResponse.json({ message: '当前订单状态不允许这样修改' }, { status: 400 });
    }

    console.error('[api/orders/:id][PUT] 更新订单失败', error);
    await logApiError({ req, scope: '/api/orders/[id][PUT]' }, error);
    return NextResponse.json({ message: '更新订单失败' }, { status: 500 });
  }
}
