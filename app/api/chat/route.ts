import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { broadcastChatMessage } from "@/lib/supabase-server";
import { logApiError } from '@/lib/error-log';

type TokenPayload = {
  id: string;
};

type ChatMessageRow = {
  id: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: Date;
};

function getChatDb() {
  return prisma as unknown as {
    chatMessage: {
      findMany: (args: unknown) => Promise<ChatMessageRow[]>;
      create: (args: unknown) => Promise<ChatMessageRow>;
    };
  };
}

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lovemenu-token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || typeof payload.id !== "string") return null;

  return payload as unknown as TokenPayload;
}

async function getUnreadCount(userId: string) {
  const rows = await prisma.$queryRaw<Array<{ count: bigint | number }>>`
    SELECT COUNT(*)::bigint AS count
    FROM "ChatMessage" m
    WHERE m."senderId" <> ${userId}
      AND NOT EXISTS (
        SELECT 1
        FROM "ChatMessageRead" r
        WHERE r."messageId" = m."id"
          AND r."userId" = ${userId}
      )
  `;

  const count = rows[0]?.count ?? 0;
  return Number(count);
}

export const GET = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const db = getChatDb();
    const messages = await db.chatMessage.findMany({
      orderBy: { createdAt: "asc" },
    });

    const readRows = await prisma.$queryRaw<Array<{ messageId: string }>>`
      SELECT "messageId"
      FROM "ChatMessageRead"
      WHERE "userId" = ${currentUser.id}
    `;

    const readMessageIds = new Set(readRows.map((row) => row.messageId));

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      type: msg.type,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
      isRead: msg.senderId === currentUser.id || readMessageIds.has(msg.id),
      isSender: msg.senderId === currentUser.id,
    }));

    return NextResponse.json({ data: formattedMessages });
  } catch (error) {
    console.error("[api/chat][GET] 获取消息失败", error);
    await logApiError({ scope: '/api/chat[GET]', path: '/api/chat', method: 'GET' }, error);
    return NextResponse.json({ message: "获取消息失败" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const body = await req.json();
    const { type, content } = body as { type?: string; content?: string };

    if (!type || !content || !content.trim()) {
      return NextResponse.json({ message: "消息内容不能为空" }, { status: 400 });
    }

    if (![
      "text",
      "image",
      "voice",
      "emoji",
    ].includes(type)) {
      return NextResponse.json({ message: "消息类型不支持" }, { status: 400 });
    }

    const db = getChatDb();
    const message = await db.chatMessage.create({
      data: {
        senderId: currentUser.id,
        type,
        content: content.trim(),
      },
    });

    const users = await prisma.user.findMany({ select: { id: true } });

    const unreadByUser = await Promise.all(
      users.map(async (user) => ({
        userId: user.id,
        unreadCount: await getUnreadCount(user.id),
      }))
    );

    await broadcastChatMessage({
      message: {
        id: message.id,
        senderId: message.senderId,
        type: message.type,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
      },
      unreadByUser,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        senderId: message.senderId,
        type: message.type,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
        isRead: true,
        isSender: true,
      },
    });
  } catch (error) {
    console.error("[api/chat][POST] 发送消息失败", error);
    await logApiError({ req, scope: '/api/chat[POST]' }, error);
    return NextResponse.json({ message: "发送消息失败" }, { status: 500 });
  }
};

export const PATCH = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const unreadMessages = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT m."id"
      FROM "ChatMessage" m
      WHERE m."senderId" <> ${currentUser.id}
        AND NOT EXISTS (
          SELECT 1
          FROM "ChatMessageRead" r
          WHERE r."messageId" = m."id"
            AND r."userId" = ${currentUser.id}
        )
    `;

    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map((item) =>
          prisma.$executeRaw`
            INSERT INTO "ChatMessageRead" ("id", "messageId", "userId", "createdAt")
            VALUES (${crypto.randomUUID()}, ${item.id}, ${currentUser.id}, NOW())
            ON CONFLICT ("messageId", "userId") DO NOTHING
          `
        )
      );
    }

    return NextResponse.json({ success: true, data: { count: 0 } });
  } catch (error) {
    console.error("[api/chat][PATCH] 已读更新失败", error);
    await logApiError({ scope: '/api/chat[PATCH]', path: '/api/chat', method: 'PATCH' }, error);
    return NextResponse.json({ message: "已读更新失败" }, { status: 500 });
  }
};
