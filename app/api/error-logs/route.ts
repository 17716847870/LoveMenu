import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createErrorLog, logApiError } from '@/lib/error-log';

function buildWhere(source: string | null, keyword: string | null) {
  const where: Record<string, unknown> = {};

  if (source) {
    where.source = source;
  }

  if (keyword) {
    where.OR = [
      { message: { contains: keyword, mode: 'insensitive' } },
      { scope: { contains: keyword, mode: 'insensitive' } },
      { path: { contains: keyword, mode: 'insensitive' } },
      { method: { contains: keyword, mode: 'insensitive' } },
      { url: { contains: keyword, mode: 'insensitive' } },
    ];
  }

  return where;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const source = searchParams.get('source');
    const keyword = searchParams.get('keyword')?.trim() || null;
    const limitParam = Number(searchParams.get('limit') || '100');
    const take = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 100;

    const logs = await (prisma as any).errorLog.findMany({
      where: buildWhere(source, keyword),
      orderBy: { createdAt: 'desc' },
      take,
    });

    return NextResponse.json({ data: logs });
  } catch (error) {
    console.error('[api/error-logs][GET] 获取失败', error);
    await logApiError({ req, scope: '/api/error-logs[GET]' }, error);
    return NextResponse.json({ message: '获取错误日志失败' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const source = body?.source;
    const message = body?.message;

    if (!source || !message) {
      return NextResponse.json({ message: '缺少必要字段' }, { status: 400 });
    }

    await createErrorLog({
      source,
      level: body?.level,
      scope: body?.scope,
      path: body?.path,
      method: body?.method,
      message,
      stack: body?.stack,
      url: body?.url,
      userAgent: req.headers.get('user-agent') ?? body?.userAgent,
      metadata: body?.metadata ?? null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/error-logs][POST] 写入失败', error);
    await logApiError({ req, scope: '/api/error-logs[POST]' }, error);
    return NextResponse.json({ message: '写入错误日志失败' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const source = searchParams.get('source');
    const keyword = searchParams.get('keyword')?.trim() || null;

    if (id) {
      await (prisma as any).errorLog.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    const result = await (prisma as any).errorLog.deleteMany({
      where: buildWhere(source, keyword),
    });

    return NextResponse.json({ success: true, data: { count: result.count } });
  } catch (error) {
    console.error('[api/error-logs][DELETE] 删除失败', error);
    await logApiError({ req, scope: '/api/error-logs[DELETE]' }, error);
    return NextResponse.json({ message: '删除错误日志失败' }, { status: 500 });
  }
}
