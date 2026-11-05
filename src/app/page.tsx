import Link from "next/link";

import { Marketing } from "@/components/Marketing";
import { PlanCards } from "@/components/PlanCards";
import { getContent } from "@/lib/content";

export default async function Home() {
  const [{ headline, intro, features, levels }, { plans }] = await Promise.all([
    getContent("home"),
    getContent("pricing"),
  ]);
  return (
    <Marketing>
      <section className="mx-auto grid max-w-5xl gap-12 px-5 py-20 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h1 className="text-5xl leading-[1.1] sm:text-6xl">{headline}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6" id="get-the-app">
            <span className="bg-accent px-6 py-3 text-sm font-medium text-on-accent">Coming soon to iOS and Android</span>
            <Link href="/pricing" className="text-sm font-medium text-accent hover:underline">
              See pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">Seven days free with every new account.</p>
        </div>

        <figure className="border border-border bg-card p-6 lg:col-span-2">
          <figcaption className="text-xs uppercase tracking-widest text-muted">At the café · Beginner</figcaption>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed">
            <p>
              <span className="text-muted">Waiter </span>
              <br />
              Hallo! Was darf ich Ihnen heute bringen?
            </p>
            <p>
              <span className="text-muted">You </span>
              <br />
              Ich möchte <span className="g-der">einen Kaffee</span>, bitte.
            </p>
            <p className="border-t border-border pt-4 text-muted">
              Correct. <span className="g-der">Der Kaffee</span> takes <em>einen</em> in the accusative.
            </p>
          </div>
        </figure>
      </section>

      <section id="features" className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <h2 className="text-3xl">What you can do</h2>
          <dl className="mt-8 grid gap-x-12 gap-y-0 sm:grid-cols-2">
            {features.map(({ title: t, text: d }, i) => (
              <div key={t} className="border-t border-border py-6">
                <dt className="font-serif text-lg font-semibold">
                  <span className="mr-3 text-sm font-normal text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {t}
                </dt>
                <dd className="mt-2 leading-relaxed text-muted">{d}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-muted">
            Gender marks: <span className="g-der">der</span>, <span className="g-die">die</span>,{" "}
            <span className="g-das">das</span>.
          </p>
        </div>
      </section>

      <section id="levels" className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <h2 className="text-3xl">Conversation at your level</h2>
          <p className="mt-3 max-w-xl text-muted">
            The same situation is played differently at each level, so it is never too hard and never too easy.
          </p>
          <div className="mt-8 grid border border-border md:grid-cols-3 md:divide-x md:divide-border">
            {levels.map(({ name: n, cefr: c, text: d }) => (
              <div key={n} className="border-b border-border p-6 last:border-b-0 md:border-b-0">
                <p className="text-xs uppercase tracking-widest text-muted">{c}</p>
                <h3 className="mt-1 text-xl">{n}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted">Missing a situation? Suggest it in the app and we will consider it.</p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <h2 className="text-3xl">Plans</h2>
          <p className="mb-8 mt-3 text-muted">Seven days of Standard are free. After that, choose a plan.</p>
          <PlanCards plans={plans} />
        </div>
      </section>
    </Marketing>
  );
}
