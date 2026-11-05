"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ACCESS_COOKIE, API_URL } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember_me: false }),
      cache: "no-store",
    });
  } catch {
    return { error: "The server could not be reached. Try again in a moment." };
  }
  if (!res.ok) return { error: res.status === 401 ? "Incorrect email or password." : "Could not sign in." };
  const tokens = (await res.json()) as { access_token: string; expires_in: number };

  // Only admin accounts get in; the backend answers 404 to everyone else.
  const me = await fetch(`${API_URL}/admin/me`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
    cache: "no-store",
  }).catch(() => null);
  if (!me?.ok) return { error: "This account does not have admin access." };

  (await cookies()).set(ACCESS_COOKIE, tokens.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: tokens.expires_in,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete({ name: ACCESS_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
