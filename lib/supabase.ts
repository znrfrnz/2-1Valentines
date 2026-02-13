import { createBrowserClient } from "@supabase/ssr";
import { NoteColor } from "./types";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export type Message = {
  id: string;
  message: string;
  from_name: string;
  to_name: string | null;
  spotify_track_id: string | null;
  spotify_track_name: string | null;
  spotify_artist_name: string | null;
  spotify_album_image: string | null;
  color: NoteColor;
  visitor_id: string | null;
  created_at: string;
};
