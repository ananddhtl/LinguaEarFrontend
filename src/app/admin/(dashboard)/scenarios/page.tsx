import type { Metadata } from "next";

import { PageHeader } from "@/components/PageHeader";
import { adminFetch } from "@/lib/adminApi";
import type { Scenario } from "@/lib/adminApi";

export const metadata: Metadata = { title: "Scenarios" };

export default async function Scenarios() {
  const scenarios = await adminFetch<Scenario[]>("/admin/scenarios");

  return (
    <>
      <PageHeader
        title="Scenarios"
        text="Role-play situations shown in the app. Each has an opening line for every level."
      />
      <div className="border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-card text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-5 py-3.5 font-medium">Scenario</th>
              <th className="hidden px-5 py-3.5 font-medium sm:table-cell">Category</th>
              <th className="hidden px-5 py-3.5 font-medium lg:table-cell">Phrases</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {scenarios.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-4">
                  <p className="font-serif text-base">{s.title}</p>
                  <p className="max-w-md truncate text-xs text-muted">{s.description}</p>
                </td>
                <td className="hidden px-5 py-4 text-muted sm:table-cell">{s.category}</td>
                <td className="hidden px-5 py-4 text-muted lg:table-cell">{s.key_phrases.length}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-medium uppercase tracking-widest ${s.published ? "text-accent" : "text-muted"}`}>
                    {s.published ? "Live" : "Hidden"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {scenarios.length === 0 && <p className="p-8 text-center text-sm text-muted">No scenarios yet.</p>}
      </div>
    </>
  );
}
