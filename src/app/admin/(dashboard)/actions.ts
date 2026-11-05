"use server";

import { revalidatePath, updateTag } from "next/cache";

import { adminSend } from "@/lib/adminApi";
import { isContentKey } from "@/content/types";

export type ActionResult = { error?: string; saved?: boolean } | undefined;

/** One change to a user: disable, enable, make or remove admin, verify the email, or extend the trial. */
export async function updateUser(formData: FormData) {
  const id = Number(formData.get("id"));
  const field = String(formData.get("field"));
  const raw = String(formData.get("value"));
  const allowed = ["is_active", "is_admin", "email_verified", "extend_trial_days"];
  if (!Number.isInteger(id) || !allowed.includes(field)) return;

  const value = field === "extend_trial_days" ? Number(raw) : raw === "true";
  await adminSend("PATCH", `/admin/users/${id}`, { [field]: value });
  revalidatePath(`/admin/users/${id}`);
  revalidatePath("/admin/users");
}

export async function saveContent(key: string, data: unknown): Promise<ActionResult> {
  if (!isContentKey(key)) return { error: "Unknown page." };
  const result = await adminSend("PUT", `/admin/content/${key}`, data);
  if (!result.ok) return { error: result.error };
  updateTag(`content-${key}`);
  revalidatePath("/admin/content");
  return { saved: true };
}

export async function resetContent(key: string): Promise<ActionResult> {
  if (!isContentKey(key)) return { error: "Unknown page." };
  const result = await adminSend("DELETE", `/admin/content/${key}`);
  if (!result.ok) return { error: result.error };
  updateTag(`content-${key}`);
  revalidatePath("/admin/content");
  return { saved: true };
}
