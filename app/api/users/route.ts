import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/users-db';
import { User } from '@/types';

export async function GET() {
  const users = getUsers();
  // 不返回密码
  const safeUsers = users.map(({ password, ...user }) => user);
  return NextResponse.json({ data: safeUsers });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const users = getUsers();
    
    if (users.find(u => u.username === data.username)) {
      return NextResponse.json({ message: '账号已存在' }, { status: 400 });
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: data.username,
      password: data.password,
      role: data.role || 'user',
      name: data.name || data.username,
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
    };

    users.push(newUser);
    saveUsers(users);

    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    return NextResponse.json({ message: '添加失败' }, { status: 500 });
  }
}
