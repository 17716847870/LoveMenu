import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logApiError } from '@/lib/error-log';

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

    const rows = await prisma.$queryRaw<Array<{ count: bigint | number }>>`
      SELECT COUNT(*)::bigint AS count
      FROM "ChatMessage" m
      WHERE m."senderId" <> ${currentUser.id}
        AND NOT EXISTS (
          SELECT 1
          FROM "ChatMessageRead" r
          WHERE r."messageId" = m."id"
            AND r."userId" = ${currentUser.id}
        )
    `;

    const count = Number(rows[0]?.count ?? 0);

    return NextResponse.json({ data: { count } });
  } catch (error) {
    console.error("[api/chat/unread][GET] 获取未读数失败", error);
    await logApiError({ scope: '/api/chat/unread[GET]', path: '/api/chat/unread', method: 'GET' }, error);
    return NextResponse.json({ message: "获取未读数失败" }, { status: 500 });
  }
};
