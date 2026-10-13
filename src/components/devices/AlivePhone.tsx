"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { LockIcons, PhoneClock, PhoneShell, PhoneStatus } from "@/components/devices/PhoneShell";
import { Notification } from "@/components/devices/Notification";
import { MarkSolid } from "@/components/layout/Logo";
import { Icon } from "@/components/ui/Icon";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { useInView } from "@/lib/hooks/useInView";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { EVENTS } from "@/lib/analytics";
import { ALIVE_PHONE, BOOKING_CARD, NUDGE, QUIET, QUIET_BODY } from "@/lib/booking";
import { whatsappUrl } from "@/lib/site";

// The calm phone: alive before booking, reacting while booking (Home ch.09 and /contact).
// Port of redesign-mockups/r3/site.js → mountCalmPhone. The notification stack is the mockup's
// closure (createStack, below); the component only renders it and wires the timers.

export type AlivePhoneStage = "idle" | "started" | "booked";

export type AlivePhoneProps = {
  /** How far the visitor is in the booker. Only moves forward: idle → started → booked. */
  stage: AlivePhoneStage;
  /** The confirmed slot (stage "booked"); omit if unknown. */
  when?: { d: string; t: string } | null;
  /** The idle nudge: "wa" = WhatsApp (Contact), "ask" = "Questions before you book?" → /contact#chat (Home). */
  nudge: "wa" | "ask";
  /** Extra classes on the root `.ph` (BookingStage adds the reveal). */
  className?: string;
};

type Kind = "quiet" | "nudge" | "ghost" | "done";
type Item = { id: number; kind: Kind; ask?: boolean; app: string; title: string; body: string; href?: string; shown: boolean; gone: boolean };
type Snap = { items: Item[]; answered: number; week: number };
type NudgeCfg = { ask: boolean; app: string; title: string; body: string; href: string };

const FADE_MS = 500; // the cards' opacity transition (sections.css), then they're removed
const MAX_VISIBLE = 2;
const WEEK_CAP = 97;

const INITIAL: Snap = { items: [], answered: ALIVE_PHONE.activity.answered, week: ALIVE_PHONE.activity.weekBooked };

