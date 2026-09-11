# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Related Documents

- [`DESIGN.md`](DESIGN.md) — the visual system: tokens, named rules, components as built.
- [`docs/site-plan.md`](docs/site-plan.md) — approved strategy, workstreams and build order.
- [`docs/changelog.md`](docs/changelog.md) — what has shipped, and why.
- [`docs/design-audit-2026-09-09.md`](docs/design-audit-2026-09-09.md) — verification record and
  open technical findings.
- [`docs/accessibility-audit-2026-09-10.md`](docs/accessibility-audit-2026-09-10.md) — contrast
  measurements and the three open brand decisions.

## Users

The primary buyer is **deliberately broad, and that breadth is intentional** — not an unresolved
gap to be narrowed by a future session. Inbound spans B2B SaaS, e-commerce, professional services
and other agencies, and the site must stay legible to all of them at once.

Across those segments the reader is the person who currently *does the repetitive work themselves
or watches their team do it* — a founder, an operations or RevOps lead, or a marketing lead. They
arrive with a felt cost (leads going cold, reports rebuilt by hand every Monday, campaigns that
stall without someone babysitting them) rather than with a technology shortlist.

No single segment has been designated primary. Do not invent one, and do not write copy that
silently narrows to a single vertical.

## Product Purpose

Red Elevators is a **marketing and automation agency**. It audits a client's repetitive marketing,
sales and operations work, designs workflows to replace it, builds those workflows inside the
client's existing tools, and hands over a running, documented system.

Six service lines are shipped on the site today: marketing automation, growth and paid media,
sales and follow-up, ops and reporting, AI agents, and custom internal tools.

Success for the business is a booked 30-minute call. Success for the client is work that used to
require a person now running without one.

## Positioning

Two claims are made in the shipped copy. **Both come from existing site copy and were not
independently confirmed in the init interview** — treat them as the working position, and confirm
before making either louder or building a surface around it:

- The systems are built **inside the tools the client already uses**, not on a separate platform
  the team has to learn and log into.
- The engagement ends in **handover with documentation** — the system keeps running whether the
  agency is in the room or not.

### Proof strategy (decided 9 September 2026)

**Sell the machine, not the outcome.** Because no publishable results exist yet (see *Evidence on
Hand*), credibility is carried by showing the **mechanism** — the actual trigger-to-action chain,
named tools and all — rather than by asserting outcomes. Nearly every competitor writes some
version of "we automate your funnel"; almost none will show the wiring. Showing it needs no
client's permission, makes no claim that could be false, and is more persuasive than a number a
visitor has no reason to believe.

This is a durable strategic decision, not a stopgap. When a surface seems to need proof, the
answer is **more specific mechanism** — never a number we cannot stand behind. It survives the
arrival of real case studies: those become an addition to the mechanism story, not a replacement
for it.

## Operating Context

**Engagement shape** — a four-stage sequence that is real product truth, not a marketing device:
Audit (map every repetitive task, attach an hour and dollar figure to each) → Design (define
triggers, touchpoints, and exactly where a human still checks in) → Build (inside existing tools)
→ Run (monitor, refine, hand over documentation).

**Client tool surface** — work lands in the client's own stack. Tools named on the site:
HubSpot, Zapier, Make, n8n, OpenAI, Claude, Salesforce, Airtable, Slack, Notion, Webflow,
Google Ads, Meta Ads, Klaviyo, Segment.

**Conversion path** — a free 30-minute call booked at `https://calendly.com/redelevators/30min`,
plus direct email to `contact@redelevators.com`. There is no form, no signup, and no self-serve
product. Every primary CTA on the site currently resolves to that call.

## Capabilities and Constraints

- **Site scope is a full multi-page site.** Confirmed architecture, in build order: Home (exists)
  → Services index plus six service pages → Approach → Systems/Teardowns → About → Contact →
  Blog/Resources (conditional). Every page keeps the single 1152px container and resolves to the
  same 30-minute call. Sequencing, rationale and acceptance criteria live in
  [`docs/site-plan.md`](docs/site-plan.md).
- **Case studies are replaced by Systems/Teardowns for now** — anonymized, mechanism-led pages
  that make no unverifiable claim. They convert into real case studies once results are measured
  and cleared. See *Proof strategy* above.
- **The design system does not yet cover a multi-page site.** No form controls of any kind, no
  page-header pattern, no long-form prose styles, no scaling navigation, no 404 or empty states,
  and no focus-visible styling anywhere. These are tracked as workstream D in the site plan.
- **Stack (existing, not up for re-decision):** Next.js 16 App Router, React 19, TypeScript,
  Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`), `motion` for animation.
  Content is centralized in `src/lib/content.ts`.
- **Deployment:** GitHub Actions builds a Docker image on push to `main` and deploys to a VPS,
  served through a Cloudflare Tunnel. `next.config.ts` uses `output: "standalone"` — the
  production image ships no `node_modules`, so anything requiring runtime file access or
  unbundled dependencies needs checking against that build.
- **Domain:** `redelevators.com`.
- **Open decision — dark theme.** The brand sheet defines a complete dark theme and dark
  logo/mark SVGs are already committed at `public/brand/`, but the site ships light-only
  (`color-scheme: light`). The user's current instruction: **do not implement dark theme now.**
  If the light theme reaches the intended quality bar, light-only may become permanent. Revisit
  only when the user raises it — do not treat the unused dark assets as a defect to fix.

## Brand Commitments

- **Name:** Red Elevators. **Tagline:** "Growth on Autopilot" — used as a standing sign-off, set
  in uppercase letter-spaced mono.
- **Brand sheet on file:** `docs/red-elevators-brand-example.pdf` (light and dark sheets).
- **Palette (light, in use):** Elevator Red `#FF2D3B` · Graphite `#17171B` · Paper `#FFFFFF`.
- **Palette (dark, defined but unused):** Elevator Red `#FF4550` · Ice `#EDEDF0` · Void `#0E0E10`.
- **Typography:** Space Grotesk (display/headings) · Inter (body/UI) · JetBrains Mono
  (accent/tagline, uppercase and letter-spaced). All three are loaded via `next/font/google`.
