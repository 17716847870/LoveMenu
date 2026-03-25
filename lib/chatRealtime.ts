type ChatEventPayload = Record<string, unknown>;

type Client = {
  userId: string;
  send: (event: string, payload: ChatEventPayload) => void;
  close: () => void;
};

const globalForChatRealtime = globalThis as unknown as {
  chatRealtimeClients?: Map<string, Set<Client>>;
};

const clients = globalForChatRealtime.chatRealtimeClients ?? new Map<string, Set<Client>>();
if (!globalForChatRealtime.chatRealtimeClients) {
  globalForChatRealtime.chatRealtimeClients = clients;
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
