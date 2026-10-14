"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { prefersReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PARTS, RUNS, type Part } from "@/lib/runs";
import { SERVICES, SHORT, servicesIn, type Pillar, type ServiceSlug } from "@/lib/services";
import { Icon } from "@/components/ui/Icon";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { getLogo } from "@/lib/logos";

export type SystemPlayerProps = {
  /**
   * Fixed to one system (service pages: no tabs, link "See all eight systems →", analytics
   * source "service-page"). Without `tabs` it is the only system shown; with `tabs` it is the
   * starting tab. Default: the first service.
   */
  service?: ServiceSlug;
  /** Show the 8 named tabs (role=tablist, arrow keys; sticky chips under 860px). Systems page. */
  tabs?: boolean;
  /** Keep `#<slug>` in the URL in sync, and select from it on load and on hashchange. Systems page. */
  hash?: boolean;
};

type Source = "tabs" | "control-room" | "service-page";

// ---- the control room (same page) asks the player to switch system -----------------------------
const SELECT_EVENT = "re:select-system";
/** Select a system in the player on this page (ControlRoom row click). */
export function selectSystem(slug: string, source: Source = "control-room") {
  window.dispatchEvent(new CustomEvent(SELECT_EVENT, { detail: { slug, source } }));
}

const SEE_LABEL = { guest: "WHAT YOUR GUEST SEES", you: "WHAT YOU SEE" } as const;
const GROUPS: readonly [Pillar, string][] = [
  ["auto", "AI AUTOMATION"],
  ["mkt", "MARKETING"],
];
const partLabel = (p: Part) => PARTS.find((x) => x[0] === p)![1];
const indexOf = (slug: string) => SERVICES.findIndex((s) => s.slug === slug);

/** The tool mark for a step node: "You" = the lock, a missing mark = the tool's first letter. */
function StepTool({ name }: { name: string }) {
  if (name === "You") return <Icon name="lock" />;
  if (getLogo(name)) return <ToolLogo name={name} size={20} fallback="none" />;
  return <span className="mono-t">{name[0]}</span>;
}

const Replay = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);

/**
 * "Watch one run": the device scene on the left (what the guest or owner sees), the steps on
 * the right with timecodes, tool logos and the four part labels, a legend, the result strip.
 * Plays when ≥35% visible (steps 1.3s then 1.5s), Replay; fixed min-height so switching never
 * jumps. Fires "System play" { system, source }.
 * Used by /systems (Track B: tabs + hash) and every /services/[slug] page (Track A: `service`).
 * Mockup: player.js → mountPlayer, sections.css (player). Data: src/lib/runs.ts.
 *
 * `RUNS[i].screen` is trusted static HTML (see runs.ts): rendered as is, then its `[data-at]`
 * children are switched `.on` / `.off` by step, as player.js → show() does.
 */
