"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CalBooker } from "@/components/interactive/CalBooker";
import { loadBuilderSystems } from "@/components/interactive/PlanBuilder";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { EVENTS, track } from "@/lib/analytics";
import { useCurrency } from "@/lib/currency";
import { CURRENCIES, CURRENCY_LABEL, parsePlan, type Currency } from "@/lib/pricing";
import { EMAIL, whatsappUrl } from "@/lib/site";
import type { Card, DetailField, QuoteCard } from "./api";
import { MARKETS, TOOLS, UNITS_MAX, UNITS_MIN, type Market } from "./config";
import { ReaIcon } from "./icons";
import { addLocal, bookedInChat, getState, sendPlanEmail, setHalf, setPlanCurrency, submitDetails, useAssistant } from "./store";
import { spotlight, waitFor } from "./spotlight";

// The cards drawn under replies. Server cards (api.ts → Card) come from the assistant's display tools;
// "person", "booked" and "email_plan" are added by the widget itself. Colours: indigo = the AI,
// red = booking, green = a person (decided 18 Oct).

const isPhone = () => matchMedia("(max-width:700px)").matches;

/** A short reference for this chat, so the team can find it when the visitor writes on WhatsApp or by email. */
const chatRef = () => getState().conversationId?.slice(0, 8) ?? null;
const personMessage = () => {
  const ref = chatRef();
  return `Hi Red Elevators! I just chatted with your assistant${ref ? ` (chat ${ref})` : ""} and I’d like to talk to a person.`;
};

export function CardView({ card, active, msgId }: { card: Card; active: boolean; msgId: string }) {
  switch (card.kind) {
    case "quote":
      return <QuoteView card={card} />;
    case "details":
      return <DetailsView fields={card.fields} active={active} />;
    case "booking":
      return <BookingView notes={card.notes} msgId={msgId} />;
    case "booked":
      return <BookedView when={card.when} />;
    case "show_me":
      return <ShowMe href={card.href} label={card.label} target={card.target} />;
    case "handoff":
      return <PersonView handedOff replyTime={card.reply_time} />;
    case "person":
      return <PersonView />;
    case "email_plan":
      return <EmailPlanView />;
    case "replies":
      return null; // drawn as chips under the newest reply (Message.tsx)
  }
}

// ---- Price -------------------------------------------------------------------------------------------

function QuoteView({ card }: { card: QuoteCard }) {
  const [cur, setCur] = useState<Currency>(card.currency);
  const emailOn = useAssistant((s) => s.config?.email_plan === true);
  const p = card.prices[cur];
  return (
    <div className="rea-card">
      <div className="rea-row">
        <span className="rea-card-eyebrow">{card.plan}</span>
        <div className="rea-cur" role="group" aria-label="Currency">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              className={c === cur ? "on" : undefined}
              aria-pressed={c === cur}
              onClick={() => {
                setCur(c);
                setPlanCurrency(c);
              }}
            >
              {CURRENCY_LABEL[c].replace(/^[$€] /, "")}
            </button>
          ))}
        </div>
      </div>
      <h4 style={{ marginTop: 10 }}>{card.systems.map((s) => s.title).join(" + ")}</h4>
      <div className="rea-price">
        <strong>{p.monthly}</strong>
        <span>/ month</span>
      </div>
      <div className="rea-setup">+ {p.setup} one-time setup</div>
      <div className="rea-breakdown">
        {p.lines.map((l) => (
          <div key={l.label}>
            <span>{l.label}</span>
            <span>{l.monthly ? `${l.monthly}/mo` : l.setup}</span>
          </div>
        ))}
        <div>
          <span>Units</span>
          <span>{card.units}</span>
        </div>
      </div>
      {p.ad_min ? <p className="rea-perk">Plus ad spend of at least {p.ad_min} a month, paid to Meta or Google directly.</p> : null}
      <div className="rea-perk">
        <ReaIcon name="shield" />
        <span>Live in {card.guarantee_days} days or your first month is free. No lock-in: month to month, 30 days’ notice.</span>
      </div>
      <div className="rea-card-acts">
        <button
          type="button"
          className="rea-btn book"
          onClick={() => {
            track(EVENTS.assistantBook, { from: "quote" });
            addLocal({ kind: "booking", notes: "" }, "Pick a time that works. Your plan goes with the booking, so we can skip the basics.");
          }}
        >
          <ReaIcon name="cal" />
          Book with this plan
        </button>
        {emailOn ? (
          <button type="button" className="rea-btn quiet" onClick={() => addLocal({ kind: "email_plan" }, "Sure. Where should I send it?")}>
            <ReaIcon name="mail" />
            Email me this plan
          </button>
        ) : null}
      </div>
      <p className="rea-fine">Prices exclude applicable taxes. Your call confirms a fixed quote before any work begins.</p>
    </div>
  );
}

