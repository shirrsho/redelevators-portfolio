"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { FOOT, MARKETS, NAME, BYLINE, PLACEHOLDER } from "./config";
import { Mark, ReaIcon } from "./icons";
import { Markdown } from "./Markdown";
import { MessageView, openBooking } from "./Message";
import { clearSpotlight } from "./spotlight";
import { close, ensureWelcome, newChat, retry, send, setDraft, setHalf, setWide, talkToPerson, useAssistant, type Plan } from "./store";
import { mountTurnstile, unmountTurnstile } from "./turnstile";

// The panel: a side panel on desktop, a bottom sheet on phones (decided 18 Oct), or `inline` inside the
// /ask page. Header (AI badge, "Talk to a person"), "Your plan", the conversation, the composer.

const PAUSED = "Our assistant is taking a short break. You can [book a free 30-minute call](https://redelevators.com/contact) or email contact@redelevators.com, and the team will get back to you.";
const UNREACHABLE = "The assistant can’t be reached right now. You can [book a free 30-minute call](https://redelevators.com/contact) or email contact@redelevators.com.";

export default function Panel({ inline = false }: { inline?: boolean }) {
  const s = useAssistant();
  const log = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const ts = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  /** What had focus before the panel opened: focus goes back there when it closes. */
  const opener = useRef<HTMLElement | null>(null);
  const shown = inline || s.open;
  // Phones show a full-height sheet over the page (a modal); desktop shows a side panel next to it.
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width:700px)");
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (shown) ensureWelcome();
  }, [shown]);

  // Turnstile, ready before the first message of a conversation.
  const sitekey = s.config?.enabled ? s.config.turnstile_sitekey : null;
  useEffect(() => {
    const el = ts.current;
    if (!el || !sitekey || !shown) return;
    void mountTurnstile(el, sitekey);
    return () => unmountTurnstile(el);
  }, [sitekey, shown]);

  // Opening: desktop focuses the composer; phones focus the sheet itself (no keyboard popping over it), so keyboard
  // and screen-reader users land inside. Closing: focus goes back to whatever opened the panel.
  useEffect(() => {
    if (inline) return;
    if (s.open) {
      const was = document.activeElement;
      opener.current = was instanceof HTMLElement && was !== document.body && !panel.current?.contains(was) ? was : null;
      const t = setTimeout(() => {
        if (matchMedia("(max-width:700px)").matches) panel.current?.focus({ preventScroll: true });
        else input.current?.focus({ preventScroll: true });
      }, 320);
      return () => clearTimeout(t);
    }
    clearSpotlight();
    const back = opener.current;
    opener.current = null;
    const now = document.activeElement;
    if (back?.isConnected && (!now || now === document.body || panel.current?.contains(now))) back.focus({ preventScroll: true });
  }, [s.open, inline]);

  // Phones: lock the page under the full sheet (not the half sheet, which shows the page).
  useEffect(() => {
    if (inline) return;
    const lock = s.open && !s.half;
    document.documentElement.classList.toggle("rea-open", s.open);
    document.documentElement.classList.toggle("rea-lock", lock);
    return () => document.documentElement.classList.remove("rea-open", "rea-lock");
  }, [s.open, s.half, inline]);

  // Scrolling: follow a new reply until its top reaches the top of the log, then let the visitor read.
  const last = s.messages[s.messages.length - 1];
  const lastLen = last ? (last.role === "ai" ? last.text.length + last.cards.length * 1000 + (last.status?.length ?? 0) : last.text.length) : 0;
  // Scrolling up while a reply streams stops the follow; a new message starts it again.
  const follow = useRef({ on: true, count: 0 });
  useLayoutEffect(() => {
    const el = log.current;
    if (!el || !last) return;
    if (follow.current.count !== s.messages.length) follow.current = { on: true, count: s.messages.length };
    const node = el.lastElementChild as HTMLElement | null;
    if (!node) return;
    if (last.role !== "ai") {
      el.scrollTop = el.scrollHeight;
      return;
    }
    if (!follow.current.on) return;
    const target = Math.min(el.scrollHeight - el.clientHeight, node.offsetTop - 12);
    if (el.scrollTop < target) el.scrollTop = target;
  }, [s.messages.length, lastLen, last]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (s.busy) return; // a disabled button doesn't stop Enter (WIDGET.md rule 1)
    void send(s.draft);
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };
  // Grow the composer with its text, up to five lines.
  useLayoutEffect(() => {
    const ta = input.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [s.draft]);

  const paused = s.config && !s.config.enabled;
  const latestAi = [...s.messages].reverse().find((m) => m.role === "ai")?.id;

  return (
    // rr-block: Umami's recorder (rrweb) records this panel as an empty box, so chats and typed contact details never
    // end up in session replays.
    <div className={`rea-root rr-block${shown ? " open" : ""}${s.half ? " half" : ""}${s.wide && !inline ? " wide" : ""}${inline ? " inline" : ""}`}>
      {inline ? null : <div className="rea-backdrop" onClick={close} />}
      <section
        className="rea-panel"
        id="rea-panel"
        ref={panel}
        tabIndex={-1}
        role={inline ? "region" : "dialog"}
        aria-modal={!inline && phone && !s.half ? true : undefined}
        aria-label="Red Elevators assistant"
        aria-hidden={!shown}
        inert={!shown}
      >
        {inline ? null : <button type="button" className="rea-grab" aria-label={s.half ? "Expand the assistant" : "Shrink the assistant"} onClick={() => setHalf(!s.half)} />}
        <header className="rea-hd">
          <Mark />
          <div className="rea-hd-txt">
            <div className="rea-name">
              {NAME} <span className="rea-badge">AI</span>
            </div>
            <div className="rea-sub">
              {BYLINE}
              {s.config?.demo ? (
                <span className="rea-badge demo" title="Scripted demo replies (local only), not Claude">
                  DEMO
                </span>
              ) : null}
            </div>
          </div>
          <button type="button" className="rea-hd-btn" onClick={talkToPerson}>
            <ReaIcon name="person" />
            <span className="rea-lbl">Talk to a person</span>
          </button>
          {inline ? null : (
            <button
              type="button"
              className="rea-icon-btn rea-size"
              aria-pressed={s.wide}
              aria-label={s.wide ? "Make the chat smaller" : "Make the chat bigger"}
              title={s.wide ? "Smaller chat" : "Bigger chat"}
              onClick={() => setWide(!s.wide)}
            >
              <ReaIcon name={s.wide ? "shrink" : "expand"} />
            </button>
          )}
          {inline ? null : (
            <button type="button" className="rea-icon-btn rea-close" aria-label="Close assistant" onClick={close}>
              <ReaIcon name="close" />
            </button>
          )}
        </header>

        <PlanLine plan={s.plan} />

        <div
          className="rea-log"
          ref={log}
          aria-live="polite"
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.scrollHeight - el.scrollTop - el.clientHeight > 80 && last?.role === "ai" && last.streaming) follow.current.on = false;
          }}
        >
          {s.messages.map((m) => (
            <MessageView key={m.id} m={m} latest={m.id === latestAi && m === last} inline={inline} />
          ))}
          {paused ? (
            <div className="rea-note info" role="status">
              <Markdown text={PAUSED} onBooking={openBooking} />
            </div>
          ) : null}
          {s.configError ? (
            <div className="rea-note warn" role="alert">
              <Markdown text={UNREACHABLE} onBooking={openBooking} />
            </div>
          ) : null}
        </div>

        {s.failed ? (
          <div className="rea-err" role="alert">
            <ReaIcon name="warn" />
            <span>{s.failed.message}</span>
            <button type="button" onClick={retry} disabled={s.busy}>
              Try again
            </button>
          </div>
        ) : null}

        <div className="rea-ts" ref={ts} />

        <div className="rea-cmp">
          {paused || s.configError ? null : s.ended ? (
            <button type="button" className="rea-btn ai full" onClick={newChat}>
              <ReaIcon name="refresh" />
              Start a new chat
            </button>
          ) : (
            <form className="rea-box" onSubmit={submit}>
              <label className="rea-sr" htmlFor={inline ? "rea-input-inline" : "rea-input"}>
                Message
              </label>
              <textarea
                id={inline ? "rea-input-inline" : "rea-input"}
                ref={input}
                rows={1}
                maxLength={2000}
                placeholder={PLACEHOLDER}
                value={s.draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKey}
                enterKeyHint="send"
              />
              <button className="rea-send" type="submit" aria-label="Send" disabled={!s.draft.trim() || s.busy}>
                <ReaIcon name="send" />
              </button>
            </form>
          )}
          <div className="rea-foot">
            <span className="rea-foot-l">
              <span className="rea-foot-txt">{FOOT} </span>
              <Link href="/privacy">Privacy</Link>
            </span>
            <button type="button" onClick={newChat} disabled={s.busy}>
              Start over
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---- "Your plan" -------------------------------------------------------------------------------------

