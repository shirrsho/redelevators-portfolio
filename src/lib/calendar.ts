// The interactive 3-week calendar (Home ch.07, Approach hero).
// Ported unchanged from redesign-mockups/r3/site.js (CAL_PLAN, CAL_YOU, CAL_TIP, PHASE, mountCal3).

export type Phase = "audit" | "design" | "build" | "live";

/** Weekdays of each of the three weeks. Weekends are not working days. */
export const CAL_PLAN: readonly (readonly Phase[])[] = [
  ["audit","audit","audit","design","design"],
  ["design","build","build","build","build"],
  ["build","build","build","build","live"],
];

/** Days that need the owner ("week-day" keys). */
export const CAL_YOU: Readonly<Record<string, 1>> = {"0-0":1,"0-4":1,"2-4":1};

/** Detail line per day ("week-day" keys, 0-based). */
export const CAL_TIP: Readonly<Record<string, string>> = {
  "0-0": "You: 30-min audit call",
  "0-1": "We walk your inbox, calendars and hand-offs",
  "0-2": "Leak report ready: what to fix first",
  "0-3": "Workflow drafted, every checkpoint marked",
  "0-4": "You: approve the plan (15 min)",
  "1-0": "Final tweaks to the design",
  "1-1": "Building inside your own tools",
  "1-2": "Connecting PMS, inbox and calendars",
  "1-3": "Writing replies in your voice",
  "1-4": "First test run on real data",
  "2-0": "Edge cases: refunds, late arrivals",
  "2-1": "Second test run, all paths",
  "2-2": "All tests passing",
  "2-3": "Soft launch on one unit",
  "2-4": "You: launch walkthrough. You’re live",
};

/** Phase label and colour. */
export const PHASE: Readonly<Record<Phase, readonly [label: string, color: string]>> = {
  "audit": ["Audit","rgba(185,195,255,.62)"],
  "design": ["Design","rgba(255,196,140,.68)"],
  "build": ["Build","rgba(255,45,59,.72)"],
  "live": ["Live","rgba(143,212,176,.78)"],
};

/** Detail line when a whole phase is highlighted (from a linked step, not a day). */
export const PHASE_SUMMARY: Readonly<Record<Phase, string>> = {
  audit: "Days 1–3 · we learn your setup.",
  design: "Week 1 · a plan in plain language.",
  build: "Weeks 2–3 · built and tested in your tools.",
  live: "Week 3 onward · live, then we run it.",
};

export const CAL_WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const CAL_RUN_LINE = "Week 4 onward · we run it, you get a monthly summary";
export const CAL_HINT = "Hover or tap a day to see what happens.";
export const CAL_NEEDS_YOU = "Needs you (3 times)";
