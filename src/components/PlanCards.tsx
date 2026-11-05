import type { PricingContent } from "@/content/types";

export function PlanCards({ plans }: { plans: PricingContent["plans"] }) {
  return (
    <div
      className="grid border border-border sm:divide-x sm:divide-border"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(16rem, 1fr))` }}
    >
      {plans.map((p) => (
        <div key={p.name} className="border-b border-border p-7 last:border-b-0 sm:border-b-0">
          <h3 className="text-2xl">{p.name}</h3>
          <p className="mt-3 font-serif text-4xl">
            {p.price}
            <span className="font-sans text-sm text-muted"> per month</span>
          </p>
          <p className="mt-2 text-sm text-muted">{p.blurb}</p>
          <ul className="mt-5 divide-y divide-border border-t border-border text-sm">
            {p.items.map((i) => (
              <li key={i} className="py-2.5">
                {i}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
