import { IMPRESSUM, PRIVACY, TERMS } from "./legal";
import type { ContentKey, HomeContent, PricingContent } from "./types";
import type { LegalDocument } from "./legal";

export const HOME: HomeContent = {
  headline: "Train your ear for real German.",
  intro:
    "Speak aloud, read the world around you and rehearse everyday situations at your own level. LinguaEar answers each time with clear, patient feedback.",
  features: [
    { title: "Say it in German", text: "Speak naturally and receive a transcript, a word-by-word breakdown, the tone, grammar notes and a short quiz." },
    { title: "Camera translator", text: "Photograph a sign or a menu, crop the part you want and read the translation with its nouns explained." },
    { title: "Real-life scenarios", text: "Practise the Ausländerbehörde, a café, the doctor or a job interview. New situations are added regularly." },
    { title: "Gender marks", text: "Each noun is marked by its article, so that der, die and das are remembered by sight." },
    { title: "Word builder", text: "Long compound words are divided into their parts, showing how German builds its vocabulary." },
    { title: "Progress and history", text: "Earn points for correct answers, move up a level, and keep the phrases you want to review." },
  ],
  levels: [
    { name: "Beginner", cefr: "A1–A2", text: "Short, simple sentences at a slow pace, with a gentle second try when you are stuck." },
    { name: "Intermediate", cefr: "B1", text: "Natural everyday German with follow-up questions and the occasional complication." },
    { name: "Professional", cefr: "B2–C1", text: "Formal, precise German with idioms, official wording and realistic objections." },
  ],
};

export const PRICING: PricingContent = {
  intro: "Start with seven days free, then choose the plan that fits how much you practise.",
  plans: [
    {
      name: "Standard",
      price: "4.99 €",
      blurb: "Everything you need to practise every day.",
      items: ["20 phrase analyses a day", "10 camera scans a day", "30 scenario replies a day", "100 saved phrases"],
    },
    {
      name: "Pro",
      price: "9.99 €",
      blurb: "For learners who practise a lot.",
      items: ["60 phrase analyses a day", "30 camera scans a day", "90 scenario replies a day", "500 saved phrases"],
    },
  ],
  faq: [
    { q: "How does the free trial work?", a: "Every new account gets 7 days of Standard for free. No card is needed to start." },
    { q: "Can I change or cancel?", a: "Yes. Manage or cancel your plan in the app at any time; it stays active until the period ends." },
    { q: "What happens to my limits?", a: "Limits reset every day at 00:00 UTC. Pro raises every limit." },
  ],
};

export const DEFAULTS: { home: HomeContent; pricing: PricingContent; terms: LegalDocument; privacy: LegalDocument; impressum: LegalDocument } = {
  home: HOME,
  pricing: PRICING,
  terms: TERMS,
  privacy: PRIVACY,
  impressum: IMPRESSUM,
};

export const defaultFor = <K extends ContentKey>(key: K) => DEFAULTS[key];
