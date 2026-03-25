import { NextResponse } from "next/server";
import { startChatWsServerIfNeeded } from "@/lib/chatRealtime";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    startChatWsServerIfNeeded();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/chat/stream][GET] 启动 WebSocket 服务失败", error);
    return NextResponse.json({ message: "启动实时服务失败" }, { status: 500 });
  }
}
