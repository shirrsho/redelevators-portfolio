@AGENTS.md

# Red Elevators — project context

Read these before doing design or content work. They are the authority; this file is only a map.

| File | Owns | Read it when |
|---|---|---|
| [`PRODUCT.md`](PRODUCT.md) | Product truth — users, positioning, proof strategy, constraints, what evidence actually exists | Before writing any copy, claim, or number |
| [`DESIGN.md`](DESIGN.md) | The visual system — tokens, named rules, components as built | Before touching any UI |
| [`.impeccable/design.json`](.impeccable/design.json) | Machine-readable sidecar: tonal ramps, motion, shadows, component snippets, planned extensions | When you need exact values or the unbuilt-component list |
| [`docs/site-plan.md`](docs/site-plan.md) | Approved strategy, workstreams, build order | Before starting new work |
| [`docs/changelog.md`](docs/changelog.md) | What has shipped, and why | To find out what changed and when |
| [`docs/design-audit-2026-09-09.md`](docs/design-audit-2026-09-09.md) | Verification record and open technical findings | When something renders unexpectedly |
| [`docs/accessibility-audit-2026-09-10.md`](docs/accessibility-audit-2026-09-10.md) | Contrast measurements; three open brand decisions | Before choosing any text colour |
| [`docs/brief-service-page.md`](docs/brief-service-page.md) | The confirmed plan for a service page — structure, states, open decisions | Before building any service page |
| [`docs/design-system.html`](docs/design-system.html) | The living styleguide — foundations, live components, proposed components | When you need to see or feel the system, not just read it |

The styleguide is published as a private artifact at **https://claude.ai/code/artifact/59fa371d-2124-4966-b133-508fdddf88fc**. To update it, edit
`docs/design-system.html` and republish **to that URL** — publishing without it creates a second,
competing artifact.

## Non-negotiables

**Never invent proof.** The site was cleaned of fabricated proof on 9 Sep 2026 and **currently
makes no unverifiable claim.** Keeping it that way is the job. Do not add a number, client name,
logo, testimonial, award or date that cannot be substantiated — not as a placeholder, not as lorem,
not "to swap later." Design proof sections as real structure with honest empty slots, or omit them.
There are still no testimonials and no case studies, and that is deliberate. Full rules in
`PRODUCT.md` → *Evidence on Hand*.

**Prove with mechanism, not outcome.** When a surface seems to need credibility, show the real
workflow — the chain, the tools, the hand-off points. See `PRODUCT.md` → *Proof strategy* and the
System Anatomy component in `DESIGN.md`.

**One red, everything else neutral.** No second chromatic color. No dark mode, no
`prefers-color-scheme` handling, no theme toggle — the site is light-only by decision, and the
unused dark brand assets in `public/brand/` are out of scope, not a defect.

**Compute contrast, never eyeball it.** Neutral text passes AA; **Elevator Red fails as small
text** (3.69:1 on Paper) and that is an open, unresolved failure affecting every mono label. Do not
add new small red text until it is decided. Flatten any opacity before measuring — `white/85` on
red is 2.99:1, not what the swatch suggests.

## Known traps

**Cascade layers.** `src/app/globals.css` styles `h1, h2, h3, h4` and `.font-mono-label` **outside
any cascade layer**, so they beat every Tailwind utility. A typography class on a heading is
silently discarded, and 16 `!` important modifiers exist across the components solely to fight
this. Verify heading type in the browser rather than trusting the class list. Fix and rationale:
audit finding F1. Note the corollary — a `<span>` *is* affected by utilities, so display-face text
outside a heading needs `tracking-[-0.03em]` written explicitly.

**Content that waits for JavaScript.** The hero headline still paints at `opacity: 0` until
`motion` hydrates (audit F4). `Counter` was fixed on 9 Sep to render its true value server-side —
follow that pattern, not the hero's. Anything carrying a fact must be correct in the served HTML.

**Next.js 16's post-navigation scroll management.** Per `Link`'s own docs (`node_modules/next/dist/docs`),
Next skips `position: fixed`/sticky top-level elements when deciding what to scroll into view after
a navigation. This app's `<ScrollProgress/>` and `<Nav/>`'s header are both fixed top-level
siblings of `<main>` on every page — confirmed live (12 Sep 2026) that Next falls through `<main>`
entirely and lands on `<footer>`, scrolling every navigation to the bottom of the destination page
instead of the top. Every internal `Link` in this app passes `scroll={false}` because of this;
`Nav.tsx` positions scroll itself instead. If you add a `Link` anywhere, give it `scroll={false}`
too, or it'll fight Nav's own positioning. Full investigation: `docs/changelog.md`.

## Stack notes

Next.js 16 App Router, React 19, Tailwind CSS v4 (tokens in `@theme` in `src/app/globals.css`, no
`tailwind.config`), `motion` for animation. Page content is centralized in `src/lib/content.ts`.
`next.config.ts` uses `output: "standalone"`; production deploys via GitHub Actions to a VPS behind
a Cloudflare Tunnel.