// ---- The stack: quiet cards, the pinned booking/nudge card, counters ------------------------
function createStack(hooks: { change: (s: Snap) => void; buzz: () => void; pulse: (id: number) => void }) {
  let items: Item[] = [];
  let answered: number = INITIAL.answered;
  let week: number = INITIAL.week;
  let nextId = 1;
  let qi = 0;
  let pinned: number | null = null; // the booking card or the nudge stays on top until replaced
  let ghost: number | null = null;
  let booked = false;
  let nudged = false;
  let idle: ReturnType<typeof setTimeout> | undefined;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const frames = new Set<number>();

  const emit = () => hooks.change({ items, answered, week });
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.delete(t);
      fn();
    }, ms);
    timers.add(t);
  };
  const patch = (id: number, p: Partial<Item>) => {
    items = items.map((x) => (x.id === id ? { ...x, ...p } : x));
    emit();
  };
  // fade out, then remove
  const drop = (id: number) => {
    patch(id, { shown: false, gone: true });
    later(() => {
      items = items.filter((x) => x.id !== id);
      if (pinned === id) pinned = null;
      emit();
    }, FADE_MS);
  };
  const trim = () => {
    // everything past the newest two goes, except the pinned card
    items.filter((x) => !x.gone).slice(MAX_VISIBLE).forEach((x) => x.id !== pinned && drop(x.id));
  };
  const push = (card: Omit<Item, "id" | "shown" | "gone">, pin = false) => {
    const it: Item = { ...card, id: nextId++, shown: false, gone: false };
    const at = pinned === null ? -1 : items.findIndex((x) => x.id === pinned);
    items = pin || at < 0 ? [it, ...items] : [...items.slice(0, at + 1), it, ...items.slice(at + 1)];
    if (pin) pinned = it.id;
    emit();
    const f = requestAnimationFrame(() => {
      frames.delete(f);
      patch(it.id, { shown: true });
    });
    frames.add(f);
    trim();
    return it.id;
  };

  return {
    /** A quiet, silent "handled" card: the system working while you sleep. */
    quiet() {
      if (booked && Math.random() < 0.5) return;
      const q = QUIET[qi++ % QUIET.length];
      push({ kind: "quiet", app: `✓ ${q[0]}`, title: q[1], body: QUIET_BODY });
      if (q[0] === "Answered") {
        answered += 1;
        emit();
      }
      if (q[0] === "Booked direct" && week < WEEK_CAP) {
        week += 3;
        emit();
      }
    },
    /** Reduced motion: two cards already in place, nothing ticking. */
    seed() {
      if (items.length) return;
      items = QUIET.slice(0, MAX_VISIBLE).map((q) => ({ id: nextId++, kind: "quiet", app: `✓ ${q[0]}`, title: q[1], body: QUIET_BODY, shown: true, gone: false }));
      emit();
    },
    /** Start (or restart) the idle timer; once it fires the nudge is pinned on top. */
    arm(cfg: NudgeCfg, ms: number) {
      clearTimeout(idle);
      if (booked || nudged) return;
      idle = setTimeout(() => {
        nudged = true;
        push({ kind: "nudge", ask: cfg.ask, app: cfg.app, title: cfg.title, body: cfg.body, href: cfg.href }, true);
        hooks.buzz();
      }, ms);
    },
    disarm() {
      clearTimeout(idle);
    },
    /** The "your call" placeholder: created once, then updated in place. */
    ghost(title: string, body: string) {
      if (booked) return;
      if (ghost === null) {
        if (pinned !== null) drop(pinned);
        ghost = push({ kind: "ghost", app: BOOKING_CARD.app, title, body }, true);
      } else {
        patch(ghost, { title, body });
        hooks.pulse(ghost);
      }
    },
    booked(title: string, body: string) {
      booked = true;
      clearTimeout(idle);
      if (ghost !== null) {
        items = items.filter((x) => x.id !== ghost);
        ghost = null;
        pinned = null;
        emit();
      }
      push({ kind: "done", app: BOOKING_CARD.booked.app, title, body }, true);
      hooks.buzz();
    },
    destroy() {
      clearTimeout(idle);
      timers.forEach(clearTimeout);
      frames.forEach(cancelAnimationFrame);
      timers.clear();
      frames.clear();
    },
  };
}
type Stack = ReturnType<typeof createStack>;

// Cal's embed never says which date or time was picked (see CalBooker.tsx), so the mockup's
// "{d} · pick a time" / "{d} · {t}" placeholder becomes one card that names neither.
const STARTED_COPY = { title: "Picking a time", body: BOOKING_CARD.day.bd };

function bookedCopy(when?: { d: string; t: string } | null) {
  const body = when
    ? BOOKING_CARD.booked.bd.replace("{d}", when.d).replace("{t}", when.t)
    : BOOKING_CARD.booked.bd.replace("{d}, {t} · ", "");
  return { title: BOOKING_CARD.booked.tt, body };
}

