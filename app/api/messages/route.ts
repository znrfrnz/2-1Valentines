import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import {
  getOrCreateVisitorSession,
  getVisitorSession,
  setVisitorNickname,
  checkRateLimit,
  recordPost,
} from "@/lib/session";

export async function GET() {
  try {
    const supabase = createSupabaseServer();

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 },
      );
    }

    // session per user
    let visitorId: string | null = null;
    try {
      const session = await getVisitorSession();
      visitorId = session?.visitorId ?? null;
    } catch {}

    return NextResponse.json({
      messages: data ?? [],
      visitorId,
    });
  } catch (err) {
    console.error("Unexpected error in GET /api/messages:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // create session
    const session = await getOrCreateVisitorSession();

    // rate limit check
    const rateLimitResult = checkRateLimit(session.visitorId);
    if (!rateLimitResult.allowed) {
      const retryAfterSec = Math.ceil(
        (rateLimitResult.retryAfterMs ?? 60000) / 1000,
      );
      return NextResponse.json(
        {
          error:
            "You're posting too fast, please wait a bit before sending another note.",
          retryAfterMs: rateLimitResult.retryAfterMs,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSec),
          },
        },
      );
    }

    const body = await request.json();

    const {
      message,
      from_name,
      to_name,
      color,
      spotify_track_id,
      spotify_track_name,
      spotify_artist_name,
      spotify_album_art,
    } = body;

    // validate fields
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (
      !from_name ||
      typeof from_name !== "string" ||
      from_name.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "from_name is required" },
        { status: 400 },
      );
    }

    const validColors = ["pink", "yellow", "lavender", "blue", "green", "red"];
    if (!color || !validColors.includes(color)) {
      return NextResponse.json(
        { error: "color must be one of: pink, yellow, lavender, blue, green, red" },
        { status: 400 },
      );
    }

    if (message.trim().length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or fewer" },
        { status: 400 },
      );
    }

    if (from_name.trim().length > 50) {
      return NextResponse.json(
        { error: "Name must be 50 characters or fewer" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServer();

    const insertData: Record<string, unknown> = {
      message: message.trim(),
      from_name: from_name.trim(),
      to_name: to_name?.trim() || null,
      color,
      spotify_track_id: spotify_track_id || null,
      spotify_track_name: spotify_track_name || null,
      spotify_artist_name: spotify_artist_name || null,
      spotify_album_art: spotify_album_art || null,
      visitor_id: session.visitorId,
    };

    const { data, error } = await supabase
      .from("messages")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase POST error:", error);
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 },
      );
    }

    recordPost(session.visitorId);

    // save nickname niggha
    try {
      await setVisitorNickname(from_name.trim());
    } catch {}

    return NextResponse.json(
      {
        message: data,
        rateLimit: {
          remaining: Math.max(0, checkRateLimit(session.visitorId).remaining),
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Unexpected error in POST /api/messages:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // verif session
    const session = await getVisitorSession();

    if (!session) {
      return NextResponse.json(
        { error: "No valid session. Cannot delete messages." },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("id");

    if (!messageId) {
      return NextResponse.json(
        { error: "Missing required query parameter: id" },
        { status: 400 },
      );
    }

    // uuid check
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        messageId,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid message ID format" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServer();

    const { data: existingMessage, error: fetchError } = await supabase
      .from("messages")
      .select("id, visitor_id")
      .eq("id", messageId)
      .single();

    if (fetchError || !existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (existingMessage.visitor_id !== session.visitorId) {
      return NextResponse.json(
        { error: "You can only delete your own messages" },
        { status: 403 },
      );
    }

    // delete msg
    const { error: deleteError } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId)
      .eq("visitor_id", session.visitorId);

    if (deleteError) {
      console.error("Supabase DELETE error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete message" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, deletedId: messageId });
  } catch (err) {
    console.error("Unexpected error in DELETE /api/messages:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
