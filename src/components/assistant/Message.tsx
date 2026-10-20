"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EVENTS, track } from "@/lib/analytics";
import { CardView } from "./Cards";
import { WELCOME, pageName, salesSender, startersFor, visibleSources } from "./config";
import { Mark, ReaIcon } from "./icons";
import { Markdown } from "./Markdown";
import { addLocal, close, rateReply, send, talkToPerson, useAssistant, type AiMsg, type Msg } from "./store";

const isPhone = () => typeof window !== "undefined" && matchMedia("(max-width:700px)").matches;

/** Opens the booker in the chat (links to /contact in a reply do this, WIDGET.md rule 3). */
export const openBooking = () => {
  track(EVENTS.assistantBook, { from: "link" });
  addLocal({ kind: "booking", notes: "" }, "Pick a time that works. Your plan goes with the booking, so we can skip the basics.");
};
/** On phones the sheet covers the page, so following a site link closes it. */
const onNavigate = () => {
  if (isPhone()) close();
};

export function MessageView({ m, latest, inline }: { m: Msg; latest: boolean; inline?: boolean }) {
  if (m.role === "me")
    return (
      <>
        <div className={`rea-msg me${m.failed ? " failed" : ""}`}>{m.text}</div>
        {m.failed ? (
          <div className="rea-failed-note">
            <ReaIcon name="warn" />
            Not sent
          </div>
        ) : null}
      </>
    );
  if (m.role === "note")
    return (
      <div className={`rea-note ${m.tone}`} role={m.tone === "warn" ? "alert" : "status"}>
        <Markdown text={m.text} onBooking={openBooking} onNavigate={onNavigate} />
      </div>
    );
  return <AiView m={m} latest={latest} inline={inline} />;
}

function AiView({ m, latest, inline }: { m: AiMsg; latest: boolean; inline?: boolean }) {
  const busy = useAssistant((s) => s.busy);
  // A reply can carry several suggestion cards (e.g. one per tool round): show each suggestion once, at most three.
  const replies = [...new Set(m.cards.flatMap((c) => (c.kind === "replies" ? c.replies : [])))].slice(0, 3);
  const sources = m.streaming ? [] : visibleSources(m.sources);
  const thinking = m.streaming && (!m.text || m.status);
  return (
    <div className="rea-msg ai" aria-busy={m.streaming || undefined}>
      <Mark small />
      <div className="rea-body">
        {m.welcome ? <Welcome inline={inline} latest={latest} /> : null}
        {m.text ? (
          <div className="rea-md">
            <Markdown text={m.text} onBooking={openBooking} onNavigate={onNavigate} />
            {m.streaming && !m.status ? <span className="rea-caret" aria-hidden="true" /> : null}
          </div>
        ) : null}
        {thinking ? (
          <div className="rea-think" role="status">
            <span className="rea-dots">
              <i />
              <i />
              <i />
            </span>
            {m.status ? (
              <span>{m.status}</span>
            ) : (
              <span>
                Checking <b>what we’ve published</b>
              </span>
            )}
          </div>
        ) : null}
        {m.cards.map((c, i) => (c.kind === "replies" ? null : <CardView key={i} card={c} active={latest} msgId={m.id} />))}
        {sources.length || (!m.streaming && m.seq != null) ? (
          <div className="rea-src">
            {sources.length ? <span>From</span> : null}
            {sources.map((s) =>
              s.href ? (
                <Link key={s.title} href={s.href} onClick={onNavigate}>
                  <ReaIcon name="doc" />
                  {s.title}
                </Link>
              ) : (
                <span key={s.title} className="rea-src-plain">
                  <ReaIcon name="doc" />
                  {s.title}
                </span>
              ),
            )}
            {m.seq != null ? <Feedback m={m} /> : null}
          </div>
        ) : null}
        {m.rating ? <p className="rea-fb-note">{m.rating === "up" ? "Thanks for letting us know." : "Thanks. A person on our team will review this answer."}</p> : null}
        {latest && !m.streaming && !m.welcome && !busy ? (
          <div className="rea-follow">
            {replies.map((r) => (
              <button key={r} type="button" className="rea-chip" onClick={() => void send(r)}>
                <span>{r}</span>
              </button>
            ))}
            {m.cards.some((c) => c.kind === "person" || c.kind === "handoff") ? null : (
              <button type="button" className="rea-chip person" onClick={talkToPerson}>
                <ReaIcon name="person" />
                <span>Talk to a person</span>
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Feedback({ m }: { m: AiMsg }) {
  return (
    <span className="rea-fb">
      <button type="button" aria-label="Helpful" aria-pressed={m.rating === "up"} className={m.rating === "up" ? "on" : undefined} onClick={() => void rateReply(m.id, "up")}>
        <ReaIcon name="up" />
      </button>
      <button type="button" aria-label="Not helpful" aria-pressed={m.rating === "down"} className={m.rating === "down" ? "on" : undefined} onClick={() => void rateReply(m.id, "down")}>
        <ReaIcon name="down" />
      </button>
    </span>
  );
}

function Welcome({ inline, latest }: { inline?: boolean; latest: boolean }) {
  const path = usePathname();
  const referrer = useAssistant((s) => s.referrer);
  const busy = useAssistant((s) => s.busy);
  const sender = salesSender(referrer) ?? undefined;
  const ask = path === "/ask";
  return (
    <>
      {ask ? <p>{sender ? WELCOME.sales.replace("{name}", sender) : WELCOME.salesGeneric}</p> : <p>{WELCOME.hi}</p>}
      <p>{WELCOME.more}</p>
      {!ask && !inline ? (
        <div className="rea-ctx">
          <i />
          You’re on {pageName(path)}
        </div>
      ) : null}
      {latest && !busy ? (
        <div className="rea-follow starters">
          {startersFor(path).map((q) => (
            <button key={q} type="button" className="rea-chip" onClick={() => void send(q)}>
              <span>{q}</span>
              <ReaIcon name="arrow" />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
