import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const feedbacks = await prisma.feedback.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      data: feedbacks.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[api/feedback][GET] 获取反馈失败", error);
    return NextResponse.json({ message: "获取反馈失败" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, title, content, image } = body as {
      type?: string;
      title?: string;
      content?: string;
      image?: string;
    };

    if (!type || !title?.trim() || !content?.trim()) {
      return NextResponse.json({ message: "反馈信息不完整" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        type,
        title: title.trim(),
        content: content.trim(),
        image,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...feedback,
        createdAt: feedback.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[api/feedback][POST] 创建反馈失败", error);
    return NextResponse.json({ message: "创建反馈失败" }, { status: 500 });
  }
}
