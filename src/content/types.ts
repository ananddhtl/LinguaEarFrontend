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
