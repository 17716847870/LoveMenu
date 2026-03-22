import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const { kissAmount, hugAmount } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id },
      select: { kissBalance: true, hugBalance: true },
    });

    if (!user) {
      return NextResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    const newKissBalance = (user.kissBalance || 0) + (kissAmount || 0);
    const newHugBalance = (user.hugBalance || 0) + (hugAmount || 0);

    if (newKissBalance < 0 || newHugBalance < 0) {
      return NextResponse.json({ message: '余额不能为负数' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        kissBalance: newKissBalance,
        hugBalance: newHugBalance,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        avatar: true,
        kissBalance: true,
        hugBalance: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    return NextResponse.json({ message: '更新余额失败' }, { status: 500 });
  }
}
