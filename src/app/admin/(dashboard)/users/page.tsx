import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/PageHeader";
import { adminFetch } from "@/lib/adminApi";
import type { AdminUser } from "@/lib/adminApi";
import { formatDate, formatDateTime, TYPE_LABEL } from "@/lib/format";

export const metadata: Metadata = { title: "Users" };

const PAGE = 30;
const KINDS = [
  ["", "All"],
  ["trial", "Trial"],
  ["standard", "Standard"],
  ["pro", "Pro"],
  ["expired", "Expired"],
  ["admin", "Admins"],
  ["disabled", "Disabled"],
] as const;

type Search = { q?: string; kind?: string; page?: string };

export default async function Users({ searchParams }: { searchParams: Promise<Search> }) {
  const { q = "", kind = "", page = "1" } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const params = new URLSearchParams({ limit: String(PAGE), offset: String((current - 1) * PAGE) });
  if (q) params.set("q", q);
  if (kind) params.set("kind", kind);
  const { total, users } = await adminFetch<{ total: number; users: AdminUser[] }>(`/admin/users?${params}`);

  const link = (over: Search) => {
    const next = new URLSearchParams();
    const merged = { q, kind, ...over };
    if (merged.q) next.set("q", merged.q);
    if (merged.kind) next.set("kind", merged.kind);
    if (merged.page && merged.page !== "1") next.set("page", merged.page);
    const qs = next.toString();
    return `/admin/users${qs ? `?${qs}` : ""}`;
  };
  const pages = Math.max(1, Math.ceil(total / PAGE));

  return (
    <>
      <PageHeader title="Users" text={`${total} account${total === 1 ? "" : "s"}. Open one to see details or disable it.`} />

      <form className="mb-5 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name or email"
          className="w-full max-w-sm border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {kind && <input type="hidden" name="kind" value={kind} />}
        <button className="bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90">Search</button>
      </form>

      <nav className="mb-5 flex flex-wrap gap-x-5 gap-y-1 border-b border-border text-sm">
        {KINDS.map(([k, label]) => (
          <Link
            key={k}
            href={link({ kind: k, page: "1" })}
            className={`-mb-px border-b-2 pb-2 ${kind === k ? "border-accent font-semibold" : "border-transparent text-muted hover:text-text"}`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-border bg-card text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Points</th>
              <th className="px-4 py-3 text-right font-medium">AI calls (today / 7d)</th>
              <th className="px-4 py-3 font-medium">Last active</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-card">
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${u.id}`} className="font-serif text-base hover:text-accent hover:underline">
                    {u.username}
                  </Link>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3">{TYPE_LABEL[u.account_type]}</td>
                <td className="px-4 py-3">
                  {!u.is_active ? (
                    <span className="text-error">Disabled</span>
                  ) : !u.email_verified ? (
                    <span className="text-muted">Unverified</span>
                  ) : (
                    "Active"
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {u.points} <span className="text-xs text-muted">Lv {u.level}</span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {u.calls_today} / {u.calls_7d}
                </td>
                <td className="px-4 py-3 text-muted">{formatDateTime(u.last_active)}</td>
                <td className="px-4 py-3 text-muted">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-8 text-center text-sm text-muted">No users match.</p>}
      </div>

      {pages > 1 && (
        <div className="mt-5 flex items-center justify-between text-sm">
          <span className="text-muted">
            Page {current} of {pages}
          </span>
          <div className="flex gap-5">
            {current > 1 && (
              <Link href={link({ page: String(current - 1) })} className="text-accent hover:underline">
                Previous
              </Link>
            )}
            {current < pages && (
              <Link href={link({ page: String(current + 1) })} className="text-accent hover:underline">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
