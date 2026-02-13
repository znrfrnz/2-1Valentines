import { NextRequest, NextResponse } from "next/server";
import { searchTracks } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") ?? "5", 10);

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing required query parameter: q" },
      { status: 400 }
    );
  }

  try {
    const results = await searchTracks(query.trim(), Math.min(limit, 20));
    return NextResponse.json({ tracks: results });
  } catch (err) {
    console.error("[Spotify Search Error]", err);
    return NextResponse.json(
      { error: "Failed to search Spotify. Check server logs for details." },
      { status: 500 }
    );
  }
}
