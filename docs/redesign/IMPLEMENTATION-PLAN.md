# Implementation plan

Port the approved mockups into the existing app. Work **phase by phase**. Finish each phase with the [QA checklist](QA-CHECKLIST.md) and a browser comparison against the mockup preview, then commit to the feature branch, before starting the next.

## Current codebase (surveyed 14 Oct 2026)
- **Framework:** Next **16.3.4**, React **19.2.8**, TypeScript 5.9, **Tailwind v4** (CSS-first via `@tailwindcss/postcss`, tokens in `src/app/globals.css` `@theme`, no config file), **Motion 13** (`motion/react`). npm with `package-lock.json`. Node 22 (Docker and CI).
- **App Router routes (`src/app`):** `/`, `/services`, `/services/[slug]` (`generateStaticParams`, `dynamicParams = false`), `/systems`, `/approach`, `/contact`. Root `layout.tsx` (metadata, viewport, JSON-LD, Umami, Meta Pixel). Also `sitemap.ts`, `robots.ts`, `manifest.ts`, OG/Twitter image files, `not-found.tsx`.
- **Content:** `src/lib/content.ts` (`services`, `serviceDetails`, `nav`, `bookingUrl` = Google appointment link, …). SEO helpers in `src/lib/seo.ts`. Analytics in `src/lib/analytics.ts` + `src/components/Analytics.tsx`. Logos in `src/lib/toolLogos.ts`.
- **Components:** 34 flat files in `src/components/`.
- **Deploy:** `output: "standalone"` with a multi-stage Docker image. GitHub Actions `deploy.yml` runs on push to `main`: lint + build → Docker Hub → SSH to the VPS → `docker-compose.prod.yml` (with a Cloudflare tunnel). **A push to `main` deploys production.**
- **Not present:** no tests, no `middleware`/`proxy`, no redirects yet.

## Next 16 rules (read the doc before touching each area)
Docs root: `node_modules/next/dist/docs/`. The main guide is `01-app/02-guides/upgrading/version-16.md`.
- **Async request APIs:** `params`, `searchParams`, `cookies()` and `headers()` must be **awaited**. Use `npx next typegen` for `PageProps`/`LayoutProps`.
- **Turbopack** is the default for dev and build.
- **`middleware.ts` is now `proxy.ts`** (Node runtime). We shouldn't need one; redirects go in `next.config.ts`.
- **Caching:** `"use cache"` needs `cacheComponents: true`. These pages are static; don't add caching unless needed.
- **Smooth scrolling:** Next no longer overrides `scroll-behavior: smooth` on navigation. Add `data-scroll-behavior="smooth"` to `<html>` if globals keep smooth scrolling (version-16.md, about line 961).
- **ESLint:** `next lint` is removed. Use `npm run lint` (flat config).
- **Reference docs:**
  - **Fonts:** `01-app/01-getting-started/13-fonts.md`, `01-app/03-api-reference/02-components/font.md`.
  - **Metadata:** `01-app/01-getting-started/14-metadata-and-og-images.md`, `01-app/03-api-reference/04-functions/generate-metadata.md`.
  - **Redirects:** `01-app/03-api-reference/05-config/01-next-config-js/redirects.md`.
  - **Scripts:** `01-app/02-guides/scripts.md`.
  - **Images:** `01-app/03-api-reference/02-components/image.md` (new defaults; local `src` with a query string needs `images.localPatterns`).

## Architecture choices
- **Server components by default.** Only the interactive pieces listed as (C) in COMPONENTS.md are client components. Copy is rendered on the server.
- **Styling:**
  - Tailwind v4 utilities for layout and spacing, with the tokens in `@theme`.
  - The intricate component CSS (story, devices, player, scenes) moves as **CSS Modules or a component stylesheet**, ported from the mockup almost line for line.
  - Don't try to rewrite 2,000 lines of tuned CSS into utility classes. It risks visual drift.
