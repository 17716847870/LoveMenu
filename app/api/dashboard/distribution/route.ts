import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    categoryDistribution: [
      { name: '主食', value: 40 },
      { name: '小吃', value: 25 },
      { name: '饮品', value: 20 },
      { name: '甜点', value: 15 },
    ],
    sourceDistribution: [
      { name: '普通点餐', value: 60 },
      { name: '紧急想吃', value: 25 },
      { name: '想吃清单', value: 15 },
    ],
  });
}
