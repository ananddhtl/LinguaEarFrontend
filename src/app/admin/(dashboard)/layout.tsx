import { Suspense } from "react";

import { AdminNav } from "@/components/AdminNav";
import { Logo } from "@/components/Logo";
import { adminFetch } from "@/lib/adminApi";

import { logout } from "../login/actions";

type Me = { username: string; email: string };

/** Checks the admin login on every request, so the shell is prerendered and only the account name streams in. */
async function Account() {
  const me = await adminFetch<Me>("/admin/me");
  return (
    <div className="space-y-2 text-sm">
      <p className="truncate font-semibold">{me.username}</p>
      <p className="truncate text-xs text-muted">{me.email}</p>
      <form action={logout}>
        <button className="text-xs font-medium text-muted underline-offset-2 hover:text-text hover:underline">Sign out</button>
      </form>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex shrink-0 flex-col gap-6 border-b border-border bg-card p-4 md:w-56 md:border-b-0 md:border-r md:p-5">
        <Logo href="/admin" />
        <Suspense fallback={null}>
          <AdminNav />
        </Suspense>
        <div className="mt-auto hidden border-t border-border pt-4 md:block">
          <Suspense fallback={<p className="text-xs text-muted">Loading…</p>}>
            <Account />
          </Suspense>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-8">
        <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>{children}</Suspense>
      </main>
    </div>
  );
}
