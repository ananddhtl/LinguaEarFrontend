"use client";

import { useState, useTransition } from "react";

import { resetContent, saveContent } from "@/app/admin/(dashboard)/actions";
import type { HomeContent, LegalDocument, PricingContent } from "@/content/types";

import { Field, Repeater } from "./fields";

type Props =
  | { contentKey: "home"; initial: HomeContent; customised: boolean }
  | { contentKey: "pricing"; initial: PricingContent; customised: boolean }
  | { contentKey: "terms" | "privacy" | "impressum"; initial: LegalDocument; customised: boolean };

type LegalForm = {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; paragraphs: string; bullets: string }[];
};

const toLegalForm = (d: LegalDocument): LegalForm => ({
  title: d.title,
  updated: d.updated,
  intro: d.intro,
  sections: d.sections.map((s) => ({
    heading: s.heading,
    paragraphs: s.paragraphs.join("\n\n"),
    bullets: (s.bullets ?? []).join("\n"),
  })),
});

const lines = (text: string, separator: RegExp) =>
  text
    .split(separator)
    .map((t) => t.trim())
    .filter(Boolean);

const fromLegalForm = (f: LegalForm): LegalDocument => ({
  title: f.title,
  updated: f.updated,
  intro: f.intro,
  sections: f.sections.map((s) => {
    const bullets = lines(s.bullets, /\n/);
    return { heading: s.heading, paragraphs: lines(s.paragraphs, /\n\s*\n/), ...(bullets.length ? { bullets } : {}) };
  }),
});

export function ContentEditor(props: Props) {
  const { contentKey } = props;
  const [home, setHome] = useState(contentKey === "home" ? (props.initial as HomeContent) : null);
  const [pricing, setPricing] = useState(contentKey === "pricing" ? (props.initial as PricingContent) : null);
  const [legal, setLegal] = useState(
    contentKey === "terms" || contentKey === "privacy" || contentKey === "impressum"
      ? toLegalForm(props.initial as LegalDocument)
      : null,
  );
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [pending, start] = useTransition();

  const payload = () => home ?? pricing ?? (legal ? fromLegalForm(legal) : null);

  const save = () =>
    start(async () => {
      const res = await saveContent(contentKey, payload());
      setMessage(res?.error ? { text: res.error, error: true } : { text: "Saved. The website shows it within a moment." });
    });

  const reset = () => {
    if (!confirm("Go back to the built-in text? Your edits to this page will be lost.")) return;
    start(async () => {
      const res = await resetContent(contentKey);
      setMessage(
        res?.error
          ? { text: res.error, error: true }
          : { text: "Reset. Reload this page to see the built-in text again." },
      );
    });
  };

  return (
    <div className="max-w-3xl space-y-8">
      {home && (
        <>
          <div className="space-y-4">
            <Field label="Headline" value={home.headline} onChange={(v) => setHome({ ...home, headline: v })} />
            <Field label="Introduction" value={home.intro} rows={3} onChange={(v) => setHome({ ...home, intro: v })} />
          </div>
          <Repeater
            title="Features"
            items={home.features}
            onChange={(features) => setHome({ ...home, features })}
            blank={{ title: "", text: "" }}
            addLabel="Add feature"
          >
            {(f, set) => (
              <>
                <Field label="Title" value={f.title} onChange={(v) => set({ ...f, title: v })} />
                <Field label="Text" value={f.text} rows={2} onChange={(v) => set({ ...f, text: v })} />
              </>
            )}
          </Repeater>
          <Repeater
            title="Levels"
            items={home.levels}
            onChange={(levels) => setHome({ ...home, levels })}
            blank={{ name: "", cefr: "", text: "" }}
            addLabel="Add level"
          >
            {(l, set) => (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name" value={l.name} onChange={(v) => set({ ...l, name: v })} />
                  <Field label="CEFR range" value={l.cefr} onChange={(v) => set({ ...l, cefr: v })} />
                </div>
                <Field label="Text" value={l.text} rows={2} onChange={(v) => set({ ...l, text: v })} />
              </>
            )}
          </Repeater>
        </>
      )}

      {pricing && (
        <>
          <Field label="Introduction" value={pricing.intro} rows={2} onChange={(v) => setPricing({ ...pricing, intro: v })} />
          <Repeater
            title="Plans"
            items={pricing.plans}
            onChange={(plans) => setPricing({ ...pricing, plans })}
            blank={{ name: "", price: "", blurb: "", items: [] }}
            addLabel="Add plan"
          >
            {(p, set) => (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name" value={p.name} onChange={(v) => set({ ...p, name: v })} />
                  <Field label="Price" value={p.price} onChange={(v) => set({ ...p, price: v })} hint="Shown as “price per month”." />
                </div>
                <Field label="Short description" value={p.blurb} onChange={(v) => set({ ...p, blurb: v })} />
                <Field
                  label="What is included"
                  value={p.items.join("\n")}
                  rows={5}
                  onChange={(v) => set({ ...p, items: v.split("\n") })}
                  hint="One item per line."
                />
              </>
            )}
          </Repeater>
          <Repeater
            title="Questions"
            items={pricing.faq}
            onChange={(faq) => setPricing({ ...pricing, faq })}
            blank={{ q: "", a: "" }}
            addLabel="Add question"
          >
            {(f, set) => (
              <>
                <Field label="Question" value={f.q} onChange={(v) => set({ ...f, q: v })} />
                <Field label="Answer" value={f.a} rows={2} onChange={(v) => set({ ...f, a: v })} />
              </>
            )}
          </Repeater>
        </>
      )}

      {legal && (
        <>
          <div className="space-y-4">
            <Field label="Title" value={legal.title} onChange={(v) => setLegal({ ...legal, title: v })} />
            <Field label="Last updated" value={legal.updated} onChange={(v) => setLegal({ ...legal, updated: v })} hint="For example 5 November 2026." />
            <Field label="Introduction" value={legal.intro} rows={3} onChange={(v) => setLegal({ ...legal, intro: v })} />
          </div>
          <Repeater
            title="Sections"
            items={legal.sections}
            onChange={(sections) => setLegal({ ...legal, sections })}
            blank={{ heading: "", paragraphs: "", bullets: "" }}
            addLabel="Add section"
          >
            {(s, set) => (
              <>
                <Field label="Heading" value={s.heading} onChange={(v) => set({ ...s, heading: v })} />
                <Field label="Text" value={s.paragraphs} rows={6} onChange={(v) => set({ ...s, paragraphs: v })} hint="Leave a blank line between paragraphs." />
                <Field label="List (optional)" value={s.bullets} rows={3} onChange={(v) => set({ ...s, bullets: v })} hint="One bullet per line." />
              </>
            )}
          </Repeater>
        </>
      )}

      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-4 border-t border-border bg-bg px-1 py-4">
        <button onClick={save} disabled={pending} className="bg-accent px-5 py-2.5 text-sm font-medium text-on-accent hover:opacity-90 disabled:opacity-60">
          {pending ? "Saving…" : "Save changes"}
        </button>
        {props.customised && (
          <button onClick={reset} disabled={pending} className="text-sm text-muted hover:text-error">
            Reset to built-in text
          </button>
        )}
        {message && <p className={`text-sm ${message.error ? "text-error" : "text-muted"}`}>{message.text}</p>}
      </div>
    </div>
  );
}
