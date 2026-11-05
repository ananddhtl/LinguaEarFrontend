import { cookies } from "next/headers";

export const ACCESS_COOKIE = "le_admin_access";

export const API_URL = process.env.API_URL ?? "http://localhost:8765";

/** The admin's access token, kept in an httpOnly cookie so page scripts can never read it. */
export async function getToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}
