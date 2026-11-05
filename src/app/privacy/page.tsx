import type { Metadata } from "next";

import { LegalPage } from "@/components/LegalPage";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default async function Page() {
  return <LegalPage doc={await getContent("privacy")} />;
}
