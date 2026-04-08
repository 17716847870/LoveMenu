import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logApiError } from '@/lib/error-log';

export async function GET() {
  try {
    const requests = await prisma.foodRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: requests });
  } catch (error) {
    console.error('[api/requests][GET] 获取请求失败', error);
    await logApiError({ scope: '/api/requests[GET]', path: '/api/requests', method: 'GET' }, error);
    return NextResponse.json({ message: '获取请求失败' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newRequest = await prisma.foodRequest.create({
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
      },
    });
    return NextResponse.json({ success: true, data: newRequest });
  } catch (error) {
    console.error('[api/requests][POST] 创建请求失败', error);
    await logApiError({ req, scope: '/api/requests[POST]' }, error);
    return NextResponse.json({ message: '创建请求失败' }, { status: 500 });
  }
}
