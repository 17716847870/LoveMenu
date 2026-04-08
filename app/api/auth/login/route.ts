import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { logApiError } from '@/lib/error-log';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'lovemenu-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('[api/auth/login] 登录失败', error);
    await logApiError({ req, scope: '/api/auth/login[POST]' }, error);
    return NextResponse.json(
      { message: '登录失败' },
      { status: 500 }
    );
  }
}
