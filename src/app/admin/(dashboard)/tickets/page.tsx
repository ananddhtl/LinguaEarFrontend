import type { Metadata } from "next";

import { PageHeader, Soon } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Support" };

export default function Tickets() {
  return (
    <>
      <PageHeader title="Support" text="Requests learners send from the app." />
      <Soon text="Reading and replying to tickets needs an admin tickets endpoint in the backend. It is the next step." />
    </>
  );
}
