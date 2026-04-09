import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const CHAT_REALTIME_CHANNEL = "chat-room";

let adminClient: SupabaseClient | null = null;
let hasLoggedMissingEnv = false;

function getSupabaseAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    if (!hasLoggedMissingEnv) {
      console.warn(
        "[chat] Supabase Realtime broadcast is disabled because NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing."
      );
      hasLoggedMissingEnv = true;
    }
    return null;
  }

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return adminClient;
}

async function waitForSubscription(
  channel: ReturnType<SupabaseClient["channel"]>
) {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Supabase Realtime subscribe timeout")),
      5000
    );

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timer);
        resolve();
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        clearTimeout(timer);
        reject(new Error(`Supabase Realtime subscribe failed: ${status}`));
      }
    });
  });
}

export async function broadcastChatMessage(payload: Record<string, unknown>) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  const channel = supabase.channel(CHAT_REALTIME_CHANNEL);

  try {
    await waitForSubscription(channel);
    await channel.send({
      type: "broadcast",
      event: "message",
      payload,
    });
  } finally {
    await supabase.removeChannel(channel);
  }
}
