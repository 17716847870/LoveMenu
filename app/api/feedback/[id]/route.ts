import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await req.json();
    const { type, title, content, image, status } = body as {
      type?: string;
      title?: string;
      content?: string;
      image?: string;
      status?: string;
    };

    const feedback = await prisma.feedback.update({
      where: { id },
      data: {
        ...(type !== undefined ? { type } : {}),
        ...(title !== undefined ? { title: title.trim() } : {}),
        ...(content !== undefined ? { content: content.trim() } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(status !== undefined ? { status } : {}),
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
    console.error("[api/feedback/:id][PATCH] 更新反馈失败", error);
    return NextResponse.json({ message: "更新反馈失败" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    await prisma.feedback.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/feedback/:id][DELETE] 删除反馈失败", error);
    return NextResponse.json({ message: "删除反馈失败" }, { status: 500 });
  }
}
