"use server";

import { revalidatePath } from "next/cache";

import { adminSend } from "@/lib/adminApi";

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
