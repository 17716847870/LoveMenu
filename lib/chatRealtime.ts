import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { verifyToken } from "@/lib/auth";

type ChatEventPayload = Record<string, unknown>;

type Client = {
  userId: string;
  send: (event: string, payload: ChatEventPayload) => void;
  close: () => void;
};

const globalForChatRealtime = globalThis as unknown as {
  chatRealtimeClients?: Map<string, Set<Client>>;
  chatWsServerStarted?: boolean;
};

const clients = globalForChatRealtime.chatRealtimeClients ?? new Map<string, Set<Client>>();
if (!globalForChatRealtime.chatRealtimeClients) {
  globalForChatRealtime.chatRealtimeClients = clients;
}

function parseCookieValue(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return null;

  const target = `${name}=`;
  const parts = cookieHeader.split(";");

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(target)) {
      return decodeURIComponent(trimmed.slice(target.length));
    }
  }

  return null;
}

export function startChatWsServerIfNeeded() {
  if (globalForChatRealtime.chatWsServerStarted) return;

  const port = Number(process.env.CHAT_WS_PORT || process.env.NEXT_PUBLIC_CHAT_WS_PORT || 3001);
  const server = createServer();
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (req, socket, head) => {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      if (url.pathname !== "/chat") {
        socket.destroy();
        return;
      }

      const token = parseCookieValue(req.headers.cookie, "lovemenu-token");
      if (!token) {
        socket.destroy();
        return;
      }

      const payload = await verifyToken(token);
      if (!payload || typeof payload.id !== "string") {
        socket.destroy();
        return;
      }

      const userId = payload.id;

      wss.handleUpgrade(req, socket, head, (ws) => {
        const client: Client = {
          userId,
          send: (event, payloadData) => {
            if (ws.readyState !== WebSocket.OPEN) return;
            ws.send(JSON.stringify({ event, payload: payloadData }));
          },
          close: () => {
            ws.close();
          },
        };

        addChatClient(client);

        ws.send(JSON.stringify({ event: "connected", payload: { ok: true } }));

        ws.on("close", () => {
          removeChatClient(client);
        });
      });
    } catch {
      socket.destroy();
    }
  });

  server.listen(port, () => {
    console.log(`[chat-ws] listening on ws://localhost:${port}/chat`);
  });

  globalForChatRealtime.chatWsServerStarted = true;
}

export function addChatClient(client: Client) {
  const userClients = clients.get(client.userId) ?? new Set<Client>();
  userClients.add(client);
  clients.set(client.userId, userClients);
}

export function removeChatClient(client: Client) {
  const userClients = clients.get(client.userId);
  if (!userClients) return;

  userClients.delete(client);
  if (userClients.size === 0) {
    clients.delete(client.userId);
  }
}

export function sendToUser(userId: string, event: string, payload: ChatEventPayload) {
  const userClients = clients.get(userId);
  if (!userClients) return;

  for (const client of userClients) {
    client.send(event, payload);
  }
}

export function sendToAll(event: string, payload: ChatEventPayload) {
  for (const userClients of clients.values()) {
    for (const client of userClients) {
      client.send(event, payload);
    }
  }
}
