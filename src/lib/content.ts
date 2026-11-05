import { cacheLife, cacheTag } from "next/cache";

import { DEFAULTS } from "@/content/defaults";
import type { ContentKey } from "@/content/types";

import { API_URL } from "./session";

/**
 * Site text for a page: what was edited in the admin, or the built-in text when nothing was.
 * Cached for a few minutes, and the admin's save clears the cache straight away.
 */
export async function getContent<K extends ContentKey>(key: K): Promise<(typeof DEFAULTS)[K]> {
  "use cache";
  cacheTag("content", `content-${key}`);
  cacheLife("minutes");
  try {
    const res = await fetch(`${API_URL}/content/${key}`, { signal: AbortSignal.timeout(8000) });
    if (res.ok) return (await res.json()) as (typeof DEFAULTS)[K];
  } catch {
    // The backend may be asleep or down; the built-in text keeps the site working.
  }
  return DEFAULTS[key];
}
