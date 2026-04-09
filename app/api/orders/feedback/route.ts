import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logApiError } from "@/lib/error-log";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, text, image } = body;

    if (!orderId) {
      return NextResponse.json({ message: "订单ID不能为空" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ message: "订单不存在" }, { status: 404 });
    }

    const feedback = await prisma.orderFeedback.upsert({
      where: { orderId },
      update: {
        text: text || undefined,
        image: image || undefined,
      },
      create: {
        orderId,
        text: text || "",
        image: image,
      },
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("Create feedback error:", error);
    await logApiError({ req, scope: "/api/orders/feedback[POST]" }, error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "创建回忆失败" },
      { status: 500 }
    );
  }
}
