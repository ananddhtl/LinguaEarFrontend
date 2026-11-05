import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentEditor } from "@/components/editor/ContentEditor";
import { PageHeader } from "@/components/PageHeader";
import { DEFAULTS } from "@/content/defaults";
import { CONTENT_LABELS, isContentKey } from "@/content/types";
import type { HomeContent, LegalDocument, PricingContent } from "@/content/types";
import { adminFetch } from "@/lib/adminApi";

type Stored = { key: string; customised: boolean; data: unknown };

export default async function EditContent({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isContentKey(key)) notFound();
  const stored = await adminFetch<Stored>(`/admin/content/${key}`);
  const data = stored.customised ? stored.data : DEFAULTS[key];
  const label = CONTENT_LABELS[key];

  return (
    <>
      <Link href="/admin/content" className="mb-4 inline-block text-sm text-accent hover:underline">
        ← Website content
      </Link>
      <PageHeader title={label.title} text={stored.customised ? "Showing your edited text." : "Showing the built-in text. Saving creates your edited version."} />
      {key === "home" ? (
        <ContentEditor contentKey="home" initial={data as HomeContent} customised={stored.customised} />
      ) : key === "pricing" ? (
        <ContentEditor contentKey="pricing" initial={data as PricingContent} customised={stored.customised} />
      ) : (
        <ContentEditor contentKey={key} initial={data as LegalDocument} customised={stored.customised} />
      )}
    </>
  );
}
