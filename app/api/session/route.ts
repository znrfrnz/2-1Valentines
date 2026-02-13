import { NextResponse } from "next/server";
import { getOrCreateVisitorSession, checkRateLimit } from "@/lib/session";

// cookies :D
export const dynamic = "force-dynamic";
// session management
export async function GET() {
  try {
    const session = await getOrCreateVisitorSession();

    const rateLimitInfo = checkRateLimit(session.visitorId);

    return NextResponse.json({
      visitorId: session.visitorId,
      nickname: session.nickname,
      isNew: session.isNew,
      rateLimit: {
        remaining: rateLimitInfo.remaining,
      },
    });
  } catch (err) {
    console.error("[Session] Error getting/creating session:", err);
    return NextResponse.json(
      { error: "Failed to initialize session" },
      { status: 500 },
    );
  }
}
