import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { adminFetch } from "@/lib/adminApi";
import type { ScenarioRequest } from "@/lib/adminApi";

export const metadata: Metadata = { title: "Requests" };

const badge: Record<ScenarioRequest["status"], string> = {
  pending: "text-text",
  approved: "text-accent",
  rejected: "text-muted",
};

export default async function Requests() {
  const requests = await adminFetch<ScenarioRequest[]>("/admin/scenario-requests");

  return (
    <>
      <PageHeader title="Scenario suggestions" text="Situations learners would like to practise." />
      <div className="divide-y divide-border border-y border-border">
        {requests.map((r) => (
          <div key={r.id} className="py-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-lg">{r.title}</h2>
              <span className={`text-xs font-medium uppercase tracking-widest ${badge[r.status]}`}>{r.status}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{r.description}</p>
            <p className="mt-3 text-xs text-muted">
              {r.username ?? `User ${r.user_id}`} · {new Date(r.created_at).toLocaleDateString("en-GB")}
              {r.admin_note && ` · Note: ${r.admin_note}`}
            </p>
          </div>
        ))}
        {requests.length === 0 && (
          <p className="border border-dashed border-border p-8 text-sm text-muted">
            No suggestions yet.
          </p>
        )}
      </div>
    </>
  );
}
