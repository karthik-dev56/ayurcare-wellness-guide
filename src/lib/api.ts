/**
 * Centralised client for the AyurCare backend.
 * All requests are sent with credentials so the backend session cookie applies.
 */

export const API_BASE_URL: string =
  (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ??
  "https://ayurvedic-rag-production.up.railway.app";

export class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: { Accept: "application/json", ...(init?.body ? { "Content-Type": "application/json" } : {}) },
      ...init,
    });
  } catch {
    throw new ApiError("network");
  }
  if (!res.ok) throw new ApiError(String(res.status));
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError("parse");
  }
}

/* ---------------------------------- auth --------------------------------- */

export interface AyurUser {
  id?: string | number;
  name?: string;
  email?: string;
  picture?: string;
}

type MeResponse = Record<string, unknown>;

function pickUser(raw: MeResponse): AyurUser | null {
  const source = (raw['user'] && typeof raw['user'] === "object" ? raw['user'] : raw) as Record<string, unknown>;
  const authenticated = raw['authenticated'];
  if (authenticated === false) return null;

  const name = (source['name'] ?? source['username'] ?? source['given_name'] ?? source['full_name']) as string | undefined;
  const email = (source['email'] ?? source['user_email']) as string | undefined;
  const picture = (source['picture'] ?? source['avatar'] ?? source['photo'] ?? source['image']) as string | undefined;
  const id = (source['id'] ?? source['user_id'] ?? source['sub']) as string | number | undefined;

  if (!name && !email && id === undefined) return null;
  return { id, name, email, picture };
}

export async function fetchCurrentUser(): Promise<AyurUser | null> {
  try {
    const raw = await request<MeResponse>("/auth/me");
    if (raw['error'] || raw['detail']) return null;
    return pickUser(raw);
  } catch {
    return null;
  }
}

export function startGoogleSignIn(): void {
  window.location.href = `${API_BASE_URL}/auth/google`;
}

export async function logout(): Promise<void> {
  await request("/auth/logout", { method: "POST" });
}

/* ---------------------------------- chat --------------------------------- */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

function normaliseMessage(raw: Record<string, unknown>, index: number): ChatMessage | null {
  const content = (raw['content'] ?? raw['message'] ?? raw['text'] ?? raw['answer'] ?? raw['response']) as
    | string
    | undefined;
  if (!content) return null;
  const roleRaw = String(raw['role'] ?? raw['sender'] ?? raw['type'] ?? "").toLowerCase();
  const isUser = roleRaw === "user" || roleRaw === "human" || raw['is_user'] === true;
  return {
    id: String(raw['id'] ?? `${index}-${content.slice(0, 12)}`),
    role: isUser ? "user" : "assistant",
    content,
    createdAt: (raw['created_at'] ?? raw['timestamp'] ?? raw['createdAt']) as string | undefined,
  };
}

function extractArray(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object") {
    for (const key of ["history", "messages", "conversations", "data", "items", "chats"]) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as Record<string, unknown>[];
    }
  }
  return [];
}

export async function fetchHistory(): Promise<ChatMessage[]> {
  const payload = await request<unknown>("/chat/history");
  if (payload && typeof payload === "object" && (payload as Record<string, unknown>)['error']) {
    throw new ApiError("unauthenticated");
  }
  return extractArray(payload)
    .map(normaliseMessage)
    .filter((m): m is ChatMessage => m !== null);
}

export async function sendMessage(message: string): Promise<string> {
  const payload = await request<Record<string, unknown>>("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  const reply = (payload['response'] ?? payload['answer'] ?? payload['message'] ?? payload['reply'] ?? payload['content']) as
    | string
    | undefined;
  if (!reply) throw new ApiError("empty");
  return reply;
}
