// /ask: the page the team sends after a LinkedIn chat, e.g. redelevators.com/ask?from=nakib (mockup screen
// "Page for sales links"). The assistant, full height, beside a short intro. Not indexed. 404 while the
// assistant is off (NEXT_PUBLIC_ASSISTANT_URL unset).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AskPage } from "@/components/assistant/AskPage";
import { ASSISTANT_ON, SALES_TEAM } from "@/components/assistant/config";
import { PageBg } from "@/components/layout/PageBg";

export const metadata: Metadata = {
  title: "Ask Red Elevators",
  description: "Ask anything about your rentals: prices, tools, timelines, what fits your setup. Answers from what Red Elevators has published, and a person one tap away.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/ask" },
};

export default async function Ask({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!ASSISTANT_ON) notFound();
  const raw = (await searchParams).from;
  const from = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  // Any first name is passed on (it goes in the lead email); only listed team members are shown by name.
  const referrer = /^[a-z]{2,20}$/.test(from) ? from : null;
  return (
    <>
      <PageBg tone="night" />
      <main id="main" className="page">
        <AskPage referrer={referrer} sender={referrer ? (SALES_TEAM[referrer] ?? null) : null} />
      </main>
    </>
  );
}
