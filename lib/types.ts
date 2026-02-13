// ─── Database / Supabase Types ───────────────────────────────────────────────

export type NoteColor = "pink" | "yellow" | "lavender" | "blue" | "green" | "red";

export interface Message {
  id: string;
  message: string;
  from_name: string;
  to_name: string | null;
  color: NoteColor;
  spotify_track_id: string | null;
  spotify_track_name: string | null;
  spotify_artist_name: string | null;
  spotify_album_art: string | null;
  visitor_id: string | null;
  created_at: string;
}

export interface MessageInsert {
  message: string;
  from_name: string;
  to_name?: string | null;
  color: NoteColor;
  spotify_track_id?: string | null;
  spotify_track_name?: string | null;
  spotify_artist_name?: string | null;
  spotify_album_art?: string | null;
  visitor_id?: string | null;
}

// ─── Spotify API Types ───────────────────────────────────────────────────────

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  uri: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  uri: string;
  preview_url: string | null;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
}

// ─── Client-side display types ───────────────────────────────────────────────

export interface PostItData {
  id: string;
  message: string;
  from: string;
  to?: string | null;
  color: NoteColor;
  spotifyTrackId?: string | null;
  spotifyTrackName?: string | null;
  spotifyArtistName?: string | null;
  spotifyAlbumArt?: string | null;
  visitorId?: string | null;
  isOwn?: boolean;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a Supabase `Message` row to a client-friendly `PostItData` object.
 * Optionally pass `currentVisitorId` to tag posts that belong to the current visitor.
 */
export function messageToPostIt(
  msg: Message,
  currentVisitorId?: string | null,
): PostItData {
  return {
    id: msg.id,
    message: msg.message,
    from: msg.from_name,
    to: msg.to_name,
    color: msg.color,
    spotifyTrackId: msg.spotify_track_id,
    spotifyTrackName: msg.spotify_track_name,
    spotifyArtistName: msg.spotify_artist_name,
    spotifyAlbumArt: msg.spotify_album_art,
    visitorId: msg.visitor_id,
    isOwn:
      !!currentVisitorId &&
      !!msg.visitor_id &&
      msg.visitor_id === currentVisitorId,
    createdAt: msg.created_at,
  };
}