- **Animation:**
  - Keep the mockups' approach: CSS transitions + `requestAnimationFrame` + IntersectionObserver, wrapped in hooks (`useInView`, `useReducedMotion`, `useRafLoop`, `useScrollProgress`).
  - Use Motion only where it makes the code simpler, and never at the cost of matching the mockup's timing.
- **Data:** `src/lib/services.ts` (SERVICES + chains), `src/lib/runs.ts` (player RUNS), `src/lib/story.ts` (PAINS, TURNS, N, LIFT), `src/lib/pricing.ts` (PRICE per currency), `src/lib/journey.ts`, `src/lib/controlRoom.ts`. All typed.
- **Illustration markup** (scene HTML strings in the mockups) becomes small JSX components. Keep the `data-at`/`data-to` step model as props (`at`, `to`).
- **Booking:** the Cal.com inline embed (`@calcom/embed-react`). Check that it supports React 19 before installing; if it doesn't, use Cal's vanilla embed snippet in a client component. Read the event link from `src/lib/site.ts`.
- **Currency:** a context provider with `localStorage` (`re-cur`), wrapped in try/catch, defaulting to USD.

## Stages, tracks and file ownership

The build runs in **3 stages**. Stage 2 runs **4 tracks in parallel**, each in its own git worktree, on its own branch and dev-server port. Parallel work stays safe because of **file ownership**: Stage 1 creates every shared file and a **stub for every cross-track component** (its final props, a placeholder render). After that, each track only edits the files it owns.

Branches: `redesign-2026` is the integration branch. Tracks branch off it **after Stage 1 is merged**: `redesign-2026-a`, `-b`, `-c`, `-d`. Nothing is merged or pushed to `main` until the owner says so (`main` deploys production).

Every stage and track ends with: lint and build pass → [QA checklist](QA-CHECKLIST.md) for its pages → a side-by-side check with the mockup at 1440 / 1280 / 900 / 768 / 375 → commit to its own branch (short message, no co-author line).

### Stage 1: Foundation (one session, alone)
Combines the old phases 0 and 1, plus the data layer and stubs.
- **Fonts:** Schibsted Grotesk, Hanken Grotesk and JetBrains Mono via `next/font`.
- **Globals:**
  - Tokens in `@theme` and `:root`, the Aurora background.
  - Base type, buttons, chips, tags, reveal.
  - The reduced-motion base.
- **Assets:** logo assets in `public/brand/`, plus the favicon set.
- **Hooks:** `useInView`, `useReducedMotion`, `useRafLoop`, `useScrollProgress`.
- **Shell:** `Nav`, `MobileSheet`, `Footer`, `Section`, `SectionHead`, `PageHero`, `CTABand`, `Logo`, and all of `ui/`: `Button`, `Chip`, `Tag`, `Icon`, `ToolLogo`, `FAQ`.
- **Data, all of it, typed:** `src/lib/services.ts`, `runs.ts`, `story.ts`, `journey.ts`, `pricing.ts`, `controlRoom.ts`, `site.ts` (email, Cal link, WhatsApp link builder).
- **Currency context**, wired in `layout.tsx`.
- **Routes:**
  - Every route as a skeleton page with real metadata.
  - `next.config.ts` redirects, `sitemap.ts`, `robots.ts`.
- **Stubs** (final props interface, placeholder box, `// STUB: owned by track X` comment) for every component in the ownership table below.
- **Notes:** `docs/redesign/NOTES.md`, plus an empty `NOTES-A.md` … `NOTES-D.md`.
- *Accept:*
  - Every route renders the shell and stubs; the nav matches `/_design/nav-hero/`.
  - The fonts and tokens match `/_design/fonts/` and `/_design/components/`.
  - The old slugs redirect.
  - Merged into `redesign-2026`.

