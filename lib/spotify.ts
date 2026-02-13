// Spotify API helpers — server-side only
// Uses Client Credentials flow (no user login required)

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500; // first retry waits 500ms, then 1s, then 2s

/**
 * Sleep for the given number of milliseconds.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Determine whether a failed fetch should be retried.
 * Retries on network errors and 5xx status codes.
 */
function isRetryable(error: unknown, res?: Response): boolean {
  // Network-level failure (no response at all)
  if (!res) return true;
  // Server errors (502, 503, 504, etc.)
  return res.status >= 500 && res.status < 600;
}

/**
 * Get a Spotify access token using Client Credentials flow.
 * Tokens are cached in memory until they expire.
 * Retries up to 3 times with exponential backoff on transient failures.
 */
export async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables",
    );
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!res.ok) {
        const text = await res.text();
        const err = new Error(
          `Spotify token request failed: ${res.status} — ${text}`,
        );

        if (isRetryable(null, res) && attempt < MAX_RETRIES) {
          const delayMs = BASE_DELAY_MS * Math.pow(2, attempt);
          console.warn(
            `[Spotify] Token request failed (${res.status}), retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`,
          );
          lastError = err;
          await sleep(delayMs);
          continue;
        }

        throw err;
      }

      const data = await res.json();

      cachedToken = data.access_token as string;
      // Expire 60 seconds early to avoid edge-case failures
      tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

      if (attempt > 0) {
        console.info(
          `[Spotify] Token request succeeded after ${attempt + 1} attempts.`,
        );
      }

      return cachedToken;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // If the error message already says "Spotify token request failed"
      // with a non-retryable status, don't retry — just throw.
      if (
        lastError.message.startsWith("Spotify token request failed") &&
        attempt >= MAX_RETRIES
      ) {
        throw lastError;
      }

      // Network-level error (e.g. ECONNREFUSED, DNS failure, timeout)
      if (attempt < MAX_RETRIES) {
        const delayMs = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(
          `[Spotify] Token request error: ${lastError.message}. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`,
        );
        await sleep(delayMs);
        continue;
      }
    }
  }

  throw lastError ?? new Error("Spotify token request failed after retries");
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtistSimple {
  id: string;
  name: string;
}

export interface SpotifyAlbumSimple {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtistSimple[];
  album: SpotifyAlbumSimple;
  preview_url: string | null;
  external_urls: { spotify: string };
  duration_ms: number;
  uri: string;
}

/** Simplified track info returned to the client */
export interface TrackResult {
  id: string;
  name: string;
  artist: string;
  albumName: string;
  albumArt: string | null;
  previewUrl: string | null;
  spotifyUrl: string;
  durationMs: number;
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

/**
 * Search for tracks on Spotify.
 */
export async function searchTracks(
  query: string,
  limit = 5,
): Promise<TrackResult[]> {
  const token = await getSpotifyToken();

  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: String(limit),
  });

  const res = await fetch(
    `https://api.spotify.com/v1/search?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify search failed: ${res.status} — ${text}`);
  }

  const data = await res.json();
  const tracks: SpotifyTrack[] = data.tracks?.items ?? [];

  return tracks.map(toTrackResult);
}

/**
 * Get a single track by its Spotify ID.
 */
export async function getTrack(trackId: string): Promise<TrackResult | null> {
  const token = await getSpotifyToken();

  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify getTrack failed: ${res.status} — ${text}`);
  }

  const track: SpotifyTrack = await res.json();
  return toTrackResult(track);
}

/**
 * Extract a Spotify track ID from various URL formats:
 *   - https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6
 *   - spotify:track:6rqhFgbbKwnb9MLmUQDhG6
 */
export function extractTrackId(input: string): string | null {
  // open.spotify.com URL
  const urlMatch = input.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (urlMatch) return urlMatch[1];

  // Spotify URI
  const uriMatch = input.match(/spotify:track:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];

  // Maybe it's already just an ID (22 char base62)
  if (/^[a-zA-Z0-9]{22}$/.test(input.trim())) {
    return input.trim();
  }

  return null;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function toTrackResult(track: SpotifyTrack): TrackResult {
  // Pick the smallest album image (usually 64×64), fall back to first
  const images = track.album.images;
  const albumArt =
    images.length > 0
      ? (images.find((i) => i.width && i.width <= 300) ?? images[0]).url
      : null;

  return {
    id: track.id,
    name: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    albumName: track.album.name,
    albumArt,
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
    durationMs: track.duration_ms,
  };
}