export function AlivePhone({ stage, when, nudge, className }: AlivePhoneProps) {
  const router = useRouter();
  const holder = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<number, HTMLElement>());
  const stack = useRef<Stack | null>(null);
  const [snap, setSnap] = useState<Snap>(INITIAL);
  // Quiet cards and the idle timer only run while the phone is actually on screen (it is
  // display:none under 1100px, so they never start there).
  const onScreen = useInView(holder, { threshold: 0.4 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const s = createStack({
      change: setSnap,
      buzz: () => {
        const el = phone.current;
        if (!el) return;
        el.classList.remove("buzz");
        void el.offsetWidth;
        el.classList.add("buzz");
      },
      pulse: (id) => {
        const el = cards.current.get(id);
        if (!el) return;
        el.classList.remove("pulse");
        void el.offsetWidth;
        el.classList.add("pulse");
      },
    });
    stack.current = s;
    return () => {
      s.destroy();
      stack.current = null;
    };
  }, []);

  // quiet "handled" cards, every 5.2s
  useEffect(() => {
    if (!onScreen || reduced) return;
    const id = setInterval(() => stack.current?.quiet(), ALIVE_PHONE.quietMs);
    return () => clearInterval(id);
  }, [onScreen, reduced]);

  // reduced motion: the final state, nothing ticking
  useEffect(() => {
    if (reduced) stack.current?.seed();
  }, [reduced]);

  // idle nudge: 12s on screen without engaging; any click or key in the section restarts the clock
  useEffect(() => {
    const s = stack.current;
    if (!s) return;
    if (!onScreen || reduced || stage !== "idle") {
      s.disarm();
      return;
    }
    const cfg: NudgeCfg =
      nudge === "wa"
        ? { ask: false, app: NUDGE.wa.app, title: NUDGE.wa.tt, body: NUDGE.wa.bd, href: whatsappUrl() }
        : { ask: true, app: NUDGE.contact.app, title: NUDGE.contact.tt, body: NUDGE.contact.bd, href: NUDGE.contact.href };
    const arm = () => s.arm(cfg, ALIVE_PHONE.idleMs);
    arm();
    const scope = holder.current?.closest("section, main");
    const events = ["pointerdown", "keydown"] as const;
    events.forEach((ev) => scope?.addEventListener(ev, arm));
    return () => {
      events.forEach((ev) => scope?.removeEventListener(ev, arm));
      s.disarm();
    };
  }, [onScreen, reduced, stage, nudge]);

  // follow the booker
  useEffect(() => {
    const s = stack.current;
    if (!s) return;
    if (stage === "started") s.ghost(STARTED_COPY.title, STARTED_COPY.body);
    else if (stage === "booked") {
      const c = bookedCopy(when);
      s.booked(c.title, c.body);
    }
  }, [stage, when]);

  // The "ask" nudge is an in-site link: keep it client-side. (The WhatsApp one is tracked by its
  // data-umami-event attributes, set in the ref below.)
  const onStackClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>("a.nudge.ask");
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    router.push(NUDGE.contact.href);
  };

  const a = ALIVE_PHONE.activity;
  return (
    <div ref={holder} className={`ph${className ? ` ${className}` : ""}`} role="group" aria-label="Example phone lock screen (illustrative)">
      <PhoneShell ref={phone} className="alive">
        <PhoneStatus time={ALIVE_PHONE.time} />
        <PhoneClock date={ALIVE_PHONE.date} time={ALIVE_PHONE.time} />
        <div className="live">
          <div className="lh">
            <span className="lm">
              <MarkSolid />
            </span>
            <b>{a.title}</b>
            <span className="run">
              <i />
              {a.status}
            </span>
          </div>
          <div className="lr">
            <span>{a.rows[0][0]}</span>
            <b>{snap.answered}</b>
          </div>
          <div className="lr">
            <span>{a.rows[1][0]}</span>
            <b>{a.rows[1][1]}</b>
          </div>
          <div className="lr">
            <span>{a.rows[2][0]}</span>
            <b>{snap.week}% booked</b>
          </div>
          <div className="lbar">
            <i style={{ width: `${snap.week}%` }} />
          </div>
        </div>
        <div className="stack cstack" onClick={onStackClick}>
          {snap.items.map((it) => (
            <Notification
              key={it.id}
              ref={(el) => {
                if (el) {
                  cards.current.set(it.id, el);
                  // Notification takes no data attributes: tag the WhatsApp nudge here, so Umami counts
                  // "WhatsApp click" and the site's outbound-link tracker skips it.
                  if (it.kind === "nudge" && !it.ask) {
                    el.dataset.umamiEvent = EVENTS.whatsappClick;
                    el.dataset.umamiEventLocation = "phone-nudge";
                  }
                }
                else cards.current.delete(it.id);
              }}
              className={`${it.kind}${it.ask ? " ask" : ""}${it.shown ? " in" : ""}`}
              mark={it.kind === "quiet" || (it.kind === "nudge" && it.ask)}
              icon={it.kind === "nudge" && !it.ask ? <ToolLogo name="WhatsApp" size={20} mono /> : <Icon name="calendar" />}
              iconBg={it.kind === "nudge" && !it.ask ? "#25D366" : it.kind === "ghost" || it.kind === "done" ? "#fff" : undefined}
              app={it.app}
              ago="now"
              title={it.title}
              body={it.body}
              href={it.href}
            />
          ))}
        </div>
        <LockIcons />
      </PhoneShell>
      <p className="mono ex-label">{ALIVE_PHONE.label}</p>
    </div>
  );
}
