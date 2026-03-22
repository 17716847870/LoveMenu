import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        avatar: true,
        email: true,
        createdAt: true,
        kissBalance: true,
        hugBalance: true,
      },
    });
    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json({ message: '获取失败' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      return NextResponse.json({ message: '账号已存在' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role || 'user',
        name: data.name || data.username,
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        avatar: true,
      }
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    return NextResponse.json({ message: '添加失败' }, { status: 500 });
  }
}
