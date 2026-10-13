import type { CSSProperties, ReactNode } from "react";
import type { IconName } from "@/lib/icons";
import { Icon } from "@/components/ui/Icon";

// The four phases of /approach: copy and illustrative visuals, ported unchanged from
// redesign-mockups/r3/approach.html (PH). Every number in a visual is illustrative and says so.

export type Phase = {
  n: string;
  /** Title; also the row id: #ph-audit, #ph-design, #ph-build, #ph-run (the calendar scrolls to these). */
  t: string;
  when: string;
  sum: string;
  you: string;
  we: string;
  out: string;
  vis: ReactNode;
};

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

const LEAKS = [
  ["Answering guest messages", 1, "9 h/wk"],
  ["Coordinating turnovers", 0.5, "4 h/wk"],
  ["Updating rates", 0.25, "2 h/wk"],
  ["Re-engaging past guests", 0.05, "not done"],
] as const;

const FLOW: readonly (readonly [IconName, string, boolean?])[] = [
  ["message", "Message in"],
  ["assistant", "Draft reply"],
  ["lock", "You approve*", true],
  ["check", "Sent & logged"],
];

const TESTS = [
  "Airbnb message → reply drafted",
  "Booking → cleaner booked",
  "Checkout → door code rotated",
  "Refund request → sent to owner",
  "Direct booking → calendars blocked",
  "Late reply → owner alerted",
];

const SUMMARY = [
  ["Guest messages answered", "412"],
  ["Handed to you", "9"],
  ["Direct bookings", "14"],
  ["Turnovers coordinated", "38"],
  ["Improvements shipped", "3"],
] as const;

export const PHASES: readonly Phase[] = [
  {
    n: "01",
    t: "Audit",
    when: "Days 1–3",
    sum: "We map every repetitive task in your rental business and put an hour figure on each one.",
    you: "One 30-minute call, plus access to your tools",
    we: "Walk every inbox, calendar and hand-off",
    out: "A ranked list of what to fix first",
    vis: (
      <>
        <div className="mono" style={{ marginBottom: 14 }}>
          LEAK REPORT · ILLUSTRATIVE
        </div>
        <div className="rows">
          {LEAKS.map((r, i) => (
            <div key={r[0]} className="card">
              <span>{r[0]}</span>
              <i className="bar grow" style={{ "--s": r[1], "--dl": `${0.2 + i * 0.15}s` } as CSSProperties} />
              <b>{r[2]}</b>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 14 }}>
          Fix first: <b style={{ color: "var(--ink)" }}>guest messaging</b>.
        </p>
      </>
    ),
  },
  {
    n: "02",
    t: "Design",
    when: "Week 1",
    sum: "We design the workflow: what starts it, what it touches, and exactly where you still check in.",
    you: "Approve the plan, in plain language",
    we: "Draw every trigger, tool and checkpoint",
    out: "A one-page workflow you sign off",
    vis: (
      <>
        <div className="mono" style={{ marginBottom: 18 }}>
          WORKFLOW · GUEST MESSAGING
        </div>
        <div className="mini-pipe">
          {FLOW.map(([icon, label, check], i) => (
            <FlowNode key={label} icon={icon} label={label} check={check} i={i} />
          ))}
        </div>
        <p className="small" style={{ marginTop: 22 }}>
          *Only for refunds, complaints and anything unusual. Everything routine runs on its own.
        </p>
      </>
    ),
  },
  {
    n: "03",
    t: "Build",
    when: "Weeks 2–3",
    sum: "We build inside your existing tools, then test on real data before anything touches a guest.",
    you: "Nothing. Carry on as normal",
    we: "Build, connect and test end to end",
    out: "A working system on real data",
    vis: (
      <>
        <div className="mono" style={{ marginBottom: 10 }}>
          TEST RUN · ILLUSTRATIVE
        </div>
        <div className="tests">
          {TESTS.map((t, i) => (
            <div key={t} className="tick" style={dl(0.3 + i * 0.35)}>
              {t}
              <em>✓ pass</em>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    n: "04",
    t: "Run",
    when: "Ongoing",
    sum: "We monitor it, fix what real use exposes, and keep improving it. Fully documented, fully yours.",
    you: "Read a monthly summary",
    we: "Monitor, fix, improve, document",
    out: "A running system your team owns",
    vis: (
      <div className="summary-card">
        <div className="mono" style={{ marginBottom: 8 }}>
          MONTHLY SUMMARY · OCTOBER · ILLUSTRATIVE
        </div>
        {SUMMARY.map((r) => (
          <div key={r[0]} className="r">
            <span>{r[0]}</span>
            <b data-count={r[1]}>{r[1]}</b>
          </div>
        ))}
      </div>
    ),
  },
];

function FlowNode({ icon, label, check, i }: { icon: IconName; label: string; check?: boolean; i: number }) {
  return (
    <>
      {i ? <span className="ln2" style={dl(i * 0.6)} /> : null}
      <div className={`nd${check ? " ck" : ""}`} style={dl(i * 0.6 + 0.3)}>
        <div className="bx">
          <Icon name={icon} />
        </div>
        {label}
      </div>
    </>
  );
}

/** "After launch" cards: [icon, title, text]. */
export const AFTER_LAUNCH: readonly (readonly [IconName, string, string])[] = [
  ["audit", "Monitoring", "We watch every system and catch issues first."],
  ["build", "Fixes", "Anything real use exposes, we fix."],
  ["mail", "A monthly summary", "What ran, what it did, what needs you."],
  ["run", "Improvements", "Better replies, sharper ads, new automations."],
];

export const APPROACH_FAQ: readonly (readonly [string, string])[] = [
  ["How much of my time does it take?", "About two hours over three weeks: the audit call, approving the plan, and a launch walkthrough."],
  ["Do I need new software?", "No. We build inside the tools you already use. If something is missing, we’ll recommend it in the audit."],
  ["Who owns the system?", "You do. It runs in your accounts and comes with full documentation."],
  ["What does it cost?", "It depends on what we build. You get a fixed quote after the audit call, before any work starts."],
];
