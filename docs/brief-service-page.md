# Design brief — service page

**Status: live.** `/services/sales-outreach-systems` is the first real service page, built and
shipping 12 September 2026 after the taxonomy rebuild (two pillars, Marketing and AI Automation,
eight services — see `PRODUCT.md` → *Evidence on Hand*). The original pilot, **Sales & follow-up**,
no longer exists as a service and was replaced by **Sales & Outreach Systems** — the closest match
by name, though its actual mechanism (outbound lead research + personalized email) differs from
the old pilot's (inbound speed-to-lead routing); its manual chain and System Anatomy were written
fresh, not ported. The other seven services have no detail page yet — each needs its own manual
chain before it can go live, same as this one did.

Companion to [`site-plan.md`](site-plan.md) (workstream E, item 2). Product truth in
[`../PRODUCT.md`](../PRODUCT.md); visual rules in [`../DESIGN.md`](../DESIGN.md); components in the
[styleguide](design-system.html).

---

## 1. Job and audience

**Visitor mode: Persuade.** Success is the visitor deciding and booking.

One template, eight pages. `Sales & Outreach Systems` is the worked example; the structure serves
all eight service lines already defined in `src/lib/content.ts`.

The reader is the person who currently does the repetitive work themselves or watches their team
do it — a founder, an ops or RevOps lead, a marketing lead. They arrive with a felt cost, not a
technology shortlist. Audience stays deliberately broad across B2B SaaS, e-commerce, professional
services and agencies; **copy must not narrow to a single vertical.**

**The page must stand alone.** It is designed to work for a cold arrival from search as well as a
warm click from the home page: it establishes what Red Elevators does in one clause rather than
one section, and never assumes the home page was read.

## 2. Outcome and proof

**Primary action:** book the 30-minute call. It is the page's only destination — no competing
conversion, no newsletter, no download.

**Secondary path:** move sideways into another service, staying inside the six.

**Proof is mechanism, and only mechanism.** The page carries no metrics, no client names, no
logos, no testimonials, because none exist that can be substantiated. What it does carry is true
and already known: the real workflow chain, the real tool names, the four-stage engagement, and
the points where a human still checks in.

**Hard constraint on the "today" chain.** The before/after device must not smuggle fabricated
numbers in as atmosphere. No durations, no percentages, no "9 hrs". The manual chain is described
by *who does it and what stalls it* — "a person checks", "waits for someone free", "copied by
hand" — which is observably true and needs no measurement.

## 3. Selected direction

**Concept: The Handover.** The page's spine is a comparison — what happens today against what
happens after — and the transformation between them is the argument. It states the product's own
principle ("sell the removal of work") in the most literal available form, and it reuses the
System Anatomy as the "after" rather than introducing a second proof device.

**Focal moment.** The two chains meeting. The manual chain sits grey and hairline, a person marked
at every step; the automated chain is the System Anatomy with its red pulse running and tools
named. On entering view the pulse starts and the manual chain settles back in tone. Under reduced
motion both render statically, side by side, and the comparison still reads completely.

**Consequence for the build:** each service needs its manual "today" chain authored. This is the
cheapest content on the site to write — it is a description of how things already work — but it is
a real dependency, and the page cannot ship for a service until that chain exists.

## 4. Scope and boundaries

**In scope:** one service page template, responsive, at `/services/[slug]`.

**Out of scope for this brief:** the services index page, the other five services' content, the
navigation rebuild that multi-page routing will eventually need, and the remaining design-system
gaps (prose styles, 404, error states).

**Untouched:** the home page, the visual world, every rule in `DESIGN.md`.

**Anti-goals.** No case-study section. No logo wall. No testimonial band. No metric tiles. No
pricing. No second accent color. No dark variant. Nothing from the three named anti-references —
the AI-startup look, the stock-photo agency look, the growth-hacker look.

## 5. Page structure

Ordered. Each block names its ground so the tonal rhythm is deliberate.

| # | Block | Ground | Purpose |
|---|---|---|---|
| 1 | **Page header** | Paper | Mono label (`Services · 03 of 06`), h1, one-sentence lede, primary + secondary CTA. Uses the page-header pattern prototyped in the styleguide. Establishes context for a cold arrival in one clause. |
| 2 | **The felt cost** | Paper | Two or three lines naming what happens today in the visitor's language. A lead-in, not a section of prose. |
| 3 | **The Handover** | Chalk | The focal moment. Manual chain against System Anatomy. The page's whole argument. |
| 4 | **Where a human still checks in** | Paper | The trust move. Most automation pitches hide this; naming it is differentiating and is already product truth. |
| 5 | **Where it runs** | Paper | The real tools for this service, drawn from the confirmed tool list. A tool list, never a client logo wall. |
| 6 | **How we get there** | Graphite | The four stages scoped to this service, reusing the process rail. Provides the dark tonal break. |
| 7 | **Depth (optional slot)** | Chalk | What's included, what's out of scope, common questions. **Genuinely optional** — see below. |
| 8 | **Related services** | Paper | Two or three service cards. Keeps the visitor inside the six. |
| 9 | **CTA panel** | Elevator Red | The 32px red panel. The one destination. |

