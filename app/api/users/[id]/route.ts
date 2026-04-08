import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { logApiError } from '@/lib/error-log';

const SALT_ROUNDS = 10;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        avatar: true,
        kissBalance: true,
        hugBalance: true,
      }
    });

    if (!user) {
      return NextResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('[api/users/:id][GET] 获取失败', error);
    await logApiError({ req, scope: '/api/users/[id][GET]' }, error);
    return NextResponse.json({ message: '获取失败' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const data = await req.json();
    
    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        avatar: true,
        kissBalance: true,
        hugBalance: true,
      }
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('[api/users/:id][PUT] 更新失败', error);
    await logApiError({ req, scope: '/api/users/[id][PUT]' }, error);
    return NextResponse.json({ message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/users/:id][DELETE] 删除失败', error);
    await logApiError({ req, scope: '/api/users/[id][DELETE]' }, error);
    return NextResponse.json({ message: '删除失败' }, { status: 500 });
  }
}
