import type { LegalDocument } from "@/content/legal";

import { Marketing } from "./Marketing";

export function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <Marketing>
      <article className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-4xl">{doc.title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated {doc.updated}</p>
        <p className="mt-6 text-lg leading-relaxed">{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.heading} className="mt-10 border-t border-border pt-6">
            <h2 className="text-xl">{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-muted">
                {p}
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </Marketing>
  );
}
