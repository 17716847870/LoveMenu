import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

type TokenPayload = {
  id: string;
};

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lovemenu-token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || typeof payload.id !== "string") return null;

  return payload as unknown as TokenPayload;
}

export const GET = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const db = prisma as any;
    const count = await db.chatMessage.count({
      where: {
        senderId: { not: currentUser.id },
        reads: {
          none: {
            userId: currentUser.id,
          },
        },
      },
    });

    return NextResponse.json({ data: { count } });
  } catch (error) {
    console.error("[api/chat/unread][GET] 获取未读数失败", error);
    return NextResponse.json({ message: "获取未读数失败" }, { status: 500 });
  }
};
