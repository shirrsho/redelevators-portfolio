import { ASSISTANT_URL } from "./config";
import type { Currency } from "@/lib/pricing";
import type { ServiceSlug } from "@/lib/services";

// The assistant API (redelevators-assistant/docs/WIDGET.md). Replies stream as server-sent events over a
// POST, so they're read with fetch + a reader (EventSource can't POST).

export type Config = { turnstile_sitekey: string; enabled: boolean; demo: boolean; email_plan: boolean };

type Priced = { monthly: string; setup: string; founding_setup: string | null; ad_min: string | null; lines: { label: string; setup: string; monthly: string }[] };
export type QuoteCard = {
  kind: "quote";
  plan: string;
  systems: { slug: ServiceSlug; title: string }[];
  units: number;
  portfolio: boolean;
  currency: Currency;
  prices: Record<Currency, Priced>;
  guarantee_days: number;
  href: string;
};
export type DetailField = "units" | "market" | "tools";
/** A card drawn under a reply. The server's kinds, plus local ones the widget adds itself. */
export type Card =
  | { kind: "replies"; replies: string[] }
  | { kind: "details"; fields: DetailField[] }
  | { kind: "booking"; notes: string }
  | { kind: "show_me"; target: "plan_builder" | "savings_calculator"; href: string; label: string }
  | QuoteCard
  | { kind: "handoff"; reply_time: string }
  // local
  | { kind: "person" }
  | { kind: "booked"; when: { d: string; t: string } | null }
  | { kind: "email_plan" };

export type StreamEvent =
  | { event: "start"; data: { conversation_id: string } }
  | { event: "status"; data: { text: string } }
  | { event: "delta"; data: { text: string } }
  | { event: "ui"; data: Card }
  | { event: "sources"; data: { titles: string[] } }
  | { event: "done"; data: { saved: boolean; reply_seq: number | null } }
  | { event: "error"; data: { code: string; message: string } };

/** A refusal before any reply (JSON with an HTTP error status). `detail` is safe to show as-is. */
export class Refused extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    detail: string,
  ) {
    super(detail);
  }
}

const post = (path: string, body: unknown, signal?: AbortSignal) =>
  fetch(`${ASSISTANT_URL}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal });

async function refusal(res: Response): Promise<Refused> {
  let body: { error?: string; detail?: string } = {};
  try {
    body = await res.json();
  } catch {}
  return new Refused(res.status, body.error ?? "unavailable", body.detail ?? "Something went wrong on our side. Please try again in a moment.");
}

export async function getConfig(): Promise<Config> {
  const res = await fetch(`${ASSISTANT_URL}/api/config`, { cache: "no-store" });
  if (!res.ok) throw await refusal(res);
  const c = (await res.json()) as Partial<Config>;
  return { turnstile_sitekey: c.turnstile_sitekey ?? "", enabled: c.enabled === true, demo: c.demo === true, email_plan: c.email_plan === true };
}

export type ChatRequest = { message: string; conversation_id?: string; turnstile_token?: string; page?: string; ref?: string };

/** Sends one message and calls `on` for every event, in order. Throws Refused, or a TypeError on network loss. */
export async function chat(req: ChatRequest, on: (e: StreamEvent) => void, signal?: AbortSignal): Promise<void> {
  const res = await post("/api/chat", req, signal);
  if (!res.ok || !res.body) throw await refusal(res);
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let cut;
    while ((cut = buffer.indexOf("\n\n")) !== -1) {
      const raw = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);
      const event = /^event: (.*)$/m.exec(raw)?.[1];
      const data = /^data: (.*)$/m.exec(raw)?.[1];
      if (!event || data === undefined) continue;
      try {
        on({ event, data: JSON.parse(data) } as StreamEvent);
      } catch (err) {
        console.error("assistant: bad event", event, err);
      }
    }
  }
}

export async function rate(conversation_id: string, seq: number, rating: "up" | "down"): Promise<void> {
  const res = await post("/api/feedback", { conversation_id, seq, rating });
  if (!res.ok) throw await refusal(res);
}

export async function booked(conversation_id: string): Promise<void> {
  await post("/api/booked", { conversation_id }).catch(() => {});
}

export type PlanInput = { systems: ServiceSlug[]; units: number; portfolio: boolean; currency: Currency };
export async function emailPlan(conversation_id: string, email: string, plan: PlanInput): Promise<{ demo: boolean }> {
  const res = await post("/api/email-plan", { conversation_id, email, plan });
  if (!res.ok) throw await refusal(res);
  return { demo: (await res.json()).demo === true };
}
