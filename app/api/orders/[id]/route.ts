import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    return NextResponse.json({ message: '更新订单失败' }, { status: 500 });
  }
}