**The optional slot rule.** Block 7 must be genuinely optional: the page reads as finished when it
is absent, and its absence leaves no visible hole. It sits after the core argument for exactly
that reason. This is the guard against scaffolded slots becoming the next generation of
placeholder content — an empty slot is never filled with invented content to make the layout work.

## 6. Interaction and layout

- Single 1152px container, 24px gutter, 96px section rhythm. Only grounds go full-bleed.
- **The Handover** stacks vertically on mobile — manual chain above, automated below, comparison
  preserved by order. Never a horizontally scrolling row.
- Chains run 4–7 nodes. Beyond seven, wrap rather than compress.
- Every section opens with a mono label above its heading (The Label-First Rule).
- Cards rest flat, lift on hover (The Flat-Until-Touched Rule).
- Motion is present but purposeful: the Handover is the one orchestrated moment; everything else
  is entrance reveals and state feedback. The optional depth block stays quiet — it is the one
  reading-shaped part of a persuasion page.
- **All four grounds appear on this page**, so focus states must be designed for each of them per
  The Visible Focus Rule.
- Exactly one `h1`. Real heading hierarchy — the page has to function as a search landing page.

## 7. States and ranges

| Thing | Min | Typical | Max | Empty behaviour |
|---|---|---|---|---|
| Chain nodes | 4 | 5–6 | 7 | n/a — a service without a chain does not ship |
| Node label | 1 word | 1–2 words | ~14 chars | n/a |
| Tools listed | 3 | 4 | 6 | Omit block 5 entirely |
| Depth items | 0 | 0 at launch | 8 | Omit block 7 entirely; no hole left behind |
| Related services | 2 | 3 | 3 | Omit block 8 |

Every block above is independently omittable, and the page must remain composed with any
combination of them absent.

## 8. Constraints and open decisions

**Binding constraints**

- Everything in `DESIGN.md` — all fifteen named rules apply without exception.
- No fabricated proof of any kind, including durations on the manual chain.
- The page header must not paint at `opacity: 0` awaiting hydration (audit finding F4). Whatever
  reveal it uses animates from a visible resting state.
- The cascade-layer fix (F1) should land before or with this page; heading utilities are otherwise
  silently discarded.
- Server-render the content; confine client components to the parts that genuinely animate.

**Open decisions — do not invent these**

1. **Which service is the template — decided.** `Sales & Outreach Systems` (AI Automation), picked
   12 September 2026 for the same reason as the original choice — the most legible manual chain —
   and because it has an already-written real mechanism description in
   `Red-Elevators-AI-Portfolio.pdf` ("Outreach that researches itself") to build the automated
   chain from honestly, rather than inventing one.
2. **The manual "today" chain per service — done for the pilot, still open for the other seven.**
   `Sales & Outreach Systems`'s chain is generic, industry-typical descriptive copy of how outbound
   prospecting commonly works without this system — not a claim about any specific client, so it
   doesn't need the evidence clearance a named case study would. Each remaining service still needs
   its own: 3-5 short steps, each naming who does it or what it waits on (no durations, no
   percentages).
3. **Whether block 7 ships at launch — decided.** No. The brief's own states table already put
   Depth items at 0 for launch; block 7 is omitted from the built page entirely.
4. **URL scheme — decided.** `/services/[slug]`, `generateStaticParams`-gated on content
   completeness. The `/services` index is now built too — see decision 5.
5. **Whether the index page ships alongside the first detail page — decided, superseded.** Built 12
   September 2026 as part of the taxonomy rebuild, before any detail page existed — see
   `docs/changelog.md`. Cards only link once `serviceDetails[slug].manualChain` is populated, so it
   never points at a 404.
6. **Navigation.** Partially addressed: the nav's Services link now points at `/services` instead
   of a same-page anchor (12 Sep 2026). The fuller redesign — dropdown/mega-menu, active-page state
   — is still out of scope and still undesigned (site-plan.md workstream D, item 4).
