import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/users-db';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const users = getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
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
      maxAge: 60 * 60 * 24, // 1 day
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
    return NextResponse.json(
      { message: '登录失败' },
      { status: 500 }
    );
  }
}
