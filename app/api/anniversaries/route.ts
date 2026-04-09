import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calcNextRemindAt, CalendarType, RepeatType } from "@/lib/anniversary";
import { logApiError } from "@/lib/error-log";

export async function GET() {
  try {
    const list = await prisma.anniversary.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: list });
  } catch (error) {
    console.error("[api/anniversaries][GET]", error);
    await logApiError(
      {
        scope: "/api/anniversaries[GET]",
        path: "/api/anniversaries",
        method: "GET",
      },
      error
    );
    return NextResponse.json({ message: "获取失败" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      calendarType,
      month,
      day,
      weekday,
      repeatType,
      advanceDays = 0,
      emailTo,
      emailSubject,
      emailContent,
    } = body;

    if (
      !title ||
      !calendarType ||
      !month ||
      !day ||
      !repeatType ||
      !emailTo ||
      !emailSubject ||
      !emailContent
    ) {
      return NextResponse.json({ message: "缺少必填字段" }, { status: 400 });
    }

    const nextRemindAt = calcNextRemindAt({
      calendarType: calendarType as CalendarType,
      month: Number(month),
      day: Number(day),
      weekday: weekday != null ? Number(weekday) : null,
      repeatType: repeatType as RepeatType,
      advanceDays: Number(advanceDays),
    });

    const record = await prisma.anniversary.create({
      data: {
        title,
        calendarType,
        month: Number(month),
        day: Number(day),
        weekday: weekday != null ? Number(weekday) : null,
        repeatType,
        advanceDays: Number(advanceDays),
        emailTo,
        emailSubject,
        emailContent,
        nextRemindAt,
      },
    });

    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    console.error("[api/anniversaries][POST]", error);
    await logApiError({ req, scope: "/api/anniversaries[POST]" }, error);
    return NextResponse.json({ message: "创建失败" }, { status: 500 });
  }
}
