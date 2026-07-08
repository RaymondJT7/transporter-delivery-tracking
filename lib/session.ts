// Signed session tokens, verified with a server-side secret.
//
// Why this exists: the old code stored the user's role in a plain
// cookie that the BROWSER set (`document.cookie = "userRole=ADMIN"`).
// That means anyone could open dev tools and grant themselves admin
// access, with no login required. A signed token fixes that: the
// payload (userId + role) is signed with a secret only the server
// knows, so the client can read it but can't forge or edit it
// without the signature check failing.
//
// Uses the Web Crypto API (not Node's `crypto` module) so this works
// in both middleware (Edge runtime) and normal API routes.

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export type SessionPayload = {
  userId: string;
  role: string;
  exp: number; // unix seconds
};

function base64url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(str: string): Uint8Array {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  const bin = atob(str);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

const SEVEN_DAYS = 60 * 60 * 24 * 7;

async function getKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    // Don't fail silently in production - a missing secret would mean
    // sessions can't be verified at all.
    throw new Error(
      "SESSION_SECRET is not set. Add one to your .env file (any long random string)."
    );
  }

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(
  payload: { userId: string; role: string },
  maxAgeSeconds = SEVEN_DAYS
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const full: SessionPayload = { ...payload, exp };

  const payloadB64 = base64url(encoder.encode(JSON.stringify(full)));
  const key = await getKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadB64)
  );

  return `${payloadB64}.${base64url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;

  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;

  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlToBytes(sigB64) as BufferSource,
      encoder.encode(payloadB64)
    );

    if (!valid) return null;

    const payload = JSON.parse(
      decoder.decode(base64urlToBytes(payloadB64))
    ) as SessionPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) return null; // expired

    return payload;
  } catch {
    return null;
  }
}

// Convenience for use inside API route handlers, which get a plain
// Request rather than NextRequest's cookie helper.
export async function getSessionFromRequest(
  req: Request
): Promise<SessionPayload | null> {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("session="));

  if (!match) return null;

  const token = decodeURIComponent(match.slice("session=".length));
  return verifySessionToken(token);
}

export const SESSION_COOKIE_NAME = "session";
export const SESSION_MAX_AGE = SEVEN_DAYS;