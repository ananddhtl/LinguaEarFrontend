import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { CONTENT_LABELS } from "@/content/types";
import type { ContentKey } from "@/content/types";
import { adminFetch } from "@/lib/adminApi";
import type { ContentInfo } from "@/lib/adminApi";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Website content" };

export default async function Content() {
  const stored = await adminFetch<ContentInfo[]>("/admin/content");

  return (
    <>
      <PageHeader
        title="Website content"
        text="Edit the text of the public website without changing any code. Pages you have not edited use the built-in text."
      />
      <ul className="divide-y divide-border border-y border-border">
        {stored.map((c) => {
          const label = CONTENT_LABELS[c.key as ContentKey];
          return (
            <li key={c.key}>
              <Link href={`/admin/content/${c.key}`} className="flex items-center justify-between gap-4 py-4 hover:bg-card sm:px-3">
                <div>
                  <p className="font-serif text-lg">{label?.title ?? c.key}</p>
                  <p className="text-sm text-muted">{label?.text}</p>
                </div>
                <p className="shrink-0 text-xs text-muted">
                  {c.customised ? `Edited ${formatDateTime(c.updated_at)}` : "Built-in text"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
