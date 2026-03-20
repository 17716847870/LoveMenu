import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/users-db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const data = await req.json();
    const users = getUsers();
    
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
      return NextResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    users[index] = { ...users[index], ...data };
    saveUsers(users);

    return NextResponse.json({ success: true, data: users[index] });
  } catch (error) {
    return NextResponse.json({ message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const users = getUsers();
    
    const newUsers = users.filter(u => u.id !== id);
    saveUsers(newUsers);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: '删除失败' }, { status: 500 });
  }
}
