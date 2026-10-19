"use client";

import { useSyncExternalStore } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { booked as postBooked, chat, emailPlan as postEmailPlan, getConfig, rate, Refused, type Card, type Config, type QuoteCard, type StreamEvent } from "./api";
import type { Currency } from "@/lib/pricing";
import { MARKETS, type Market } from "./config";
import { resetTurnstile, turnstileToken } from "./turnstile";

// One conversation per tab, shared by every entry point (nav button, ask bar, page starters, /ask).
// A tiny external store (useSyncExternalStore), kept in sessionStorage so it survives reloads and pages.
//
// The rules from WIDGET.md live here: one message at a time (`busy` guards send() itself, not just the
// button), a new conversation's id is adopted only on `done` with saved: true, a reply that errors is
// removed, and refusals before a reply show the server's `detail`.

export type AiMsg = {
  id: string;
  role: "ai";
  text: string;
  /** What a tool is doing ("Working out your quote…"), until text arrives. */
  status?: string;
  cards: Card[];
  sources: string[];
  /** The reply's message seq on the server: what 👍/👎 rates. */
  seq?: number | null;
  streaming?: boolean;
  rating?: "up" | "down";
  /** The welcome message (drawn with the page's starter questions). */
  welcome?: boolean;
};
export type Msg =
  | AiMsg
  | { id: string; role: "me"; text: string; failed?: boolean }
  /** A notice from the widget or the server (paused, limits): never sent to the assistant. */
  | { id: string; role: "note"; text: string; tone: "info" | "warn" };

export type Plan = { units?: number; market?: Market; tools?: string[]; quote?: QuoteCard; /** The price card's currency switch. */ currency?: Currency };

export type State = {
  hydrated: boolean;
  /** The call was booked from the chat: bookers stay closed. */
  booked: boolean;
  open: boolean;
  /** Phones: the sheet drops to half height so the page shows ("Show me"). */
  half: boolean;
  /** Desktop: the bigger panel. A per-browser preference (localStorage), not part of the chat. */
  wide: boolean;
  /** Where the panel was opened from (analytics). */
  source: string;
  config: Config | null;
  configError: boolean;
  conversationId: string | null;
  messages: Msg[];
  busy: boolean;
  /** The composer's text, so a refused message can be put back. */
  draft: string;
  /** "Connection lost" bar: the message that didn't go, and why. */
  failed: { text: string; message: string } | null;
  /** 20 messages reached: only "New chat" from here. */
  ended: boolean;
  plan: Plan;
  /** Sales link sender (/ask?from=). */
  referrer: string | null;
  emailSent: boolean;
};

const INITIAL: State = {
  hydrated: false,
  booked: false,
  open: false,
  half: false,
  wide: false,
  source: "",
  config: null,
  configError: false,
  conversationId: null,
  messages: [],
  busy: false,
  draft: "",
  failed: null,
  ended: false,
  plan: {},
  referrer: null,
  emailSent: false,
};

let state = INITIAL;
const listeners = new Set<() => void>();
const KEY = "rea:chat:v1";

function set(patch: Partial<State> | ((s: State) => Partial<State>)) {
  state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
  listeners.forEach((l) => l());
  persist();
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const getState = () => state;

export function useAssistant(): State;
export function useAssistant<T>(pick: (s: State) => T): T;
export function useAssistant<T>(pick?: (s: State) => T) {
  const get = () => (pick ? pick(state) : state);
  const server = () => (pick ? pick(INITIAL) : INITIAL);
  return useSyncExternalStore(subscribe, get, server);
}

// ---- Persistence (sessionStorage: this tab only) ---------------------------------------------------

let saveTimer: ReturnType<typeof setTimeout> | undefined;
function persist() {
  if (!state.hydrated) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const { conversationId, messages, plan, open, referrer, ended, emailSent, booked } = state;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ conversationId, messages: messages.filter((m) => !(m.role === "ai" && m.streaming)), plan, open, referrer, ended, emailSent, booked }));
    } catch {}
  }, 150);
}

/** Reads the saved chat once, after mount (never during render: no hydration mismatch). */
export function hydrate(opts: { reopen: boolean }) {
  if (state.hydrated) return;
  let saved: Partial<State> = {};
  let wide = false;
  try {
    saved = JSON.parse(sessionStorage.getItem(KEY) ?? "{}") ?? {};
    wide = localStorage.getItem(WIDE_KEY) === "1";
  } catch {}
  set({
    hydrated: true,
    conversationId: typeof saved.conversationId === "string" ? saved.conversationId : null,
    messages: Array.isArray(saved.messages) ? saved.messages : [],
    plan: saved.plan ?? {},
    referrer: saved.referrer ?? null,
    ended: saved.ended === true,
    emailSent: saved.emailSent === true,
    booked: saved.booked === true,
    wide,
  });
  if (opts.reopen && saved.open) open("restore");
}

// ---- Opening ----------------------------------------------------------------------------------------

