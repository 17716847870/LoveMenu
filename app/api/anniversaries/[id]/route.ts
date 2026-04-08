import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calcNextRemindAt, CalendarType, RepeatType } from '@/lib/anniversary';
import { logApiError } from '@/lib/error-log';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const record = await prisma.anniversary.findUnique({
      where: { id },
      include: { logs: { orderBy: { sentAt: 'desc' }, take: 20 } },
    });
    if (!record) return NextResponse.json({ message: '不存在' }, { status: 404 });
    return NextResponse.json({ data: record });
  } catch (error) {
    console.error('[api/anniversaries][GET/:id]', error);
    await logApiError({ scope: '/api/anniversaries/[id][GET]', path: '/api/anniversaries/[id]', method: 'GET' }, error);
    return NextResponse.json({ message: '获取失败' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title, calendarType, month, day, weekday,
      repeatType, advanceDays,
      emailTo, emailSubject, emailContent, status,
    } = body;

    // 修改时立即重新计算下一次提醒时间
    const nextRemindAt = calcNextRemindAt({
      calendarType: (calendarType as CalendarType),
      month: Number(month),
      day: Number(day),
      weekday: weekday != null ? Number(weekday) : null,
      repeatType: repeatType as RepeatType,
      advanceDays: Number(advanceDays ?? 0),
    });

    const record = await prisma.anniversary.update({
      where: { id },
      data: {
        title, calendarType,
        month: Number(month), day: Number(day),
        weekday: weekday != null ? Number(weekday) : null,
        repeatType, advanceDays: Number(advanceDays ?? 0),
        emailTo, emailSubject, emailContent,
        status: status ?? 'active',
        nextRemindAt,
      },
    });
    return NextResponse.json({ data: record });
  } catch (error) {
    console.error('[api/anniversaries][PUT/:id]', error);
    await logApiError({ req, scope: '/api/anniversaries/[id][PUT]' }, error);
    return NextResponse.json({ message: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.anniversary.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/anniversaries][DELETE/:id]', error);
    await logApiError({ scope: '/api/anniversaries/[id][DELETE]', path: '/api/anniversaries/[id]', method: 'DELETE' }, error);
    return NextResponse.json({ message: '删除失败' }, { status: 500 });
  }
}
