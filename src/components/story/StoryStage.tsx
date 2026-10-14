"use client";

import { Fragment, useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { useRafLoop } from "@/lib/hooks/useRafLoop";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { scrollProgress } from "@/lib/hooks/useScrollProgress";
import { GAP, LERP, LIFT, N, PAINS, RAIL, SEG, TURNS, VIEW_TOOLS, VISIBLE } from "@/lib/story";
import { LaptopConsole } from "@/components/devices/LaptopConsole";
import { PhoneMockup } from "@/components/devices/PhoneMockup";
import { Chip, Tag } from "@/components/ui/Chip";
import { HeroCopy, MorningCopy, clearBg, paintBg } from "./StoryCopy";
import { StoryStatic } from "./StoryStatic";
import { MorningNote, StoryNote } from "./notes";
import styles from "./story.module.css";

// The homepage story stage: chapters 01–03 + morning on a sticky 100vh stage inside an 820vh
// section (880vh on phones). Port of redesign-mockups/r3/home.js, structure for structure, with
// its numbers (SEG, GAP 86, lerp .12, X(), --edge, the measured copyRight, the FLIP, the +.12
// stagger, the return-card curve).
//
// How it maps onto React: the markup is rendered once (server-side, so the hero H1 and lead are
// in the HTML) and the per-frame work stays imperative, like the mockup: refs + classList/style,
// never React state, so nothing re-renders while scrolling. React state holds only the three
// pieces of *content* that change: the lifted card, the returning card and which phone cards
// show their "handled" text. Elements touched imperatively keep a constant className in JSX so
// a re-render never overwrites the classes the loop set.
//
// Added on top of the mockup: the rAF loop runs only while the story is on screen (and snaps to
// the scroll position when it resumes); a static version for prefers-reduced-motion
// (StoryStatic); the time-of-day background runs from its own scroll listener (it must follow
// the whole page, not just the story) and is cleared on unmount.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const fmt = (m: number) => `${Math.floor(m / 60)}:${String(Math.floor(m % 60)).padStart(2, "0")}`;
/** A point inside the 1240 column, as a CSS length in stage container units (home.js X()). */
const X = (f: number) => `calc(var(--edge) + min(100cqw, var(--max)) * ${f})`;
const MAX = 1240;
/** The phrase highlighted on each lifted notification (home.js: N[L.n].hl = L.hl). */
const HL: Record<number, string> = Object.fromEntries(LIFT.map((L) => [L.n, L.hl]));

type State = { ch: number; step: number; local: number; chP: number };
function stateOf(v: number): State {
  let ch = 3;
  for (let i = 0; i < 4; i++)
    if (v < SEG[i][1]) {
      ch = i;
      break;
    }
  const [a, b] = SEG[ch], chP = (v - a) / (b - a);
  let step = 0, local = chP;
  if (ch === 1 || ch === 2) {
    const f = chP * 4;
    step = Math.min(3, Math.floor(f));
    local = f - step;
  }
  return { ch, step, local, chP };
}

/** Write a style property only when it changes (the loop runs every frame). */
const CACHE = new WeakMap<Element, Record<string, string>>();
function css(el: HTMLElement | SVGElement, prop: string, val: string) {
  let c = CACHE.get(el);
  if (!c) CACHE.set(el, (c = {}));
  if (c[prop] === val) return;
  c[prop] = val;
  el.style.setProperty(prop, val);
}
function attr(el: Element, name: string, val: string) {
  let c = CACHE.get(el);
  if (!c) CACHE.set(el, (c = {}));
  const k = `@${name}`;
  if (c[k] === val) return;
  c[k] = val;
  el.setAttribute(name, val);
}
/** Replace a text node's value in place, so React's node stays the same. */
function text(el: Element | null, val: string) {
  const t = el?.firstChild;
  if (t && t.nodeValue !== val) t.nodeValue = val;
}
const tog = (el: Element, cls: string, on: boolean) => el.classList.toggle(cls, on);

type Rig = { x: string; y: string; s: number; o?: number; rx?: number; ry?: number; rz?: number };
function place(el: HTMLElement, o: Rig) {
  css(el, "--x", o.x);
  css(el, "--y", o.y);
  css(el, "--s", o.s.toFixed(3));
  css(el, "--o", String(o.o ?? 1));
  const c = el.firstElementChild as HTMLElement;
  css(c, "--rx", `${(o.rx ?? 4).toFixed(2)}deg`);
  css(c, "--ry", `${(o.ry ?? -12).toFixed(2)}deg`);
  css(c, "--rz", `${(o.rz ?? 0).toFixed(2)}deg`);
}

export function StoryStage() {
  const reduce = useReducedMotion();
  return reduce ? <StoryStatic /> : <StoryAnimated />;
}

type Dom = {
  story: HTMLElement;
  phoneRig: HTMLElement;
  laptopRig: HTMLElement;
  phone: HTMLElement;
  stack: HTMLElement;
  more: HTMLElement;
  summary: HTMLElement;
  cards: HTMLElement[];
  lift: HTMLElement;
  scrim: HTMLElement;
  retn: HTMLElement;
  beam: SVGSVGElement;
  beamFill: SVGPathElement;
  beamEdge: SVGPathElement;
  beamTag: HTMLElement;
  wire: SVGSVGElement;
  wirePath: SVGPathElement;
  wireDot: SVGCircleElement;
  sent: HTMLElement;
  chs: HTMLElement[];
  linesP: HTMLElement[];
  linesT: HTMLElement[];
  dotsP: HTMLElement[];
  dotsT: HTMLElement[];
  kickP: HTMLElement;
  kickT: HTMLElement;
  railBtns: HTMLElement[];
  views: HTMLElement[];
  navEls: HTMLElement[];
  toolEls: HTMLElement[];
  ptime: HTMLElement;
  stime: HTMLElement;
  sun: HTMLElement;
  moon: HTMLElement;
  lamp: HTMLElement;
};

function StoryAnimated() {
  const storyRef = useRef<HTMLElement>(null);
  const ptimeRef = useRef<HTMLSpanElement>(null);
  const stimeRef = useRef<HTMLSpanElement>(null);
  const dom = useRef<Dom | null>(null);
  const gid = useId();
  const beamGrad = `beamG${gid.replace(/[^a-zA-Z0-9]/g, "")}`;

  // content that changes with the step (rendered by React; everything else is imperative)
  const [liftStep, setLiftStep] = useState(-1);
  const [retnIdx, setRetnIdx] = useState(-1);
  const [doneMask, setDoneMask] = useState(0);

  // the loop's own state (home.js module variables)
  const L = useRef({
    p: 0,
    ps: 0,
    arrived: 0,
    lastKey: "",
    flip: false,
    flipStep: -1,
    copyRight: 0,
    mx: 0,
    my: 0,
    mxs: 0,
    mys: 0,
    t0: 0,
    doneMask: 0,
    frames: 0,
    resume: true,
    short: false,
  });

  const active = useInView(storyRef);

  useEffect(() => {
    const story = storyRef.current!;
    const q = <T extends Element = HTMLElement>(s: string) => story.querySelector(`[data-s="${s}"]`) as unknown as T;
    const qa = (s: string) => [...story.querySelectorAll<HTMLElement>(s)];
    const laptopRig = q("laptopRig");
    const notes = [...q("phoneRig").querySelectorAll<HTMLElement>(".stack > .n")];
    dom.current = {
      story,
      phoneRig: q("phoneRig"),
      laptopRig,
      phone: q("phoneRig").querySelector<HTMLElement>(".phone")!,
      stack: q("phoneRig").querySelector<HTMLElement>(".stack")!,
      more: q("more"),
      // the stack holds the six cards, "n more", then the morning summary (home.js order)
      summary: notes[N.length],
      cards: notes.slice(0, N.length),
      lift: q("lift"),
      scrim: q("scrim"),
      retn: q("retn"),
      beam: q<SVGSVGElement>("beam"),
      beamFill: q<SVGPathElement>("beamFill"),
      beamEdge: q<SVGPathElement>("beamEdge"),
      beamTag: q("beamTag"),
      wire: q<SVGSVGElement>("wire"),
      wirePath: q<SVGPathElement>("wirePath"),
      wireDot: q<SVGCircleElement>("wireDot"),
      sent: q("sent"),
      chs: qa("[data-ch]"),
      linesP: qa('[data-s="linesP"] > div'),
      linesT: qa('[data-s="linesT"] > div'),
      dotsP: qa('[data-s="dotsP"] i'),
      dotsT: qa('[data-s="dotsT"] i'),
      kickP: q("kickP"),
      kickT: q("kickT"),
      railBtns: qa('[data-s="rail"] button'),
      views: [...laptopRig.querySelectorAll<HTMLElement>(".main .view")],
      navEls: [...laptopRig.querySelectorAll<HTMLElement>(".side .nv")],
      toolEls: [...laptopRig.querySelectorAll<HTMLElement>(".side .tl")],
      ptime: ptimeRef.current!,
      stime: stimeRef.current!,
      sun: q("sun"),
      moon: q("moon"),
      lamp: q("lamp"),
    };
    const S = L.current;
    S.t0 = performance.now();

    const measure = () => {
      S.p = scrollProgress(story);
    };
    measure();
    S.ps = S.p;
    const onResize = () => {
      S.lastKey = "";
      // short phones (SE and smaller, most iPhones in Safari) fold the stack to one card, or it
      // runs into the copy. Measured on <html> (the small viewport), not innerHeight: that grows
      // and shrinks with the browser toolbar while you scroll and would flip the layout mid-story
      S.short = innerWidth <= 760 && document.documentElement.clientHeight < 720;
      tog(story, styles.short, S.short);
    };
    onResize();
    const onMove = (e: PointerEvent) => {
      S.mx = e.clientX / innerWidth - 0.5;
      S.my = e.clientY / innerHeight - 0.5;
    };
    // the time-of-day background follows the whole page, so it doesn't pause with the story
    const fade = q("fade");
    const bg = () => paintBg(story, fade);
    bg();
    addEventListener("scroll", measure, { passive: true });
    addEventListener("scroll", bg, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("resize", bg);
    addEventListener("pointermove", onMove, { passive: true });
    return () => {
      removeEventListener("scroll", measure);
      removeEventListener("scroll", bg);
      removeEventListener("resize", onResize);
      removeEventListener("resize", bg);
      removeEventListener("pointermove", onMove);
      clearBg();
      dom.current = null;
    };
  }, []);

  // Coming back on screen: jump to where the scroll is instead of lerping through every chapter.
  useEffect(() => {
    if (active) L.current.resume = true;
  }, [active]);

  useRafLoop(() => {
    const D = dom.current;
    if (!D) return;
    const S = L.current;
    if (S.resume) {
      S.resume = false;
      S.p = scrollProgress(D.story);
      S.ps = S.p;
      S.lastKey = "";
    }
    const VIS = innerWidth > 760 ? VISIBLE.desktop : S.short ? 1 : VISIBLE.phone;
    S.ps += (S.p - S.ps) * LERP;
    S.mxs += (S.mx - S.mxs) * 0.06;
    S.mys += (S.my - S.mys) * 0.06;
    const s = stateOf(S.ps), t = (performance.now() - S.t0) / 1000;
    const key = `${s.ch}:${s.step}`;
    const wide = innerWidth > 760;

    if (key !== S.lastKey) {
      S.lastKey = key;
      D.chs.forEach((c, i) => {
        tog(c, styles.on, i === s.ch);
        tog(c, styles.gone, i < s.ch);
        // added: links in a hidden chapter leave the tab order (they stay readable)
        c.querySelectorAll<HTMLElement>("a,button").forEach((a) => (a.tabIndex = i === s.ch ? 0 : -1));
      });
      D.linesP.forEach((l, i) => tog(l, styles.on, s.ch === 1 && i === s.step));
      if (s.ch === 1) {
        // where the visible chapter text ends, so the card never sits on it
        S.copyRight = 0;
        D.linesP[s.step].querySelectorAll("h2,p").forEach((e) => {
          const rg = document.createRange();
          rg.selectNodeContents(e);
          for (const r of rg.getClientRects()) S.copyRight = Math.max(S.copyRight, r.right);
        });
      }
      D.linesT.forEach((l, i) => tog(l, styles.on, s.ch === 2 && i === s.step));
      D.dotsP.forEach((d, i) => {
        tog(d, styles.on, s.ch === 1 && i === s.step);
        tog(d, styles.done, s.ch > 1 || (s.ch === 1 && i < s.step));
      });
      D.dotsT.forEach((d, i) => {
        tog(d, styles.on, s.ch === 2 && i === s.step);
        tog(d, styles.done, s.ch > 2 || (s.ch === 2 && i < s.step));
      });
      text(D.kickP, `Sound familiar? · 0${s.ch === 1 ? s.step + 1 : 1}/04`);
      text(D.kickT, `Then it runs itself · 0${s.ch === 2 ? s.step + 1 : 1}/04`);
      D.railBtns.forEach((b, i) => tog(b, styles.on, i === s.ch));
      const v = s.ch === 2 ? s.step : s.ch === 3 ? 4 : -1;
      D.views.forEach((el, i) => tog(el, "on", i === v));
      if (v >= 0) {
        const d = D.views[v].querySelector<SVGPathElement>(".draw");
        if (d) d.style.strokeDashoffset = "0";
      }
      D.navEls.forEach((el, i) => tog(el, "on", i === v));
      D.toolEls.forEach((el) => tog(el, "live", v >= 0 && VIEW_TOOLS[v].includes(el.dataset.t ?? "")));
      // lifted card
      if (s.ch === 1) {
        D.lift.classList.remove(styles.scan);
        setLiftStep(s.step);
        S.flip = true;
        S.flipStep = s.step;
      }
      tog(D.lift, styles.on, s.ch === 1);
      if (s.ch === 2) {
        let idx = -1;
        N.forEach((n, i) => {
          if (n.fix === s.step) idx = i;
        });
        setRetnIdx(idx);
      }
      tog(D.phone, "focus", s.ch === 1);
    }
    D.railBtns.forEach((b, i) => css(b.querySelector("i")!, "--f", clamp((S.ps - SEG[i][0]) / (SEG[i][1] - SEG[i][0])).toFixed(3)));

    // ---- layout(s): the rigs per chapter, and where the lifted card may sit
    {
      const col = Math.min(document.documentElement.clientWidth, MAX);
      const pf = Math.min(1.05, (innerHeight * 0.78) / 620), lf = Math.min((col * 0.5) / 760, (innerHeight * 0.6) / 500);
      const tx = S.mxs * 8, ty = S.mys * 6;
      const P: Rig = [
        { x: X(0.74), y: "53cqh", s: pf, ry: -14 + tx, rx: 5 - ty, rz: 1.2 },
        { x: X(0.75), y: "53cqh", s: pf, ry: -8 + tx, rx: 3 - ty },
        { x: X(0.5), y: "66cqh", s: pf * 0.62, ry: 12 + tx, rx: 3 - ty, rz: -2 },
        { x: X(0.66), y: "53cqh", s: pf, ry: -6 + tx, rx: 2 - ty },
      ][s.ch];
      const Lr: Rig = [
        { x: X(1.18), y: "48cqh", s: lf, o: 0, ry: -24 },
        { x: X(1.18), y: "48cqh", s: lf, o: 0, ry: -24 },
        { x: X(0.69), y: "44cqh", s: lf, ry: -10 + tx * 0.6, rx: 4 - ty * 0.6 },
        { x: X(0.79), y: "42cqh", s: lf * 0.82, o: 0.45, ry: -16, rx: 4 },
      ][s.ch];
      place(D.phoneRig, P);
      place(D.laptopRig, Lr);
      // the pulled card sits a fixed gap left of the phone, but never over the chapter headline
      // measured: right edge of the chapter text on screen → room left before the phone
      const vw = document.documentElement.clientWidth, edge = Math.max(0, (vw - col) / 2);
      const phoneLeft = edge + col * 0.75 - 150 * pf, textRight = S.copyRight || edge + 64 + 330;
      const room = phoneLeft - 44 - (textRight + 32), k = Math.max(0.8, Math.min(1, room / 330));
      css(D.lift, "--lk", k.toFixed(3));
      css(D.lift, "--lx", `${Math.max(phoneLeft - 44 - 165 * k, textRight + 32 + 165 * k)}px`);
    }
    // the server guessed the rigs' first position: place them once without sliding, then animate
    if (++S.frames === 2) [D.phoneRig, D.laptopRig].forEach((r) => r.classList.remove(styles.init));

    // ---- notifications arrive in the hero
    const target = s.ch === 0 ? Math.min(N.length, Math.floor(Math.max(0, t - 0.6) / 1.1) + 1) : N.length;
    if (target > S.arrived) {
      S.arrived = target;
      D.phone.classList.remove("buzz");
      void D.phone.offsetWidth;
      D.phone.classList.add("buzz");
    }
    const st: ("open" | "hidden" | "gone" | "done")[] = [];
    const live: number[] = [];
    let mask = 0;
    N.forEach((n, i) => {
      let c: (typeof st)[number] = i < S.arrived ? "open" : "hidden";
      if (c === "open" && s.ch === 2) {
        if (s.step > n.fix) c = "gone";
        else if (s.step === n.fix) {
          // the card the solution flies into lands first; the rest follow a beat apart
          const grp = N.map((k, j) => (k.fix === n.fix ? j : -1)).filter((j) => j >= 0), ord = grp.length - 1 - grp.indexOf(i);
          if (s.local > 0.55 + ord * 0.12) c = "done";
        }
      }
      if (s.ch === 3) c = "gone";
      st[i] = c;
      if (c === "done") mask |= 1 << i;
      tog(D.cards[i], "done", c === "done");
      if (c === "open" || c === "done") live.push(i);
    });
    if (mask !== S.doneMask) {
      S.doneMask = mask;
      setDoneMask(mask);
    }
    live.reverse();
    const focusOf = (i: number) => (s.ch === 1 && N[i].pain === s.step) || (s.ch === 2 && N[i].fix === s.step);
    live.sort((a, b) => +focusOf(b) - +focusOf(a));
    D.cards.forEach((el, i) => {
      const idx = live.indexOf(i);
      if (st[i] === "hidden") {
        css(el, "opacity", "0");
        css(el, "transform", "translateY(-30px) scale(.96)");
        el.classList.remove("lifted", "peek");
        return;
      }
      if (st[i] === "gone") {
        css(el, "opacity", "0");
        css(el, "transform", "translateY(-70px) scale(.9)");
        // also drop "lifted": .n.lifted forces opacity 1, and resuming off screen can jump from
        // "Sound familiar?" straight to the morning without a frame in between to clear it
        el.classList.remove("focus", "dim", "lifted", "peek");
        return;
      }
      // folded cards show only their edge, like a real lock screen (their text bled through)
      tog(el, "peek", idx >= VIS);
      if (idx < VIS) {
        css(el, "opacity", "1");
        css(el, "transform", `translateY(${idx * GAP}px)`);
        css(el, "z-index", String(20 - idx));
      } else {
        const k = idx - VIS;
        css(el, "opacity", String(k < 2 ? 0.45 - k * 0.2 : 0));
        css(el, "transform", `translateY(${(VIS - 1) * GAP + 14 + k * 9}px) scale(${0.94 - k * 0.04})`);
        css(el, "z-index", String(5 - k));
      }
      const f = focusOf(i);
      tog(el, "lifted", s.ch === 1 && f && idx === 0);
      tog(el, "dim", (s.ch === 1 || s.ch === 2) && !f);
    });

    // ---- pulled from the phone: the card flies out of its slot (FLIP), then a beam links slot → card
    const ghost = D.cards.find((c) => c.classList.contains("lifted"));
    const liftN = D.lift.dataset.step === String(S.flipStep) ? D.lift.querySelector<HTMLElement>(".n") : null;
    if (S.flip && ghost && liftN && wide) {
      S.flip = false;
      const sr = D.stack.getBoundingClientRect(), r = liftN.getBoundingClientRect();
      liftN.style.transition = "none";
      liftN.style.transform = `translate(${sr.left - r.left}px, ${sr.top - r.top}px) scale(${sr.width / r.width})`;
      liftN.getBoundingClientRect();
      requestAnimationFrame(() => {
        liftN.style.transition = "transform .9s cubic-bezier(.16,1,.3,1)";
        liftN.style.transform = "none";
        D.lift.classList.add(styles.scan);
      });
    } else if (S.flip && !wide && liftN) {
      S.flip = false;
      D.lift.classList.add(styles.scan);
    }
    const beamOn = s.ch === 1 && !!ghost && !!liftN && wide;
    tog(D.beam, styles.on, beamOn);
    tog(D.beamTag, styles.on, beamOn);
    tog(D.scrim, styles.on, beamOn);
    if (beamOn) {
      // spotlight: everything dims except the slot the card came from
      const b = ghost.getBoundingClientRect(), o = D.scrim.getBoundingClientRect(), p = 6, r = 24;
      const x = b.left - o.left - p, y = b.top - o.top - p, w = b.width + 2 * p, hh = b.height + 2 * p;
      css(
        D.scrim,
        "clip-path",
        `path(evenodd, 'M0 0H${o.width}V${o.height}H0Z M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + hh - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + hh}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + hh - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z')`,
      );
    }

    // ---- reverse move: the solved card flies from the laptop back into its slot on the phone
    let backI = -1;
    if (s.ch === 2 && wide) N.forEach((n, i) => n.fix === s.step && (backI = i));
    const tf = backI >= 0 ? clamp((s.local - 0.22) / 0.33) : 0;
    if (backI >= 0 && s.local > 0.18 && s.local < 0.6 && D.retn.firstElementChild) {
      const lr = D.laptopRig.getBoundingClientRect(), b = D.cards[backI].getBoundingClientRect(), o = D.retn.parentElement!.getBoundingClientRect();
      const ax = lr.left + lr.width * 0.55 - o.left, ay = lr.top + lr.height * 0.38 - o.top, bx = b.left + b.width / 2 - o.left, by = b.top + b.height / 2 - o.top;
      const e = tf < 0.5 ? 2 * tf * tf : 1 - Math.pow(-2 * tf + 2, 2) / 2, cx = (ax + bx) / 2, cy = Math.min(ay, by) - 160;
      const qx = (1 - e) * (1 - e) * ax + 2 * (1 - e) * e * cx + e * e * bx, qy = (1 - e) * (1 - e) * ay + 2 * (1 - e) * e * cy + e * e * by;
      const sc = 1 + (b.width / 300 - 1) * e;
      css(D.retn, "transform", `translate(${qx - 150}px, ${qy - D.retn.offsetHeight / 2}px) scale(${sc})`);
      css(D.retn, "opacity", String(s.local < 0.24 ? (s.local - 0.18) / 0.06 : s.local > 0.55 ? Math.max(0, 1 - (s.local - 0.55) / 0.05) : 1));
    } else css(D.retn, "opacity", "0");
    if (beamOn) {
      const a = liftN!.getBoundingClientRect(), b = ghost!.getBoundingClientRect(), o = D.beam.getBoundingClientRect();
      const ax = a.right - o.left, at = a.top - o.top + 10, ab = a.bottom - o.top - 10, bx = b.left - o.left, bt = b.top - o.top, bb = b.bottom - o.top;
      attr(D.beamFill, "d", `M${ax} ${at} L${bx} ${bt} L${bx} ${bb} L${ax} ${ab} Z`);
      attr(D.beamEdge, "d", `M${ax} ${at} L${bx} ${bt} M${ax} ${ab} L${bx} ${bb}`);
      css(D.beamTag, "left", `${b.left - o.left + b.width / 2}px`);
      css(D.beamTag, "top", `${bt - 10}px`);
    }
    const hidden = Math.max(0, live.length - VIS);
    const moreText = hidden ? `${hidden} more` : "";
    if (D.more.textContent !== moreText) D.more.textContent = moreText;
    css(D.more, "top", `${Math.min(live.length, VIS) * GAP + (hidden ? 26 : 0)}px`);
    css(D.summary, "opacity", s.ch === 3 ? "1" : "0");
    css(D.summary, "transform", s.ch === 3 ? "none" : "translateY(20px)");

    // ---- time of day
    const m = s.ch === 3 ? 1 : s.ch === 2 ? clamp((s.chP - 0.5) * 2) : 0;
    const mins = s.ch === 0 ? 134 : s.ch === 1 ? 134 + s.chP * 17 : s.ch === 2 ? 151 + s.chP * 299 : 450;
    text(D.ptime, fmt(mins));
    text(D.stime, fmt(mins));
    tog(D.phone, "day", s.ch === 3);
    css(D.sun, "opacity", String(m));
    css(D.moon, "opacity", String(1 - m));
    css(D.lamp, "opacity", String(1 - m));

    // ---- cause → effect: a pulse travels from the laptop to the phone
    const wiring = s.ch === 2 && s.local > 0.22 && s.local < 0.75;
    tog(D.wire, styles.on, wiring);
    tog(D.sent, styles.on, s.ch === 2 && s.local > 0.5 && s.local < 0.8);
    if (s.ch === 2 && wide) {
      const lr = D.laptopRig.getBoundingClientRect(), pr = D.phoneRig.getBoundingClientRect();
      const ax = lr.left + lr.width * 0.62, ay = lr.top + lr.height * 0.42, bx = pr.left + pr.width * 0.62, by = pr.top + pr.height * 0.4;
      attr(D.wirePath, "d", `M${ax} ${ay} C ${ax} ${ay - 140}, ${bx + 40} ${by - 160}, ${bx} ${by}`);
      const len = D.wirePath.getTotalLength(), qp = D.wirePath.getPointAtLength(len * clamp((s.local - 0.22) / 0.33));
      attr(D.wireDot, "cx", String(qp.x));
      attr(D.wireDot, "cy", String(qp.y));
      css(D.wireDot, "opacity", "0");
      css(D.sent, "left", `${bx + 10}px`);
      css(D.sent, "top", `${by - 150}px`);
    }
  }, active);

  /** Rail buttons and "See how it works": scroll to a chapter (home.js [data-jump]). */
  const jump = (i: number) => (e: MouseEvent) => {
    const story = storyRef.current;
    if (!story) return;
    e.preventDefault();
    const span = story.offsetHeight - innerHeight, top = story.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (SEG[i][0] + (i ? 0.015 : 0)) * span, behavior: "smooth" });
  };

  const liftL = liftStep >= 0 ? LIFT[liftStep] : null;
  const liftNote = liftL ? N[liftL.n] : null;
  const retnNote = retnIdx >= 0 ? N[retnIdx] : null;

  return (
    <section className={styles.story} id="story" ref={storyRef} aria-label="The night shift, in four chapters">
      <div className={styles.stage}>
        <div className={styles.atmo} aria-hidden="true">
          <div className={styles.moon} data-s="moon" />
          <div className={styles.lamp} data-s="lamp" />
          <div className={styles.glow} />
          <div className={styles.sunrise} data-s="sun" />
          <div className={styles.surface} />
        </div>
        {/* keeps the copy readable: under the rigs on desktop, over the full-screen phone on mobile */}
        <div className={styles.fade} data-s="fade" aria-hidden="true" />

        {/* owner's phone */}
        <div
          className={`${styles.rig} ${styles.phoneRig} ${styles.init}`}
          data-s="phoneRig"
          aria-hidden="true"
          style={{ "--x": X(0.74), "--y": "53cqh", "--s": 0.9 } as CSSProperties}
        >
          <div style={{ "--rx": "5deg", "--ry": "-14deg", "--rz": "1.2deg" } as CSSProperties}>
            <PhoneMockup time="2:14" statusTimeRef={stimeRef} timeRef={ptimeRef}>
              {N.map((n, i) => (
                <StoryNote key={i} n={n} hl={HL[i]} done={!!(doneMask & (1 << i))} style={HIDDEN} />
              ))}
              <div className="more" data-s="more" />
              <MorningNote className={styles.summary} style={SUMMARY_OFF} />
            </PhoneMockup>
          </div>
        </div>

        {/* the system's laptop */}
        <div
          className={`${styles.rig} ${styles.laptopRig} ${styles.init}`}
          data-s="laptopRig"
          aria-hidden="true"
          style={{ "--x": X(1.18), "--y": "48cqh", "--s": 0.8, "--o": 0 } as CSSProperties}
        >
          <div style={{ "--ry": "-24deg" } as CSSProperties}>
            <LaptopConsole />
          </div>
        </div>

        <svg className={styles.wire} data-s="wire" aria-hidden="true">
          <path data-s="wirePath" />
          <circle r="3.5" data-s="wireDot" />
        </svg>
        <div className={`${styles.sent} chip handled`} data-s="sent" aria-hidden="true">
          <i />
          Sent to your phone
        </div>
        <div className={styles.spotScrim} data-s="scrim" />
        <div className={styles.retn} data-s="retn" aria-hidden="true">
          {retnNote ? <StoryNote key={retnIdx} n={retnNote} done /> : null}
        </div>
        <svg className={styles.beam} data-s="beam" aria-hidden="true">
          <defs>
            <linearGradient id={beamGrad} x1="0" x2="1">
              <stop offset="0" stopColor="#E8A33D" stopOpacity=".2" />
              <stop offset="1" stopColor="#E8A33D" stopOpacity=".04" />
            </linearGradient>
          </defs>
          <path data-s="beamFill" fill={`url(#${beamGrad})`} />
          <path className={styles.beamEdge} data-s="beamEdge" />
        </svg>
        <span className={styles.beamtag} data-s="beamTag" aria-hidden="true">
          FROM YOUR LOCK SCREEN
        </span>
        <div className={styles.lift} data-s="lift" data-step={liftStep} aria-hidden="true">
          {liftL && liftNote ? (
            <Fragment key={liftStep}>
              <Chip tone="problem">{liftL.chip}</Chip>
              <StoryNote n={liftNote} hl={liftL.hl} />
              <div className={styles.big}>
                {liftL.big}
                <small>{liftL.small}</small>
              </div>
            </Fragment>
          ) : null}
        </div>

        <div className={styles.copy}>
          <div className={`${styles.ch} ${styles.ch0} ${styles.on}`} data-ch="0">
            <HeroCopy onSeeHow={jump(1)} />
          </div>
          <div className={styles.ch} data-ch="1">
            <div className={`${styles.kick} ${styles.amber}`} data-s="kickP">
              Sound familiar? · 01/04
            </div>
            <div className={styles.lines} data-s="linesP">
              {PAINS.map((p) => (
                <div key={p[0]} className={styles.ln}>
                  <h2 className="d2">{p[0]}</h2>
                  <p>{p[1]}</p>
                </div>
              ))}
            </div>
            <div className={`${styles.dots} ${styles.amber}`} data-s="dotsP" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className={styles.ch} data-ch="2">
            <div className={`${styles.kick} ${styles.green}`} data-s="kickT">
              Then it runs itself · 01/04
            </div>
            <div className={styles.lines} data-s="linesT">
              {TURNS.map((tn) => (
                <div key={tn[0]} className={styles.ln}>
                  <h2 className="d2">{tn[0]}</h2>
                  <p>{tn[1]}</p>
                  <Tag pillar={tn[2] === "both" ? undefined : tn[2]}>{tn[3]}</Tag>
                </div>
              ))}
            </div>
            <div className={`${styles.dots} ${styles.green}`} data-s="dotsT" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className={styles.ch} data-ch="3">
            <MorningCopy />
          </div>
        </div>
        <div className={styles.rail} data-s="rail">
          {RAIL.map((label, i) => (
            <button key={label} type="button" className={i === 0 ? styles.on : undefined} aria-label={label} onClick={jump(i)}>
              <i />
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const HIDDEN = { opacity: 0, transform: "translateY(-30px) scale(.96)" } as const;
const SUMMARY_OFF = { opacity: 0, transform: "translateY(20px)" } as const;
