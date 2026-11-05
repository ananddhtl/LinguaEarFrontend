export type HomeContent = {
  headline: string;
  intro: string;
  features: { title: string; text: string }[];
  levels: { name: string; cefr: string; text: string }[];
};

export type PricingContent = {
  intro: string;
  plans: { name: string; price: string; blurb: string; items: string[] }[];
  faq: { q: string; a: string }[];
};

export type { LegalDocument } from "./legal";

export type ContentKey = "home" | "pricing" | "terms" | "privacy" | "impressum";

export const CONTENT_LABELS: Record<ContentKey, { title: string; text: string }> = {
  home: { title: "Home page", text: "Headline, introduction, features and levels." },
  pricing: { title: "Pricing", text: "Plans, prices and common questions." },
  terms: { title: "Terms & Conditions", text: "The terms page." },
  privacy: { title: "Privacy Policy", text: "The privacy page." },
  impressum: { title: "Impressum", text: "The legal notice." },
};

export const isContentKey = (k: string): k is ContentKey => k in CONTENT_LABELS;
