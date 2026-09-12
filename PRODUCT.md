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

**Two service pillars, rebuilt 12 September 2026 from the company's own portfolio decks** (see
`docs/changelog.md`), replacing an earlier six-line structure that didn't match either deck:

- **Marketing** — Paid Social Advertising, Creative & Ad Design, E-commerce Growth, Full-Funnel
  Campaigns.
- **AI Automation** — Workflow & CRM Automation, AI Assistants & Chatbots, Sales & Outreach
  Systems, Content Engines.

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

- **Site scope is a full multi-page site.** As built, 12 September 2026: Home, `/services` plus
  **eight** service detail pages (was six before the taxonomy rebuild), `/approach`, `/systems`,
  `/contact`, and a 404. **`/about` is the only planned page not built** — it is blocked on real
  biographical material, not on design; see *Evidence on Hand*. Blog/Resources remains conditional
  and undecided. Every page keeps the single 1152px container and resolves to the same 30-minute
  call. Sequencing, rationale and acceptance criteria live in
  [`docs/site-plan.md`](docs/site-plan.md).
- **Case studies are replaced by Systems/Teardowns for now** — anonymized, mechanism-led pages
  that make no unverifiable claim. They convert into real case studies once results are measured
  and cleared. See *Proof strategy* above.
- **The design system does not yet fully cover a multi-page site.** Form controls, the page-header
  pattern, focus-visible styling and a 404 page shipped 12 September 2026. Still missing: long-form
  prose styles, navigation that scales past a flat link list (four links plus a CTA today — a
  dropdown or mega-menu is undesigned), and error/empty states beyond the 404. Tracked as
  workstream D in the site plan.
- **Stack (existing, not up for re-decision):** Next.js 16 App Router, React 19, TypeScript,
  Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`), `motion` for animation.
  Content is centralized in `src/lib/content.ts`.
- **Deployment:** GitHub Actions builds a Docker image on push to `main` and deploys to a VPS,
  served through a Cloudflare Tunnel. `next.config.ts` uses `output: "standalone"` — the
  production image ships no `node_modules`, so anything requiring runtime file access or
  unbundled dependencies needs checking against that build.
- **Internal preview environment, added 12 September 2026:** pushing the `dev` branch triggers
  `.github/workflows/deploy-dev.yml`, a fully isolated copy of the production pipeline — own image
  tags (`:dev`, never `:latest`), own VPS directory (`redelevators-portfolio-dev`), own compose
  file (`docker-compose.staging.yml`, no `cloudflared` service), published on
  `127.0.0.1:6003` instead of production's `6001` (6002 was tried first but was already in use by
  an unrelated container on the VPS). The owner is adding a `dev.redelevators.com`
  ingress rule to the *existing* Cloudflare Tunnel themselves, pointed at that port — nothing here
  provisions a second tunnel. The build sets `NOINDEX=true` (a Docker build arg, baked in at
  `next build` time since every route is static/SSG) so this environment emits `noindex, nofollow`
  and a disallow-all `robots.txt` — see `src/app/robots.ts` and `layout.tsx`. **This is explicitly
  not a launch** — the team is deciding internally whether/when this becomes public.
- **Domain:** `redelevators.com`. Internal preview: `dev.redelevators.com` (not indexed, not
  announced).
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

**What is actually true, updated 12 September 2026:** Red Elevators has delivered work for real
paying clients, and unlike the 9 September assessment, **real results now exist and are
documented** — see *Real evidence exists, not yet cleared for the site* below. What is still
missing is explicit clearance to publish specific client names, screenshots, or metrics on the
public website. Treat that distinction precisely: "no evidence exists" and "evidence exists but
isn't cleared for this surface" require different handling, and only the second is true now.

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

### Real evidence exists, not yet cleared for the site — 12 September 2026

The user shared two portfolio decks (`Red-Elevators-Marketing-Portfolio.pdf`,
`Red-Elevators-AI-Portfolio.pdf`) containing real, named client work, real screenshots (Meta Ads
Manager tables, actual ad posts, a Shopify sales dashboard) and real metrics — five marketing
clients (intrOs architects, Eshumi Bangladesh, Loopcart, EnScented, Khao San BD) and aggregate
figures for both service pillars (5 brands scaled / 5 industries served for Marketing; 11
businesses automated / 2k+ hours saved per month / 3× faster lead response / 40% lower operating
cost / <14 days kickoff-to-live for AI Automation).

**Explicitly not cleared for public site use as of this writing** — the user's words: "I still
can't show real case studies with actual name, metric or screenshot." These decks are sales
material shown to prospects directly; that is a different clearance bar than the public website.
Until told otherwise:

- Do not put any client name, screenshot, or specific metric from either deck on the site.
- The two service pillars and eight service names/descriptions above **are** cleared — that's the
  company's own positioning copy, not a proof claim, and the user explicitly asked for the
  taxonomy rebuild.
- The stat band stays as-is (capability figures) — the user said not to touch it this round, not
  that the real numbers above are cleared to replace it. **See the drift warning below: two of its
  four values have since gone stale and now need a decision.**
- Ask before assuming clearance status has changed, even after the taxonomy work ships.

### OPEN — the stat band drifted out of true, 12 September 2026

Capability figures are only honest while they still describe the site. Two no longer do, and a
visitor can disprove both by counting what is on the page:

| Stat band claims | The site actually shows | |
|---|---|---|
| `15` Tools we build inside | **19** unique tools in the marquee | ❌ stale |
| `6` Service lines | **8** services (2 pillars × 4) | ❌ stale |
| `4` Stages, audit to handover | 4 stages | ✅ |
| `0` New platforms to learn | positioning claim, not a count | ✅ |

Both drifted on 12 September: the taxonomy rebuild took services 6 → 8, and four tools (HighLevel,
Telegram, Canva, Shopify) were added to the marquee alongside the new System Anatomy chains. The
numbers were correct when written and were not re-checked afterwards.

This is a truth-rule breach of exactly the kind the 9 September pass was meant to end — the figures
are *understated*, not inflated, which makes it a smaller sin but the same category. **Not fixed
unilaterally** because the owner's standing instruction is not to touch the stat band. Fixing it is
a two-value data edit in `src/lib/content.ts` (`6 → 8`, `15 → 19`); the alternative is replacing
the counts with figures that cannot drift. Needs the owner's call.

### BLOCKED — no material exists for an About page, 12 September 2026

`docs/site-plan.md` says that with no case studies, "who we are *is* the trust asset." Nothing in
this document or any other supports such a page: there is **no founding story, no team size, no
location, no role or biography** on record anywhere. This is a genuine absence, not a clearance
problem like the decks above — the facts are unknown rather than restricted.

Owner's decision, 12 September 2026: **defer the page**, to be discussed with other members first.
Do not write an About page from inference, atmosphere, or generic agency language in the meantime —
that is inventing proof about the company itself, which the rules above forbid as firmly as
inventing a client metric.

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
- Colour contrast was measured on 10 September 2026. Neutral text passes WCAG AA. **All three
  failures found — red as small text, the CTA panel's white-on-red, and the marquee — were resolved
  12 September 2026** via two new text/panel-only red tokens and a lightened marquee rest state. See
  [`docs/accessibility-audit-2026-09-10.md`](docs/accessibility-audit-2026-09-10.md).

There is also no `:focus-visible` styling anywhere in the codebase. It is designed in the
styleguide and recorded as The Visible Focus Rule, but unbuilt — a larger gap than any contrast
failure.