function PlanLine({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  const q = plan.quote;
  const cur = plan.currency ?? q?.currency;
  const market = plan.market ? MARKETS.find((m) => m.key === plan.market)!.label : "";
  const rows: [string, string][] = [
    ["Units", plan.units ? String(plan.units) : ""],
    ["Market", market],
    ["Tools", plan.tools?.join(", ") ?? ""],
    ["Start with", q ? q.systems.map((x) => x.title).join(" + ") : ""],
    ["Price", q && cur ? `${q.prices[cur].monthly} / month + ${q.prices[cur].setup} setup` : ""],
  ];
  const filled = rows.filter((r) => r[1]).length;
  const summary = q && cur ? [`${q.units} units`, market, q.systems.map((x) => x.title).join(" + "), `${q.prices[cur].monthly}/mo`].filter(Boolean).join(" · ") : rows.filter((r) => r[1]).map((r) => r[1]).join(" · ");
  return (
    <div className={`rea-plan${open ? " expanded" : ""}`}>
      <button type="button" className="rea-plan-hd" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="t">Your plan</span>
        <span className={`s${filled ? "" : " empty"}`}>{filled ? summary : "Builds here as we talk"}</span>
        <span className="rea-steps" aria-label={`${filled} of 5 filled`}>
          {rows.map((r) => (
            <i key={r[0]} className={r[1] ? "on" : undefined} />
          ))}
        </span>
        <span className="rea-chev">
          <ReaIcon name="chev" />
        </span>
      </button>
      {open ? (
        <div className="rea-plan-body">
          <dl>
            {rows.map(([k, v]) => (
              <div key={k} className="rea-plan-row">
                <dt>{k}</dt>
                <dd className={v ? undefined : "empty"}>{v || "Not yet"}</dd>
              </div>
            ))}
          </dl>
          {q ? (
            <div className="rea-plan-acts">
              <button type="button" className="rea-btn book" onClick={openBooking}>
                <ReaIcon name="cal" />
                Book with this plan
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
