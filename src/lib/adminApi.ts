import { redirect } from "next/navigation";

import { API_URL, getToken } from "./session";

export type Scenario = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  tint: string;
  persona: string;
  openings: Record<string, string>;
  key_phrases: { de: string; en: string }[];
  sort_order: number;
  published: boolean;
};

export type ScenarioRequest = {
  id: number;
  user_id: number;
  username: string | null;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  admin_note: string;
  created_at: string;
};

/** Calls the backend as the signed-in admin. A missing or rejected login goes back to the login page. */
export async function adminFetch<T>(path: string): Promise<T> {
  const token = await getToken();
  if (!token) redirect("/admin/login");
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  } catch {
    throw new Error("The server could not be reached. It may be waking up; reload in a moment.");
  }
  if (res.status === 401 || res.status === 403 || res.status === 404) redirect("/admin/login?error=session");
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  email_verified: boolean;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  trial_ends_at: string | null;
  plan: string | null;
  account_type: "admin" | "pro" | "standard" | "trial" | "expired";
  points: number;
  level: number;
  saved_phrases: number;
  calls_today: number;
  calls_7d: number;
  last_active: string | null;
};

export type UserDetail = AdminUser & {
  billing: {
    state: string;
    tier: string | null;
    subscription_status: string | null;
    trial_days_left: number | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  };
  usage: { limits: Record<string, { used: number; limit: number }>; saved_phrases: { used: number; limit: number } };
  tickets: number;
  daily_usage: { day: string; calls: number }[];
  recent_scores: { kind: string; points: number; created_at: string }[];
};

export type ContentInfo = { key: string; customised: boolean; updated_at: string | null };

/** Sends a change to the backend as the signed-in admin. Returns an error message instead of throwing. */
export async function adminSend(method: "PATCH" | "PUT" | "DELETE" | "POST", path: string, body?: unknown) {
  const token = await getToken();
  if (!token) redirect("/admin/login");
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    if (res.ok) return { ok: true as const };
    if (res.status === 401) redirect("/admin/login?error=session");
    const detail = (await res.json().catch(() => null))?.detail;
    return { ok: false as const, error: typeof detail === "string" ? detail : `Request failed (${res.status})` };
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    return { ok: false as const, error: "The server could not be reached." };
  }
}