export function SystemPlayer({ service, tabs = false, hash = false }: SystemPlayerProps) {
  const uid = useId();
  const startAt = service ? Math.max(0, indexOf(service)) : 0;
  const [cur, setCur] = useState(startAt);
  const [n, setN] = useState(-1); // the newest step shown (-1: none yet)
  const [hl, setHl] = useState<Part | null>(null); // legend highlight

  const rootRef = useRef<HTMLDivElement>(null);
  const plRef = useRef<HTMLDivElement>(null);
  const devRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const seen = useRef(false);
  const curRef = useRef(cur);
  useEffect(() => {
    curRef.current = cur;
  });

  const run = RUNS[cur];
  const svc = SERVICES[cur];
  const last = run.steps.length - 1;

  // ---- play: show nothing, then step 0 after 350ms, then 1.3s, then 1.5s per step
  const play = useCallback((i: number) => {
    clearTimeout(timer.current);
    seen.current = true;
    const total = RUNS[i].steps.length;
    if (prefersReducedMotion()) return setN(total - 1); // final state, no movement
    setN(-1);
    const tick = (k: number) => {
      setN(k);
      if (k < total - 1) timer.current = setTimeout(() => tick(k + 1), k === 0 ? 1300 : 1500);
    };
    timer.current = setTimeout(() => tick(0), 350);
  }, []);

  // ---- select: `go` = a visitor's choice (plays, keeps the hash, tells analytics)
  const select = useCallback(
    (i: number, go: boolean, src: Source = "tabs") => {
      setCur(i);
      setN(-1);
      if (go) {
        track(EVENTS.systemPlay, { system: SERVICES[i].slug, source: src });
        if (hash) history.replaceState(null, "", `#${SERVICES[i].slug}`);
        // the sticky chips scroll sideways: keep the chosen one in view
        if (innerWidth <= 860) tabRefs.current[i]?.scrollIntoView({ inline: "center", block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }
      if (go || seen.current) play(i);
      else clearTimeout(timer.current);
    },
    [hash, play],
  );

  // ---- hash deep links: on load and on every hashchange (also on the same page)
  const scrollToPlayer = () => (rootRef.current?.closest("#player") ?? rootRef.current)?.scrollIntoView();
  useEffect(() => {
    if (!hash) return;
    const fromHash = () => indexOf(location.hash.slice(1));
    const i = fromHash();
    let t: ReturnType<typeof setTimeout> | undefined;
    if (i >= 0) {
      // the URL hash is browser-only state: it can only be read after hydration
      // eslint-disable-next-line react-hooks/set-state-in-effect
      select(i, false);
      // the sticky chips scroll sideways: bring the linked one into view without moving the page
      const chip = tabRefs.current[i];
      const strip = chip?.closest<HTMLElement>(".sxp");
      if (chip && strip && innerWidth <= 860) strip.scrollLeft = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2;
      t = setTimeout(scrollToPlayer, 50);
    }
    const onHash = () => {
      const k = fromHash();
      if (k >= 0 && k !== curRef.current) {
        select(k, true);
        scrollToPlayer();
      }
    };
    addEventListener("hashchange", onHash);
    return () => {
      clearTimeout(t);
      removeEventListener("hashchange", onHash);
    };
  }, [hash, select]);

  // ---- the control room picks a system
  useEffect(() => {
    if (!tabs) return;
    const onPick = (e: Event) => {
      const { slug, source: src } = (e as CustomEvent<{ slug: string; source: Source }>).detail;
      const i = indexOf(slug);
      if (i >= 0) select(i, true, src);
    };
    addEventListener(SELECT_EVENT, onPick);
    return () => removeEventListener(SELECT_EVENT, onPick);
  }, [tabs, select]);

  // ---- starts when the player comes into view, not on page load
  useEffect(() => {
    const pl = plRef.current;
    if (!pl) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || seen.current) return;
        play(curRef.current);
        if (!tabs) track(EVENTS.systemPlay, { system: SERVICES[curRef.current].slug, source: "service-page" });
      },
      { threshold: 0.35 },
    );
    io.observe(pl);
    return () => {
      io.disconnect();
      clearTimeout(timer.current);
      clearTimeout(scrollTimer.current);
    };
  }, [play, tabs]);

  // ---- the screen: parts appear by step (data-at), hide at data-to; the run-7 calendar cells follow
  useLayoutEffect(() => {
    const dev = devRef.current;
    if (!dev) return;
    dev.querySelectorAll<HTMLElement>("[data-at]").forEach((el) => {
      const at = Number(el.dataset.at);
      const to = el.dataset.to;
      el.classList.toggle("on", n >= at);
      el.classList.toggle("off", to !== undefined && n >= Number(to));
    });
    dev.querySelectorAll<HTMLElement>(".cal .b").forEach((el) => {
      const booked = n >= 1;
      const struck = n >= 2;
      el.style.background = struck ? "rgba(255,255,255,.02)" : booked ? "rgba(232,163,61,.25)" : "";
      el.style.color = struck ? "var(--dim)" : "";
      el.style.textDecoration = struck ? "line-through" : "";
    });
  }, [cur, n]);

  // scroll only as far as the newest item needs, so earlier context stays visible
  useEffect(() => {
    const body = devRef.current?.querySelector<HTMLElement>(".body");
    if (!body) return;
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      if (n < 0) {
        body.scrollTop = 0;
        return;
      }
      const shown = Array.from(body.querySelectorAll<HTMLElement>("[data-at].on:not(.off)"));
      const newest = Math.max(...shown.map((el) => Number(el.dataset.at)));
      const tail = shown.filter((el) => Number(el.dataset.at) === newest).pop();
      if (!tail) return;
      const over = tail.offsetTop + tail.offsetHeight + 14 - (body.scrollTop + body.clientHeight);
      if (over > 0) body.scrollTo({ top: body.scrollTop + over, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }, 120);
  }, [cur, n]);

  // ---- the progress line down the steps follows the newest one
  useLayoutEffect(() => {
    const measure = () => {
      const fill = fillRef.current;
      const li = stepsRef.current?.querySelectorAll<HTMLElement>(".st")[Math.max(0, n)];
      if (fill && li) fill.style.height = n < 0 ? "0px" : `${li.offsetTop + li.offsetHeight / 2 - 22}px`;
    };
    measure();
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, [cur, n]);

  // ---- tabs: click, arrow keys (wrap), Home / End; the selected tab is the one in the tab order
  const onTabKey = (e: KeyboardEvent) => {
    const keys: Record<string, (i: number) => number> = {
      ArrowRight: (i) => (i + 1) % SERVICES.length,
      ArrowLeft: (i) => (i + SERVICES.length - 1) % SERVICES.length,
      Home: () => 0,
      End: () => SERVICES.length - 1,
    };
    const i = tabRefs.current.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0 || !keys[e.key]) return;
    e.preventDefault();
    const next = keys[e.key](i);
    tabRefs.current[next]?.focus();
    select(next, true, "tabs");
  };

  const phoneApp = run.app;
  const panelId = `${uid}-panel`;
  const stepAt = Math.max(0, n);
  const capStep = run.steps[stepAt];

  return (
    <div ref={rootRef}>
      {tabs && (
        <div className="sxp" role="tablist" aria-label="Systems" onKeyDown={onTabKey}>
          {GROUPS.map(([p, label]) => (
            <div key={p} className="sxp-row">
              <span className="mono">{label}</span>
              {servicesIn(p).map((s) => (
                <button
                  key={s.slug}
                  ref={(el) => {
                    tabRefs.current[s.idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${s.idx}`}
                  data-i={s.idx}
                  data-p={s.p}
                  aria-selected={s.idx === cur}
                  aria-controls={panelId}
                  tabIndex={s.idx === cur ? 0 : -1}
                  onClick={() => select(s.idx, true, "tabs")}
                >
                  <Icon name={s.icon} />
                  {SHORT[s.idx]}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div ref={plRef} className="pl rv" id={panelId} {...(tabs ? { role: "tabpanel", "aria-labelledby": `${uid}-tab-${cur}` } : {})}>
        <div className="pl-left">
          <span className="mono see">{SEE_LABEL[run.see]}</span>
          <div ref={devRef} className="devh">
            {/* keyed so a new system gets fresh scene markup */}
            {run.dev === "phone" ? (
              <div key={cur} className="dv phone scene">
                <div className="app">
                  <span className="av" style={{ "--g": phoneApp?.[3] } as React.CSSProperties}>
                    {phoneApp?.[4] ? <Icon name={phoneApp[4]} /> : <ToolLogo name={phoneApp?.[0] ?? ""} size={17} mono />}
                  </span>
                  <div>
                    <b>{phoneApp?.[1]}</b>
                    <small>{phoneApp?.[2]}</small>
                  </div>
                </div>
                <div className="body" dangerouslySetInnerHTML={{ __html: run.screen }} />
              </div>
            ) : (
              <div key={cur} className="dv web scene">
                <div className="bar">
                  <i />
                  <span>{run.url}</span>
                </div>
                <div className="body" dangerouslySetInnerHTML={{ __html: run.screen }} />
              </div>
            )}
          </div>
          <div className="cap" aria-live="polite" data-part={capStep[1]}>
            <b>
              {stepAt + 1}/{run.steps.length} · {partLabel(capStep[1]).toUpperCase()}
            </b>
            <span>{capStep[3]}</span>
          </div>
          <span className="mono" style={{ justifySelf: "center", fontSize: 11 }}>
            Illustrative example
          </span>
        </div>

        <div className="pl-right">
          <div className="pl-head">
            {tabs && <span className={`tag ${svc.p}`}>{svc.title}</span>}
            <h3>{run.title}</h3>
            <p>{run.desc}</p>
            <div className="pl-act">
              <button type="button" className="btn quiet replay" onClick={() => play(cur)}>
                <Replay />
                Replay
              </button>
              {tabs ? (
                <Link className="link ex" href={`/services/${svc.slug}`} data-umami-event={EVENTS.serviceClick} data-umami-event-location="systems-player">
                  See the service →
                </Link>
              ) : (
                <Link className="link ex" href="/systems" data-umami-event={EVENTS.viewAllSystems} data-umami-event-location="service-player">
                  See all eight systems →
                </Link>
              )}
            </div>
          </div>

          {/* as player.js: hovering anywhere off a part button (the label, a gap) clears the highlight */}
          <div
            className="legend"
            onPointerOver={(e) => setHl(((e.target as Element).closest<HTMLElement>("button")?.dataset.part as Part | undefined) ?? null)}
            onPointerLeave={() => setHl(null)}
            onBlur={() => setHl(null)}
          >
            <span className="mono">FOUR PARTS</span>
            {PARTS.map(([part, label]) => (
              <button key={part} type="button" data-part={part} className={hl === part ? "on" : undefined} onFocus={() => setHl(part)}>
                <i />
                {label}
              </button>
            ))}
          </div>

          <ol ref={stepsRef} className={`steps${hl ? " hl" : ""}`}>
            <span ref={fillRef} className="fill" />
            {run.steps.map(([time, part, toolName, text], k) => (
              <li
                key={`${cur}-${k}`}
                className={`st${k === n ? " on" : ""}${k < n || (n === last && k === n) ? " done" : ""}${hl === part ? " hl" : ""}`}
                data-part={part}
              >
                <span className="nd" aria-hidden="true">
                  <StepTool name={toolName} />
                </span>
                <span className="tx">
                  <small>
                    {time} · {toolName}
                  </small>
                  {text}
                </span>
                <span className="pt">{partLabel(part).toUpperCase()}</span>
              </li>
            ))}
          </ol>

          <div className="pl-foot" style={{ opacity: n >= last ? 1 : 0.55 }}>
            <div className="was">
              <span className="mono">BY HAND</span>
              <b>{run.was}</b>
            </div>
            <div className="now">
              <span className="mono">WITH THE SYSTEM</span>
              <b>{run.now}</b>
            </div>
            <div className="ctl">
              <span className="mono">YOU STAY IN CONTROL</span>
              <p>{run.ctl}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