### Stage 2: Parallel tracks
| Track | Builds | Owns (only these files) | Model |
|---|---|---|---|
| **A · Inner pages** | `/services` (duo hero), `/services/[slug]` (8 heroes, screen cards, Try it, BeforeAfter, What you get, FAQ, related), `/approach`, `/pricing`, `/privacy`, 404 | those `src/app/**` route files; `components/cards/*`, `components/viz/*` (except ToolOrbit), `components/devices/{ScreenCard,ServiceHero*,ServicesDuo}`, `components/interactive/{Calendar3Week,PricingTiers,PlanBuilder,SavingsCalculator,BeforeAfter,AssistantDemo}` | Sonnet, high |
| **B · Systems** | `/systems` (control room hero, player with tabs, journey swipe), the shared player | `src/app/systems/**`; `components/interactive/{SystemPlayer,ControlRoom,Journey}` (**both** Journey modes: swipe and pinned) | Sonnet, high |
| **C · Booking** | Cal.com embed, alive phone, booking stage, `/contact`, booking analytics | `src/app/contact/**`; `components/interactive/{CalBooker,BookingStage}`, `components/devices/AlivePhone` | Sonnet, high |
| **D · Homepage** | the story stage and chapters 04–09 assembled on `/` | `src/app/page.tsx`; `components/story/*`, `components/devices/{PhoneMockup,LaptopConsole,Notification}`, `components/viz/ToolOrbit` | **Opus**, high |

Cross-track use goes **through the stubs**. For example, A's service page renders B's `<SystemPlayer service=…/>`, and D's homepage renders A's `<SavingsCalculator/>`, B's `<Journey pinned/>` and C's `<BookingStage/>`. Until the other track merges, you see its stub. That is expected.

**Rules for every track:**
- **Shared files are frozen** after Stage 1: `globals.css`, `layout.tsx`, `src/lib/*`, `components/ui/*`, `components/layout/*`, `next.config.ts`, `package.json`.
  - If you need a change there, **don't make it**: write it in your `NOTES-<track>.md` under "Shared changes needed", and work around it locally (a CSS Module, a local helper).
  - **Exception:** Track C may add the Cal.com embed dependency. Note the exact `npm install` command in `NOTES-C.md`.
- **Don't change a stub's props interface.** If it must change, write it in your notes.
- Commit often to your own branch. **Never merge, rebase onto, or push** anything else.

### Stage 3: Integration and launch prep (one session)
- **Merge order:** merge A, B, C, D into `redesign-2026`, one at a time, in that order. After each merge: lint, build, quick QA.
- **Shared changes:** apply the "Shared changes needed" items from every `NOTES-*.md`.
- **Stubs:** confirm none remain (`grep -r "STUB:" src`).
- **Final checks:** the full QA checklist across every page and width; metadata, OG and JSON-LD; the full analytics event table; a Lighthouse pass (LCP and CLS on home and services).
- **Report:** list the owner items from DECISIONS → still open. **Don't merge to `main`.**

### Homepage notes (Track D, the hardest part)
- **Port `home.js` structure-for-structure.**
- **Keep the numbers:**
  - the segments, `GAP` 86, and the lerp 0.12;
  - the `X()` column helper and `--edge`;
  - the measured `copyRight`, recomputed only when the step changes;
  - the FLIP, and the +0.12 stagger;
  - the return-card curve, and the phone-version CSS.
- **Add:**
  - an off-screen pause for the rAF loop;
  - a **static reduced-motion version** (chapters as stacked sections);
  - the server-rendered first frame (the H1 and lead are in the HTML).
- *Accept:*
  - No lift-card or text overlap at 1100, 1280, 1440 or 1900.
  - Content stays inside the 1240 column.
  - The phone version works at 375.
  - The loop stops off-screen.

## Known risks and how to handle them
- **Visual drift:** port the CSS rather than re-deriving it. Compare screenshots against the preview at every phase.
- **Homepage performance:** many simultaneous animations.
  - Gate every loop on visibility.
  - Avoid layout reads inside the per-frame loop where possible (the mockup measures `copyRight` only when the step changes; keep it that way).
  - Use `transform`/`opacity` only.
- **Hydration mismatches:** randomness (control room ticks) and time-based state must start after mount (inside `useEffect`).
- **Cal.com:** free-plan limits, and branding stays. Confirm embed theming options at build time.
