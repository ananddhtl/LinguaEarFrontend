import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader, Stat } from "@/components/PageHeader";
import { adminFetch } from "@/lib/adminApi";
import type { UserDetail } from "@/lib/adminApi";
import { formatDate, formatDateTime, TYPE_LABEL } from "@/lib/format";

import { updateUser } from "../../actions";

export const metadata: Metadata = { title: "User" };

const KIND_LABEL: Record<string, string> = {
  analyze: "Phrase analyses",
  game: "Scenario replies",
  scan: "Camera scans",
  transcribe: "Speech to text",
};

function Action({ id, field, value, label, danger }: { id: number; field: string; value: string; label: string; danger?: boolean }) {
  return (
    <form action={updateUser}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="field" value={field} />
      <input type="hidden" name="value" value={value} />
      <button
        className={`border px-4 py-2 text-sm font-medium hover:opacity-80 ${
          danger ? "border-error text-error" : "border-border"
        }`}
      >
        {label}
      </button>
    </form>
  );
}

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = await adminFetch<UserDetail>(`/admin/users/${Number(id)}`);
  const peak = Math.max(1, ...u.daily_usage.map((d) => d.calls));

  return (
    <>
      <Link href="/admin/users" className="mb-4 inline-block text-sm text-accent hover:underline">
        ← All users
      </Link>
      <PageHeader title={u.username} text={`${u.email}${u.full_name ? ` · ${u.full_name}` : ""}`} />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Type" value={TYPE_LABEL[u.account_type]} hint={u.is_active ? "Account active" : "Account disabled"} />
        <Stat label="Points" value={u.points} hint={`Level ${u.level}`} />
        <Stat label="AI calls" value={u.calls_7d} hint={`${u.calls_today} today, last 7 days`} />
        <Stat label="Last active" value={u.last_active ? formatDate(u.last_active) : "Never"} hint={formatDateTime(u.last_active)} />
      </div>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-xl">Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {u.is_active ? (
            <Action id={u.id} field="is_active" value="false" label="Disable account" danger />
          ) : (
            <Action id={u.id} field="is_active" value="true" label="Enable account" />
          )}
          {!u.email_verified && <Action id={u.id} field="email_verified" value="true" label="Mark email verified" />}
          <Action id={u.id} field="extend_trial_days" value="7" label="Extend trial 7 days" />
          <Action id={u.id} field="extend_trial_days" value="30" label="Extend trial 30 days" />
          {u.is_admin ? (
            <Action id={u.id} field="is_admin" value="false" label="Remove admin" danger />
          ) : (
            <Action id={u.id} field="is_admin" value="true" label="Make admin" />
          )}
        </div>
        <p className="mt-3 max-w-xl text-xs text-muted">
          Disabling signs the person out on every device straight away. You cannot disable yourself or remove your own admin
          access.
        </p>
      </section>

      <div className="mt-10 grid gap-10 border-t border-border pt-6 lg:grid-cols-2">
        <section>
          <h2 className="text-xl">Account</h2>
          <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
            {[
              ["Joined", formatDate(u.created_at)],
              ["Email", u.email_verified ? "Verified" : "Not verified"],
              ["Plan state", u.billing.state],
              ["Subscription", u.billing.subscription_status ?? "None"],
              ["Trial ends", u.trial_ends_at ? formatDate(u.trial_ends_at) : "–"],
              ["Renews / ends", formatDate(u.billing.current_period_end)],
              ["Support tickets", String(u.tickets)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5">
                <dt className="text-muted">{k}</dt>
                <dd className="capitalize">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-xl">Today&apos;s limits</h2>
          <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
            {Object.entries(u.usage.limits).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5">
                <dt className="text-muted">{KIND_LABEL[k] ?? k}</dt>
                <dd className="tabular-nums">
                  {v.used} / {v.limit}
                </dd>
              </div>
            ))}
            <div className="flex justify-between py-2.5">
              <dt className="text-muted">Saved phrases</dt>
              <dd className="tabular-nums">
                {u.usage.saved_phrases.used} / {u.usage.saved_phrases.limit}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-xl">Activity, last 14 days</h2>
        <p className="mt-1 text-sm text-muted">AI calls per day. The app does not record time spent on screen.</p>
        <div className="mt-5 flex h-32 items-end gap-1.5">
          {u.daily_usage.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${d.day}: ${d.calls}`}>
              <span className="text-[10px] tabular-nums text-muted">{d.calls || ""}</span>
              <div className="w-full bg-accent" style={{ height: `${Math.max(2, (d.calls / peak) * 88)}px`, opacity: d.calls ? 1 : 0.25 }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>{u.daily_usage[0]?.day.slice(5)}</span>
          <span>{u.daily_usage.at(-1)?.day.slice(5)}</span>
        </div>
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-xl">Recent points</h2>
        {u.recent_scores.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No points earned yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border border-y border-border text-sm">
            {u.recent_scores.map((s, i) => (
              <li key={i} className="flex justify-between py-2.5">
                <span className="capitalize">{s.kind}</span>
                <span className="text-muted">{formatDateTime(s.created_at)}</span>
                <span className="tabular-nums">+{s.points}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
