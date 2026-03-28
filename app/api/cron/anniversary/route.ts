import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { calcNextRemindAt, renderEmailContent, CalendarType, RepeatType } from '@/lib/anniversary';

// Vercel Cron 鉴权：只允许 Vercel 内部调用，本地开发环境跳过
function isAuthorized(req: Request): boolean {
  if (process.env.NODE_ENV === 'development') return true;
  const secret = req.headers.get('authorization');
  return secret === `Bearer ${process.env.CRON_SECRET}`;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 查找所有 active 状态、nextRemindAt <= 现在 的纪念日
    const now = new Date();
    const due = await prisma.anniversary.findMany({
      where: {
        status: 'active',
        nextRemindAt: { lte: now },
      },
    });

    const results = await Promise.allSettled(
      due.map(async (ann) => {
        // 渲染邮件内容
        const dateStr = ann.nextRemindAt
          ? ann.nextRemindAt.toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })
          : '';
        const subject = renderEmailContent(ann.emailSubject, {
          title: ann.title, date: dateStr,
        });
        const html = `<div style="font-family:sans-serif;line-height:1.8">${
          renderEmailContent(ann.emailContent, { title: ann.title, date: dateStr })
            .replace(/\n/g, '<br/>')
        }</div>`;

        const result = await sendEmail({ to: ann.emailTo, subject, html });

        // 写入发送历史
        await prisma.anniversaryLog.create({
          data: {
            anniversaryId: ann.id,
            emailTo: ann.emailTo,
            status: result.success ? 'success' : 'failed',
            error: result.error ?? null,
          },
        });

        // 更新下次提醒时间
        if (ann.repeatType === 'once') {
          // 单次：变为 done
          await prisma.anniversary.update({
            where: { id: ann.id },
            data: { status: 'done', nextRemindAt: null },
          });
        } else {
          // 循环：重新计算下次提醒时间（从明天开始算，避免重复触发）
          const tomorrow = new Date(now.getTime() + 86400000);
          const nextRemindAt = calcNextRemindAt({
            calendarType: ann.calendarType as CalendarType,
            month: ann.month,
            day: ann.day,
            weekday: ann.weekday,
            repeatType: ann.repeatType as RepeatType,
            advanceDays: ann.advanceDays,
          }, tomorrow);
          await prisma.anniversary.update({
            where: { id: ann.id },
            data: { nextRemindAt },
          });
        }

        return { id: ann.id, success: result.success };
      })
    );

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    return NextResponse.json({ processed: due.length, succeeded });
  } catch (error) {
    console.error('[cron/anniversary]', error);
    return NextResponse.json({ message: '执行失败' }, { status: 500 });
  }
}
