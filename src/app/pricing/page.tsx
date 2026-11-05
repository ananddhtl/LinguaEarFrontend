import type { Metadata } from "next";

import { Marketing } from "@/components/Marketing";
import { PlanCards } from "@/components/PlanCards";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Pricing" };

export default async function Pricing() {
  const { intro, plans, faq } = await getContent("pricing");
  return (
    <Marketing>
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="text-4xl sm:text-5xl">Pricing</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          {intro}
        </p>
        <div className="mt-10">
          <PlanCards plans={plans} />
        </div>
        <dl className="mt-16 max-w-2xl divide-y divide-border border-y border-border">
          {faq.map(({ q, a }) => (
            <div key={q} className="py-5">
              <dt className="font-serif text-lg font-semibold">{q}</dt>
              <dd className="mt-1.5 text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Marketing>
  );
}