// ---- Details (tap to answer) -------------------------------------------------------------------------

function DetailsView({ fields, active }: { fields: DetailField[]; active: boolean }) {
  const plan = useAssistant((s) => s.plan);
  const busy = useAssistant((s) => s.busy);
  const [units, setUnits] = useState(plan.units ?? 5);
  const [market, setMarket] = useState<Market | undefined>(plan.market);
  const [tools, setTools] = useState<string[]>(plan.tools ?? []);
  const [sent, setSent] = useState(false);
  const off = !active || sent || busy;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (off) return;
    setSent(true);
    void submitDetails({
      units: fields.includes("units") ? units : undefined,
      market: fields.includes("market") ? market : undefined,
      tools: fields.includes("tools") ? tools : undefined,
    });
  };
  const clamp = (n: number) => Math.max(UNITS_MIN, Math.min(UNITS_MAX, Math.round(n) || UNITS_MIN));

  return (
    <form className="rea-card plain rea-q" onSubmit={submit} aria-label="Your rentals">
      <fieldset disabled={off}>
        {fields.includes("units") ? (
          <div>
            <span className="lbl" id="rea-units-l">
              How many units do you run?
            </span>
            <div className="rea-units">
              <div className="rea-stepper" role="group" aria-labelledby="rea-units-l">
                <button type="button" aria-label="Fewer units" onClick={() => setUnits((u) => clamp(u - 1))}>
                  −
                </button>
                <input
                  aria-label="Units"
                  inputMode="numeric"
                  value={units}
                  onChange={(e) => setUnits(clamp(Number(e.target.value.replace(/\D/g, ""))))}
                />
                <button type="button" aria-label="More units" onClick={() => setUnits((u) => clamp(u + 1))}>
                  +
                </button>
              </div>
              <small>The exact count sets the price</small>
            </div>
          </div>
        ) : null}
        {fields.includes("market") ? (
          <div>
            <span className="lbl">Where are they?</span>
            <div className="rea-opts">
              {MARKETS.map((m) => (
                <button key={m.key} type="button" className={`rea-opt${market === m.key ? " on" : ""}`} aria-pressed={market === m.key} onClick={() => setMarket(m.key)}>
                  <ReaIcon name="check" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {fields.includes("tools") ? (
          <div>
            <span className="lbl">
              What do you use today? <span className="rea-dim">Pick any</span>
            </span>
            <div className="rea-opts">
              {TOOLS.map((t) => {
                const on = tools.includes(t);
                return (
                  <button key={t} type="button" className={`rea-opt${on ? " on" : ""}`} aria-pressed={on} onClick={() => setTools((x) => (on ? x.filter((y) => y !== t) : [...x, t]))}>
                    <ReaIcon name="check" />
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
        <button type="submit" className="rea-btn ai full">
          {sent ? "Sent" : fields.includes("units") ? "Show my price" : "Send"}
        </button>
      </fieldset>
    </form>
  );
}

// ---- Booking (the real Cal.com booker, inside the chat) ------------------------------------------------

function bookingNotes(extra: string): string {
  const { plan } = getState();
  const q = plan.quote;
  const lines = [extra];
  const cur = plan.currency ?? q?.currency;
  if (q && cur) lines.push(`${q.plan}: ${q.systems.map((s) => s.title).join(" + ")}, ${q.units} units, ${q.prices[cur].monthly}/month + ${q.prices[cur].setup} setup (quoted by the website assistant, excl. taxes).`);
  else if (plan.units) lines.push(`${plan.units} units.`);
  if (plan.market) lines.push(`Market: ${MARKETS.find((m) => m.key === plan.market)!.label}.`);
  if (plan.tools?.length) lines.push(`Tools: ${plan.tools.join(", ")}.`);
  const ref = chatRef();
  if (ref) lines.push(`Assistant chat: ${ref}`);
  return lines.filter(Boolean).join(" ");
}

/** The newest message with a booking card: only it mounts a booker (each is ~1 MB, and one Cal namespace each). */
const newestBooking = (s: ReturnType<typeof getState>) =>
  [...s.messages].reverse().find((m) => m.role === "ai" && m.cards.some((c) => c.kind === "booking"))?.id;

function BookingView({ notes, msgId }: { notes: string; msgId: string }) {
  const booked = useAssistant((s) => s.booked);
  const newest = useAssistant(newestBooking) === msgId;
  const [extra] = useState(() => bookingNotes(notes));
  const q = useAssistant((s) => s.plan.quote);
  const cur = useAssistant((s) => s.plan.currency) ?? q?.currency;
  return (
    <div className="rea-card rea-cal">
      <span className="rea-card-eyebrow">Free · 30 min · Google Meet</span>
      <h4 style={{ marginTop: 4 }}>Rental systems call</h4>
      {q ? (
        <div className="rea-attached">
          Goes with your booking: <b>{`${q.units} units · ${q.systems.map((s) => s.title).join(" + ")} · ${q.prices[cur ?? q.currency].monthly}/mo`}</b>. We’ll skip the basics on the call.
        </div>
      ) : null}
      {booked ? (
        <p className="rea-done">
          <ReaIcon name="check" />
          Booked. The details are below and in your email.
        </p>
      ) : newest ? (
        <div className="rea-cal-frame">
          <CalBooker location="assistant" namespace={`assistant-${msgId}`} notes={extra} onBooked={bookedInChat} />
        </div>
      ) : (
        <p className="rea-small">The calendar is open further down the chat.</p>
      )}
      <p className="rea-fine">Times are shown in your time zone. You get an email invite and reminders.</p>
    </div>
  );
}

function BookedView({ when }: { when: { d: string; t: string } | null }) {
  return (
    <div className="rea-card plain">
      <div className="rea-ok">
        <span className="rea-ok-ico">
          <ReaIcon name="check" />
        </span>
        <div>
          <h4>You’re booked</h4>
          <p className="rea-small">{when ? `${when.d} · ${when.t} · Google Meet` : "Google Meet · the invite is in your email"}</p>
        </div>
      </div>
      <ol className="rea-next">
        <li>
          <span>
            <b>Right away</b>Your invite and Meet link, by email
          </span>
        </li>
        <li>
          <span>
            <b>Before the call</b>A short reminder
          </span>
        </li>
        <li>
          <span>
            <b>The call · 30 minutes</b>We map your setup, starting from your plan
          </span>
        </li>
        <li>
          <span>
            <b>Within a day</b>Your written plan, yours to keep
          </span>
        </li>
      </ol>
    </div>
  );
}

// ---- A person (green) ------------------------------------------------------------------------------

function PersonView({ handedOff, replyTime }: { handedOff?: boolean; replyTime?: string }) {
  return (
    <div className="rea-card person">
      <div className="rea-ok">
        <span className="rea-person-ico">
          <ReaIcon name="person" />
        </span>
        <div>
          <span className="rea-status">
            <i />
            {handedOff ? "With our team" : "A real person"}
          </span>
          <h4 style={{ marginTop: 6 }}>{handedOff ? "A person will reply" : "Talk to our team"}</h4>
          <p className="rea-small">
            {handedOff
              ? `By email, ${replyTime ?? "soon"}. They have our chat, so you won’t repeat yourself.`
              : "WhatsApp is quickest. Or tell me your name and email here, and the team will email you with our chat in hand."}
          </p>
        </div>
      </div>
      <div className="rea-card-acts">
        <a className="rea-btn wa" href={whatsappUrl(personMessage())} target="_blank" rel="noopener noreferrer" onClick={() => track(EVENTS.whatsappClick, { location: "assistant" })}>
          <ToolLogo name="WhatsApp" size={16} mono />
          {handedOff ? "WhatsApp instead" : "Continue on WhatsApp"}
        </a>
        <a className="rea-btn quiet" href={`mailto:${EMAIL}?subject=${encodeURIComponent("Question for Red Elevators")}&body=${encodeURIComponent(personMessage())}`}>
          <ReaIcon name="mail" />
          Email us
        </a>
      </div>
    </div>
  );
}

// ---- Email my plan -------------------------------------------------------------------------------------

function EmailPlanView() {
  const sentBefore = useAssistant((s) => s.emailSent);
  const q = useAssistant((s) => s.plan.quote);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ status: "idle" | "sending" | "sent" | "error"; message?: string; demo?: boolean }>({ status: sentBefore ? "sent" : "idle" });
  if (!q) return null;
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.status === "sending" || state.status === "sent") return;
    setState({ status: "sending" });
    const r = await sendPlanEmail(email);
    setState(r.ok ? { status: "sent", demo: r.demo } : { status: "error", message: r.message });
  };
  return (
    <form className="rea-card plain" onSubmit={submit}>
      <span className="rea-card-eyebrow">Your plan, by email</span>
      <p className="rea-small" style={{ marginTop: 6 }}>
        {q.plan}: {q.systems.map((s) => s.title).join(" + ")}, {q.units} units, with the price breakdown and a link to book when you’re ready.
      </p>
      {state.status === "sent" ? (
        <p className="rea-done">
          <ReaIcon name="check" />
          {state.demo ? "Sent (demo: no email actually goes out)." : "Sent. It should reach your inbox in a minute."}
        </p>
      ) : (
        <>
          <div className="rea-fields">
            <input className="rea-field" type="email" required autoComplete="email" placeholder="you@company.com" aria-label="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {state.status === "error" ? (
            <p className="rea-fine rea-warn" role="alert">
              {state.message}
            </p>
          ) : null}
          <button type="submit" className="rea-btn ai full" style={{ marginTop: 10 }} disabled={state.status === "sending"}>
            <ReaIcon name="mail" />
            {state.status === "sending" ? "Sending…" : "Send my plan"}
          </button>
        </>
      )}
      <p className="rea-fine">
        We send it once. No newsletter. <Link href="/privacy">Privacy</Link>
      </p>
    </form>
  );
}

// ---- Show me -----------------------------------------------------------------------------------------

const SELECTOR = { plan_builder: "#builder", savings_calculator: "#calculator" } as const;
const SPOT_LABEL = { plan_builder: "Your plan, in the plan builder", savings_calculator: "Move the sliders to match your business" } as const;

function ShowMe({ href, label, target }: { href: string; label: string; target: keyof typeof SELECTOR }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setCur } = useCurrency();
  const show = async () => {
    track(EVENTS.assistantShowMe, { target });
    // The page shows the plan in the currency we've been talking in.
    const chat = getState().plan;
    const cur = chat.currency ?? chat.quote?.currency;
    if (cur) setCur(cur);
    const url = new URL(href, location.origin);
    const plan = parsePlan(url.search);
    const phone = isPhone();
    if (phone) setHalf(true);
    if (url.pathname === pathname) {
      if (target === "plan_builder" && plan.slugs) loadBuilderSystems({ slugs: plan.slugs, units: plan.units ?? 5, portfolio: !!plan.portfolio });
    } else {
      // The builder reads the plan from the URL when it mounts.
      router.push(url.pathname + url.search, { scroll: false });
    }
    const el = await waitFor(SELECTOR[target]);
    if (el) setTimeout(() => spotlight(el, SPOT_LABEL[target], { phone }), url.pathname === pathname ? 250 : 600);
  };
  return (
    <button type="button" className="rea-showme" onClick={show}>
      <ReaIcon name="eye" />
      {label}
    </button>
  );
}
