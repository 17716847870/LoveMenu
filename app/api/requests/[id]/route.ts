import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logApiError } from "@/lib/error-log";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await req.json();

    const updatedRequest = await prisma.foodRequest.update({
      where: { id },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error("[api/requests/:id][PUT] 更新请求失败", error);
    await logApiError({ req, scope: "/api/requests/[id][PUT]" }, error);
    return NextResponse.json({ message: "更新请求失败" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    await prisma.foodRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/requests/:id][DELETE] 删除请求失败", error);
    await logApiError({ req, scope: "/api/requests/[id][DELETE]" }, error);
    return NextResponse.json({ message: "删除请求失败" }, { status: 500 });
  }
}