let configLoad: Promise<void> | null = null;
function loadConfig() {
  configLoad ??= getConfig()
    .then((config) => set({ config, configError: false }))
    .catch(() => {
      configLoad = null;
      set({ configError: true });
    });
  return configLoad;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function open(source = "button") {
  if (!state.hydrated) hydrate({ reopen: false });
  void loadConfig();
  if (state.open) return;
  set({ open: true, source });
  if (source !== "restore") track(EVENTS.assistantOpen, { location: source });
}
export function close() {
  set({ open: false, half: false });
}
export const toggle = (source?: string) => (state.open ? close() : open(source));
export const setHalf = (half: boolean) => set({ half });

const WIDE_KEY = "rea:wide";
/** The bigger chat on desktop; remembered in this browser. */
export function setWide(wide: boolean) {
  set({ wide });
  try {
    localStorage.setItem(WIDE_KEY, wide ? "1" : "0");
  } catch {}
  track(EVENTS.assistantWide, { wide });
}
export const setDraft = (draft: string) => set({ draft });

/** The sales-link page sets who sent the visitor (stored with a new conversation). */
export function setReferrer(referrer: string | null) {
  if (state.conversationId) return;
  set({ referrer });
}

/** Starts the conversation off with the welcome (once per chat). */
export function ensureWelcome() {
  if (state.messages.length) return;
  set({ messages: [{ id: uid(), role: "ai", text: "", cards: [], sources: [], welcome: true }] });
}

// ---- Sending -------------------------------------------------------------------------------------

const replace = (id: string, fn: (m: Msg) => Msg) => set((s) => ({ messages: s.messages.map((m) => (m.id === id ? fn(m) : m)) }));
const remove = (...ids: string[]) => set((s) => ({ messages: s.messages.filter((m) => !ids.includes(m.id)) }));
const note = (text: string, tone: "info" | "warn" = "info") => set((s) => ({ messages: [...s.messages, { id: uid(), role: "note", text, tone }] }));
const updateAi = (id: string, fn: (m: AiMsg) => Partial<AiMsg>) => replace(id, (m) => (m.role === "ai" ? { ...m, ...fn(m) } : m));

/**
 * Sends one visitor message. Returns false (and does nothing) while a reply is still running: the server
 * saves a turn just before `done`, so the next message must wait (WIDGET.md rule 1).
 */
export async function send(raw: string): Promise<boolean> {
  const text = raw.trim().slice(0, 2000);
  if (!text || state.busy || state.ended) return false;
  // Claim the turn before any await: a second tap while the config loads must not get through.
  set({ busy: true });
  open();
  await loadConfig();
  if (!state.config?.enabled) {
    set({ busy: false });
    return false;
  }
  ensureWelcome();

  const meId = uid();
  const aiId = uid();
  const isNew = !state.conversationId;
  set((s) => ({
    busy: true,
    failed: null,
    draft: "",
    half: false,
    messages: [...s.messages, { id: meId, role: "me", text }, { id: aiId, role: "ai", text: "", cards: [], sources: [], streaming: true }],
  }));
  const turns = state.messages.filter((m) => m.role === "me").length;
  track(EVENTS.assistantMessage, { n: turns });

  const fail = (message: string) => {
    remove(aiId);
    replace(meId, (m) => ({ ...m, failed: true }));
    set({ failed: { text, message } });
  };

  let token: string | undefined;
  if (isNew) {
    token = (await turnstileToken()) ?? undefined;
    if (!token) {
      fail("We couldn’t verify your browser. Check your connection, then try again.");
      set({ busy: false });
      return true;
    }
  }

  let pendingId: string | null = null;
  let finished = false;
  try {
    await chat(
      {
        message: text,
        conversation_id: state.conversationId ?? undefined,
        turnstile_token: token,
        page: location.href,
        ref: isNew ? (state.referrer ?? undefined) : undefined,
      },
      (e: StreamEvent) => {
        switch (e.event) {
          case "start":
            pendingId = e.data.conversation_id;
            break;
          case "status":
            updateAi(aiId, () => ({ status: e.data.text }));
            break;
          case "delta":
            updateAi(aiId, (m) => ({ text: m.text + e.data.text, status: undefined }));
            break;
          case "ui": {
            const card = e.data;
            updateAi(aiId, (m) => ({ cards: [...m.cards, card] }));
            if (card.kind === "quote") set((s) => ({ plan: { ...s.plan, quote: card, units: card.units, currency: card.currency } }));
            if (card.kind === "handoff") track(EVENTS.assistantHandoff);
            break;
          }
          case "sources":
            updateAi(aiId, () => ({ sources: e.data.titles }));
            break;
          case "done":
            finished = true;
            updateAi(aiId, () => ({ streaming: false, status: undefined, seq: e.data.reply_seq }));
            // A new conversation exists only once its first turn is saved.
            if (isNew && e.data.saved && pendingId) set({ conversationId: pendingId });
            break;
          case "error":
            finished = true;
            // The turn wasn't saved: drop the partial reply, show why.
            remove(aiId);
            note(e.data.message, "warn");
            break;
        }
      },
    );
    if (!finished) fail("The connection dropped before the answer finished.");
  } catch (err) {
    if (err instanceof Refused) refused(err, text, meId, aiId);
    else fail("Connection lost. Your message is kept; nothing was sent.");
  } finally {
    // Tokens are single-use, whatever happened.
    if (isNew) resetTurnstile();
    set({ busy: false });
  }
  return true;
}

/** A refusal before any reply (WIDGET.md table). */
function refused(r: Refused, text: string, meId: string, aiId: string) {
  switch (r.code) {
    case "busy":
    case "rate_limited":
    case "invalid_message":
    case "invalid_json":
      // Nothing happened: give the visitor their text back.
      remove(meId, aiId);
      set({ draft: text });
      note(r.message);
      return;
    case "conversation_limit":
      remove(aiId);
      set({ ended: true });
      note(r.message);
      return;
    case "paused":
      remove(aiId);
      note(r.message);
      return;
    case "conversation_not_found":
    case "invalid_conversation_id":
      // Forget it; "Try again" starts a new conversation (with a fresh Turnstile token).
      set({ conversationId: null });
      remove(aiId);
      replace(meId, (m) => ({ ...m, failed: true }));
      set({ failed: { text, message: r.message } });
      return;
    default:
      // verification_failed, unavailable: let them try again.
      remove(aiId);
      replace(meId, (m) => ({ ...m, failed: true }));
      set({ failed: { text, message: r.message } });
  }
}

export function retry() {
  const f = state.failed;
  if (!f || state.busy) return;
  set((s) => ({ failed: null, messages: s.messages.filter((m) => !(m.role === "me" && m.failed && m.text === f.text)) }));
  void send(f.text);
}

export function newChat() {
  if (state.busy) return;
  set({ conversationId: null, messages: [], plan: {}, failed: null, ended: false, emailSent: false, booked: false, half: false });
  ensureWelcome();
}

// ---- Cards -------------------------------------------------------------------------------------------

/** A card the widget adds by itself (no assistant call): talk to a person, booking, booked, email my plan. */
export function addLocal(card: Card, text = "") {
  open();
  ensureWelcome();
  set((s) => ({ half: false, messages: [...s.messages, { id: uid(), role: "ai", text, cards: [card], sources: [] }] }));
}

export const setPlanCurrency = (currency: Currency) => set((s) => ({ plan: { ...s.plan, currency } }));

export function talkToPerson() {
  track(EVENTS.assistantPerson);
  addLocal({ kind: "person" });
}

/** The details card: remember the answers (for "Your plan") and send them as the visitor's message. */
export function submitDetails(d: { units?: number; market?: Market; tools?: string[] }) {
  set((s) => ({ plan: { ...s.plan, ...d } }));
  const parts: string[] = [];
  if (d.units) parts.push(`I run ${d.units} unit${d.units === 1 ? "" : "s"}${d.market ? ` ${MARKETS.find((m) => m.key === d.market)!.phrase}` : ""}.`);
  else if (d.market) parts.push(`My rentals are ${MARKETS.find((m) => m.key === d.market)!.phrase}.`);
  const tools = (d.tools ?? []).filter((t) => t !== "Something else");
  if (tools.includes("Airbnb only")) parts.push("I only use Airbnb, no other tools.");
  else if (tools.length) parts.push(`We use ${tools.join(" and ").replace(/ and (?=.* and )/g, ", ")}.`);
  if ((d.tools ?? []).includes("Something else")) parts.push("We also use other tools.");
  return send(parts.join(" ") || "Here are my details.");
}

export async function rateReply(id: string, rating: "up" | "down") {
  const m = state.messages.find((x) => x.id === id);
  if (!m || m.role !== "ai" || m.seq == null || !state.conversationId) return;
  updateAi(id, () => ({ rating }));
  track(EVENTS.assistantFeedback, { rating });
  try {
    await rate(state.conversationId, m.seq, rating);
  } catch {
    // The rating is a nice-to-have; keep the visitor's tap shown.
  }
}

export function bookedInChat(when: { d: string; t: string } | null) {
  if (state.booked) return;
  set({ booked: true });
  if (state.conversationId) void postBooked(state.conversationId);
  addLocal({ kind: "booked", when }, "Done. Here’s what happens next.");
}

/** "Email me this plan": once per chat; prices are re-quoted by the server. */
export async function sendPlanEmail(email: string): Promise<{ ok: true; demo: boolean } | { ok: false; message: string }> {
  const q = state.plan.quote;
  if (!q || !state.conversationId) return { ok: false, message: "Ask for a quote first, then I can email it." };
  try {
    const currency = state.plan.currency ?? q.currency;
    const r = await postEmailPlan(state.conversationId, email, { systems: q.systems.map((s) => s.slug), units: q.units, portfolio: q.portfolio, currency });
    set({ emailSent: true });
    track(EVENTS.assistantEmailPlan);
    return { ok: true, demo: r.demo };
  } catch (err) {
    return { ok: false, message: err instanceof Refused ? err.message : "Connection lost. Please try again." };
  }
}
