import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const GET = async () => {
  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, name: true, role: true } } },
    });
    
    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      senderId: msg.senderId,
      type: msg.type,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
      isSender: msg.sender.role === 'user', // 根据需求调整
    }));

    return NextResponse.json({ data: formattedMessages });
  } catch (error) {
    return NextResponse.json({ message: '获取消息失败' }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { senderId, type, content } = body;

    const message = await prisma.chatMessage.create({
      data: {
        senderId,
        type,
        content,
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return NextResponse.json({ message: '发送消息失败' }, { status: 500 });
  }
};
