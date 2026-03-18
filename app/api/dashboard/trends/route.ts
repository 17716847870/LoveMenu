import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { name: '周一', interactions: 8, points: 50, priority: 1 },
    { name: '周二', interactions: 10, points: 65, priority: 0 },
    { name: '周三', interactions: 7, points: 45, priority: 2 },
    { name: '周四', interactions: 12, points: 85, priority: 1 },
    { name: '周五', interactions: 15, points: 110, priority: 0 },
    { name: '周六', interactions: 22, points: 160, priority: 3 },
    { name: '周日', interactions: 18, points: 130, priority: 1 },
  ]);
}
