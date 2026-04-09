import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { logApiError } from "@/lib/error-log";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("lovemenu-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    const userId = typeof payload?.id === "string" ? payload.id : null;

    if (!userId) {
      return NextResponse.json({ message: "登录状态无效" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        avatar: true,
        kissBalance: true,
        hugBalance: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "用户不存在" }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("[api/auth/me][GET] 获取当前用户失败", error);
    await logApiError({ req, scope: "/api/auth/me[GET]" }, error);
    return NextResponse.json({ message: "获取当前用户失败" }, { status: 500 });
  }
}
