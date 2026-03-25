import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { sendToUser } from "@/lib/chatRealtime";

type TokenPayload = {
  id: string;
};

type ChatMessageWithReads = {
  id: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: Date;
  reads: { id: string }[];
};

type ChatMessageLite = {
  id: string;
};

type ChatDb = {
  chatMessage: {
    count: (args: unknown) => Promise<number>;
    findMany: (args: unknown) => Promise<ChatMessageWithReads[] | ChatMessageLite[]>;
    create: (args: unknown) => Promise<{
      id: string;
      senderId: string;
      type: string;
      content: string;
      createdAt: Date;
    }>;
  };
  chatMessageRead: {
    createMany: (args: unknown) => Promise<unknown>;
  };
};

function getChatDb() {
  return prisma as unknown as ChatDb;
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
  const db = getChatDb();
  return db.chatMessage.count({
    where: {
      senderId: { not: userId },
      reads: {
        none: {
          userId,
        },
      },
    },
  });
}

export const GET = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const db = getChatDb();
    const messages = (await db.chatMessage.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        reads: {
          where: { userId: currentUser.id },
          select: { id: true },
        },
      },
    })) as ChatMessageWithReads[];

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId,
      type: msg.type,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
      isRead: msg.senderId === currentUser.id || msg.reads.length > 0,
      isSender: msg.senderId === currentUser.id,
    }));

    return NextResponse.json({ data: formattedMessages });
  } catch (error) {
    console.error("[api/chat][GET] 获取消息失败", error);
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

    if (!["text", "image", "voice", "emoji"].includes(type)) {
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

    await Promise.all(
      users.map(async (user) => {
        const isSender = user.id === currentUser.id;
        const unreadCount = await getUnreadCount(user.id);

        sendToUser(user.id, "message", {
          id: message.id,
          senderId: message.senderId,
          type: message.type,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          isRead: isSender,
          isSender,
        });

        sendToUser(user.id, "unread", { count: unreadCount });
      })
    );

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
    return NextResponse.json({ message: "发送消息失败" }, { status: 500 });
  }
};

export const PATCH = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "未登录" }, { status: 401 });
    }

    const db = getChatDb();
    const unreadMessages = (await db.chatMessage.findMany({
      where: {
        senderId: { not: currentUser.id },
        reads: {
          none: {
            userId: currentUser.id,
          },
        },
      },
      select: { id: true },
    })) as ChatMessageLite[];

    if (unreadMessages.length > 0) {
      await db.chatMessageRead.createMany({
        data: unreadMessages.map((item) => ({
          id: crypto.randomUUID(),
          messageId: item.id,
          userId: currentUser.id,
        })),
        skipDuplicates: true,
      });
    }

    sendToUser(currentUser.id, "unread", { count: 0 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/chat][PATCH] 已读更新失败", error);
    return NextResponse.json({ message: "已读更新失败" }, { status: 500 });
  }
};