- **The mark:** three ascending rounded bars with particles rising off the tallest — an elevator
  reading of the name. Brand sheet rule: **clear space equal to one bar's width on all sides.**
  Assets: `public/brand/red-elevators-{logo,mark}-{light,dark}.svg`.
- **Voice in shipped copy:** direct, second-person, concrete about the work being removed
  ("no lead ever goes cold again", "the Monday-morning report now builds itself overnight").
  Not confirmed as a binding voice guide — treat as the incumbent register.

## Evidence on Hand

**This section governs. Read it before writing a single number onto a page.**

Every quantitative and social proof claim currently on the site is **fabricated placeholder**,
confirmed by the user:

- The four headline stats — `40+ growth systems shipped`, `18 hrs avg. weekly hours saved`,
  `3.4× avg. pipeline lift in 90 days`, `6 wks to first system live`.
- All four case studies in `src/lib/content.ts` and their metrics — `2 min`, `+38%`, `18 hrs`, `5×`.
- Both testimonials, including their attributions ("Operations Lead, Mid-market services company"
  and "Founder, B2B SaaS, Series A").
- The hero trust line, `Trusted by 40+ growing teams`.

**What is actually true:** Red Elevators has delivered work for **a few real paying clients**.
Those engagements were **never measured or written up** — there are no compiled results, no
published metrics, and no cleared testimonials.

Binding rules for all future work:

1. **Never invent a number, metric, client, logo, testimonial, award, or date.** Not as a
   placeholder, not as lorem, not "to be swapped later." Placeholder proof is how the current
   fabrications got here.
2. Design proof sections as **empty slots with real structure**, or omit the section, rather than
   filling it. A missing testimonial band is honest; a fake one is not.
3. Real case studies require the user to supply outcomes first. Surfacing what needs collecting
   from them is in scope; producing it is not.
4. Existing fabricated claims may be removed or replaced with true statements at any time. They
   may not be reworded into new fabrications or carried forward because they already ship.

### Remediation — SHIPPED 9 September 2026

Completed (workstream A in [`docs/site-plan.md`](docs/site-plan.md); detail in
[`docs/changelog.md`](docs/changelog.md)). Verified against the served HTML, not just the source:

- ✅ **Deleted** the hero's "Trusted by 40+ growing teams" line and its four fake avatar dots.
- ✅ **Replaced** the four headline stats with true *capability* numbers — tools built inside, service
  lines, process stages — keeping the band and its visual weight.
- ✅ **Replaced** the four fabricated case studies with System Anatomy diagrams (mechanism, not
  outcome).
- ✅ **Removed** the testimonials section entirely until real, cleared quotes exist.
- ✅ **Reframed** the hero panel's illustrative figures so they cannot be read as claims.

**Still outstanding, and now the highest-leverage item on the whole plan:** ask two of the existing
real clients for three sentences each. It is blocked on nobody but us. The testimonial section
returns when those arrive — the component pattern is preserved in the styleguide for that purpose.

The site currently makes **no** unverifiable claim. Keeping it that way is the standing constraint;
the rules above are not a one-time cleanup.

## Product Principles

1. **Mechanism is the proof.** Trust is earned by showing precisely how the work happens — the
   real chain, the real tools, the real hand-off points — not by asserting how well it worked. The
   proof gap is a design constraint that has been answered, not a content hole to be filled later.
2. **Breadth is deliberate; vagueness is not.** The site speaks to several segments at once, so
   specificity has to come from the *work* being concrete, never from narrowing the audience.
3. **Sell the removal of work, not the technology.** The buyer's felt problem is hours and dropped
   leads. Tool names are evidence of fit, not the pitch.
4. **Build for the multi-page site.** Every pattern introduced now should survive being lifted onto
   a services, about, or case-study page — this is a system, not a one-off page.
5. **One destination.** Every path through the site resolves to the 30-minute call. New surfaces
   inherit that, and do not introduce competing conversion mechanics.

## Accessibility & Inclusion

No product-specific standard or user need has been established with the owner, and no formal
commitment to a WCAG level has been made. Two things are nonetheless true of the shipped site and
should not regress:

- It is motion-heavy and honors `prefers-reduced-motion` globally in `src/app/globals.css`, with a
  second component-level check. Any new motion must keep both intact.
- Colour contrast was measured on 10 September 2026. Neutral text passes WCAG AA. **Three failures
  remain open, all requiring a brand decision** — red as small text, the CTA panel's white-on-red,
  and the marquee. See [`docs/accessibility-audit-2026-09-10.md`](docs/accessibility-audit-2026-09-10.md).

There is also no `:focus-visible` styling anywhere in the codebase. It is designed in the
styleguide and recorded as The Visible Focus Rule, but unbuilt — a larger gap than any contrast
failure.
