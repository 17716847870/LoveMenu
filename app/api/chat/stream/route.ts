import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { addChatClient, removeChatClient } from "@/lib/chatRealtime";

export const dynamic = "force-dynamic";

type TokenPayload = {
  id: string;
};

function formatSSE(event: string, payload: Record<string, unknown>) {
  return `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
}

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("lovemenu-token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || typeof payload.id !== "string") return null;

  return payload as unknown as TokenPayload;
}

export async function GET(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const encoder = new TextEncoder();

  const client = {
    userId: currentUser.id,
    send: (event: string, payload: Record<string, unknown>) => {
      writer.write(encoder.encode(formatSSE(event, payload)));
    },
    close: () => {
      writer.close();
    },
  };

  addChatClient(client);

  await writer.write(encoder.encode(formatSSE("connected", { ok: true })));

  const keepAlive = setInterval(() => {
    writer.write(encoder.encode(": ping\n\n"));
  }, 20000);

  const abort = () => {
    clearInterval(keepAlive);
    removeChatClient(client);
    writer.close();
  };

  req.signal.addEventListener("abort", abort);

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
