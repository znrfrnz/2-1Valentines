import { cookies } from "next/headers";
import { randomUUID, createHmac } from "crypto";

// ─── Constants ───────────────────────────────────────────────────────────────

const VISITOR_COOKIE = "visitor_id";
const VISITOR_SIG_COOKIE = "visitor_id.sig";
const NICKNAME_COOKIE = "visitor_nickname";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Secret used to HMAC-sign the visitor_id cookie.
 * Falls back to a default in development — in production you MUST set SESSION_SECRET.
 */
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[session] SESSION_SECRET is not set! Using a fallback. Set it in your environment variables."
      );
    }
    return "valentine-wall-dev-secret-change-me";
  }
  return secret;
}

// ─── Signing Helpers ─────────────────────────────────────────────────────────

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function verify(value: string, signature: string): boolean {
  const expected = sign(value);
  // Constant-time comparison to prevent timing attacks
  if (expected.length !== signature.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return result === 0;
}

// ─── Session Types ───────────────────────────────────────────────────────────

export interface VisitorSession {
  visitorId: string;
  nickname: string | null;
  isNew: boolean;
}

// ─── Core Session Functions ──────────────────────────────────────────────────

/**
 * Get the current visitor session from cookies.
 * Returns `null` if no valid session cookie exists.
 *
 * This function is safe to call from Server Components, API Routes, and Middleware.
 */
export async function getVisitorSession(): Promise<VisitorSession | null> {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  const signature = cookieStore.get(VISITOR_SIG_COOKIE)?.value;

  if (!visitorId || !signature) {
    return null;
  }

  // Verify the signature to prevent tampering
  if (!verify(visitorId, signature)) {
    return null;
  }

  // Validate UUID format
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      visitorId
    )
  ) {
    return null;
  }

  const nickname = cookieStore.get(NICKNAME_COOKIE)?.value ?? null;

  return {
    visitorId,
    nickname: nickname ? decodeURIComponent(nickname) : null,
    isNew: false,
  };
}

/**
 * Get the current visitor session or create a new one if none exists.
 * This sets cookies on the response when creating a new session.
 *
 * Use this in API routes or middleware where you can write cookies.
 */
export async function getOrCreateVisitorSession(): Promise<VisitorSession> {
  const existing = await getVisitorSession();
  if (existing) return existing;

  const visitorId = randomUUID();
  const signature = sign(visitorId);

  const cookieStore = await cookies();

  cookieStore.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  cookieStore.set(VISITOR_SIG_COOKIE, signature, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return {
    visitorId,
    nickname: null,
    isNew: true,
  };
}

/**
 * Save the visitor's nickname to a cookie so it persists across visits.
 * This is NOT httpOnly so the client can also read it for auto-fill.
 */
export async function setVisitorNickname(nickname: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(NICKNAME_COOKIE, encodeURIComponent(nickname.trim()), {
    httpOnly: false, // Allow client-side reading for auto-fill
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

// ─── Rate Limiting ───────────────────────────────────────────────────────────

/**
 * In-memory rate limiter per visitor.
 * Tracks timestamps of recent posts.
 *
 * NOTE: This is per-process only. In a multi-instance deployment (e.g. serverless),
 * each instance has its own map. For production at scale, use Redis or similar.
 * For a Valentine's wall this is more than sufficient.
 */
const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_POSTS = 10; // max posts per window

/**
 * Check if a visitor is rate-limited.
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`.
 */
export function checkRateLimit(visitorId: string): {
  allowed: boolean;
  retryAfterMs?: number;
  remaining: number;
} {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  // Get existing timestamps and filter to current window
  let timestamps = rateLimitMap.get(visitorId) ?? [];
  timestamps = timestamps.filter((t) => t > windowStart);

  if (timestamps.length >= RATE_LIMIT_MAX_POSTS) {
    // Find when the oldest timestamp in the window will expire
    const oldestInWindow = Math.min(...timestamps);
    const retryAfterMs = oldestInWindow + RATE_LIMIT_WINDOW_MS - now;

    return {
      allowed: false,
      retryAfterMs: Math.max(retryAfterMs, 1000),
      remaining: 0,
    };
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_POSTS - timestamps.length,
  };
}

/**
 * Record a post for rate limiting purposes.
 * Call this AFTER successfully saving a message.
 */
export function recordPost(visitorId: string): void {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  let timestamps = rateLimitMap.get(visitorId) ?? [];
  // Clean up old entries
  timestamps = timestamps.filter((t) => t > windowStart);
  timestamps.push(now);

  rateLimitMap.set(visitorId, timestamps);
}

/**
 * Periodically clean up stale entries from the rate limit map.
 * This prevents memory leaks from visitors who posted once and never returned.
 */
function cleanupRateLimitMap(): void {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  for (const [visitorId, timestamps] of rateLimitMap.entries()) {
    const active = timestamps.filter((t) => t > windowStart);
    if (active.length === 0) {
      rateLimitMap.delete(visitorId);
    } else {
      rateLimitMap.set(visitorId, active);
    }
  }
}

// Clean up every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitMap, 10 * 60 * 1000);
}
