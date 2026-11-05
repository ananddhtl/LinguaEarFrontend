import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, Stat } from "@/components/PageHeader";
import { adminFetch } from "@/lib/adminApi";
import type { Scenario, ScenarioRequest } from "@/lib/adminApi";

type Stats = {
  users: { total: number; verified: number; new_7d: number; active_7d: number; on_trial: number };
  subscriptions: { standard: number; pro: number };
  tickets: { open: number };
  ai_calls_today: Record<string, number>;
};

export const metadata: Metadata = { title: "Overview" };

export default async function Overview() {
  const [stats, scenarios, requests] = await Promise.all([
    adminFetch<Stats>("/admin/stats"),
    adminFetch<Scenario[]>("/admin/scenarios"),
    adminFetch<ScenarioRequest[]>("/admin/scenario-requests?status=pending"),
  ]);
  const live = scenarios.filter((s) => s.published).length;

  return (
    <>
      <PageHeader title="Overview" text="What needs your attention today." />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Live scenarios" value={live} hint={`${scenarios.length - live} unpublished`} />
        <Stat label="Pending suggestions" value={requests.length} hint="From learners" />
        <Stat label="Open tickets" value={stats.tickets.open} hint="Waiting for a reply" />
        <Stat label="Users" value={stats.users.total} hint={`${stats.users.new_7d} new, ${stats.users.active_7d} active this week`} />
        <Stat label="On trial" value={stats.users.on_trial} hint="Seven days free" />
        <Stat
          label="Paying"
          value={stats.subscriptions.standard + stats.subscriptions.pro}
          hint={`${stats.subscriptions.standard} Standard, ${stats.subscriptions.pro} Pro`}
        />
        <Stat
          label="AI calls today"
          value={Object.values(stats.ai_calls_today).reduce((a, b) => a + b, 0)}
          hint="Across all users"
        />
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Newest suggestions</h2>
          <Link href="/admin/requests" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        {requests.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Nothing waiting. Suggestions from the app show up here.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {requests.slice(0, 5).map((r) => (
              <li key={r.id} className="py-3">
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted">from {r.username ?? `user ${r.user_id}`}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
