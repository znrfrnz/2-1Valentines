import { createSupabaseServer } from "@/lib/supabase-server";
import { Message, messageToPostIt, PostItData } from "@/lib/types";
import { ValentineApp } from "@/components/ValentineApp";
import { getVisitorSession } from "@/lib/session";

// Ensure fresh data is fetched on every request (no static caching)
export const dynamic = "force-dynamic";

async function getSessionInfo(): Promise<{
  visitorId: string | null;
  nickname: string | null;
}> {
  try {
    const session = await getVisitorSession();
    return {
      visitorId: session?.visitorId ?? null,
      nickname: session?.nickname ?? null,
    };
  } catch {
    return { visitorId: null, nickname: null };
  }
}

async function getMessages(visitorId: string | null): Promise<PostItData[]> {
  try {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch messages from Supabase:", error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return (data as Message[]).map((msg) => messageToPostIt(msg, visitorId));
  } catch (err) {
    console.error("Supabase not configured, no messages to show:", err);
    return [];
  }
}

export default async function Home() {
  const { visitorId, nickname } = await getSessionInfo();
  const initialMessages = await getMessages(visitorId);

  return (
    <ValentineApp
      initialMessages={initialMessages}
      visitorId={visitorId}
      savedNickname={nickname}
    />
  );
}
