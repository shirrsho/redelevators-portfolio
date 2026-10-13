# Running the build: sessions, order and prompts

## The picture

```
Stage 1  Foundation ─────────────► merge into redesign-2026
                                      │
Stage 2         ┌──────────┬──────────┼──────────┬──────────┐
(parallel)      A Inner    B Systems  C Booking  D Homepage
                pages                                       (each in its own worktree,
                └──────────┴──────────┴──────────┴────┘      branch and port)
                                      │
Stage 3  Integration: merge A → B → C → D, apply shared notes, full QA
```

| Session | Model / effort | Branch (worktree) | Dev port (`.claude/launch.json`) |
|---|---|---|---|
| Stage 1 Foundation | **Opus**, high | `redesign-2026` | `redelevators-dev` (3000) |
| Track A Inner pages | Sonnet, high | `redesign-2026-a` | `redelevators-dev-a` (3001) |
| Track B Systems | Sonnet, high | `redesign-2026-b` | `redelevators-dev-b` (3002) |
| Track C Booking | Sonnet, high | `redesign-2026-c` | `redelevators-dev-c` (3003) |
| Track D Homepage | **Opus**, high | `redesign-2026-d` | `redelevators-dev-d` (3004) |
| Review (before each merge) | **Opus**, high | the track's branch (read-only) | n/a |
| Stage 3 Integration | **Opus**, high | `redesign-2026` | `redelevators-dev-integration` (3005) |

## How to run sessions side by side safely

1. **Keep one mockup preview running for everyone.** In this folder (the main checkout), keep the `site-preview` server running on port 4174. Every session opens `http://localhost:4174/` instead of starting its own.
2. **Stage 1 first, alone.** Start a session on the `redesign-2026` branch with the Stage 1 prompt. When it's done and reviewed, it's merged into `redesign-2026`. Don't start the tracks before that: they depend on its stubs and shared files.
3. **Then start A, B, C and D at the same time.**
   - In the Claude desktop app, start each as a **new session in its own worktree**, based on `redesign-2026`. Each session creates its track branch as its first step.
   - Each worktree is a separate copy of the code, so the sessions can't overwrite each other's files.
   - Each needs its own `npm ci` the first time.
4. **Ownership keeps the merges clean.**
   - Each track edits only its own files (table in IMPLEMENTATION-PLAN).
   - Shared files are frozen. Needed changes go into that track's `NOTES-<track>.md`.
   - The result: merging the four branches back together causes few or no conflicts.
5. **Review, then merge one track at a time.** When a track says it's done:
   - Run the **Review** prompt (Opus) on its branch.
   - Fix anything it finds, in that track's session.
   - Run the **Integration** prompt to merge just that track.
   - Tracks can finish in any order. The integration session merges whichever is ready, preferably A → B → C → D.
6. **Keeping up with the others is optional.** A track that wants to see the others' finished work can sync with `redesign-2026` after they're merged. In the desktop app, ask it to "sync with the base branch".
7. **Nothing goes to `main`** until you say so. A push to `main` deploys the live site.

**If you want to change the design during the build:** change the mockup first (ask in a design session like this one), then tell the track that owns it. The mockup stays the single source of truth.

---

## Prompt: Stage 1, Foundation (Opus, high)

```
We're starting the Red Elevators redesign build. Branch: redesign-2026 (create it from main if it doesn't exist; it should already exist with the mockups and docs committed).

1. Read docs/redesign/README.md and every doc it lists, in order. Read AGENTS.md and the Next 16 docs named in IMPLEMENTATION-PLAN.md for fonts, metadata, redirects and scripts.
2. Open the mockup preview at http://localhost:4174/ (start `site-preview` only if it isn't running). Study /_design/components/, /_design/nav-hero/, /_design/fonts/ and /_design/logo/.
3. Do Stage 1 (Foundation) from docs/redesign/IMPLEMENTATION-PLAN.md, and only that:
   - fonts, tokens, Aurora background, base type and UI primitives;
   - Nav, MobileSheet, Footer and the other layout components;
   - every data module, typed, with content copied unchanged from the mockup JS;
   - the currency context;
   - every route as a skeleton with real metadata, plus redirects, sitemap and robots;
   - a stub for every cross-track component with its final props (`// STUB: owned by track X`);
   - NOTES.md and NOTES-A…D.md.
   The four parallel tracks will build on your stubs and shared files without being allowed to edit them, so get the props interfaces and shared CSS right.
4. Use the `redelevators-dev` server (port 3000). Compare against the mockup at 1440, 1280, 900, 768 and 375. Run docs/redesign/QA-CHECKLIST.md for what exists so far.
5. Commit to redesign-2026: short messages, no co-author line. Don't push. Don't touch main.

Finish with a short report: what's built, the stub list with props, anything you were unsure about, and anything that needs my decision.
```

## Prompt: Track A, Inner pages (Sonnet, high)

```
You're Track A of the Red Elevators redesign: the inner pages. Other sessions are building other tracks in parallel, so stay strictly inside your own files.

Setup: you're in your own worktree. Create branch redesign-2026-a from redesign-2026 and run `npm ci`. Use the `redelevators-dev-a` server (port 3001). The mockup preview is already running at http://localhost:4174/; don't start another.

1. Read docs/redesign/README.md and the docs it lists, especially IMPLEMENTATION-PLAN.md → "Stage 2" (your file ownership and the rules), COMPONENTS.md and ROUTES-AND-CONTENT.md. Read AGENTS.md and the Next 16 docs for whatever you touch.
2. Build Track A as specified:
   - /services, including the animated duo hero and its stacked phone layout;
   - /services/[slug], including the 8 hero scenes, screen cards under 900px, Try it, BeforeAfter, What you get, FAQ and related;
   - /approach, /pricing, /privacy and the 404;
   - the components Track A owns.
   Port the mockup code in redesign-mockups/r3/ (service.html, services.html, approach.html, pricing.html, privacy.html, 404.html, site.js, sections.css). Keep its timings and sizes.
3. Render other tracks' components through their existing stubs (for example, the SystemPlayer in "How it runs"). Don't implement or change them.
4. Shared files are frozen. Write any needed change in docs/redesign/NOTES-A.md under "Shared changes needed", and work around it locally.
5. Check each page against the mockup at 1440, 1280, 900, 768 and 375, plus reduced motion. Run QA-CHECKLIST.md for your pages.
6. Commit often to redesign-2026-a (short messages, no co-author line). Never merge, rebase or push.

Finish with a report: pages done, QA results, differences from the mockup, and the notes for integration.
```

## Prompt: Track B, Systems (Sonnet, high)

```
You're Track B of the Red Elevators redesign: the Systems page and the shared player. Other sessions are building other tracks in parallel, so stay strictly inside your own files.

Setup: you're in your own worktree. Create branch redesign-2026-b from redesign-2026 and run `npm ci`. Use `redelevators-dev-b` (port 3002). The mockup preview is at http://localhost:4174/; don't start another.

1. Read docs/redesign/README.md and the docs it lists, especially IMPLEMENTATION-PLAN.md → "Stage 2", COMPONENTS.md (SystemPlayer, ControlRoom, Journey) and ROUTES-AND-CONTENT.md (/systems). Read AGENTS.md and the relevant Next 16 docs.
2. Build:
   - SystemPlayer, ported from redesign-mockups/r3/player.js:
     - tabs and the fixed-service mode, with hash deep links (including a hash change on the same page);
     - keyboard tabs and the legend highlight;
     - auto-scroll only as far as the newest item needs;
     - the mobile caption and sticky chips, and the fixed min-height.
   - ControlRoom, from systems.html.
   - Journey, both modes:
     - swipe, used on Systems;
     - pinned, from site.js mountJourney({pin}), used later by the homepage track.
   - The /systems page.
   Keep every timing and size from the mockup.
3. The SystemPlayer is also used on every service page (Track A renders it through the stub). Keep its props exactly as the stub defines them.
4. Shared files are frozen. Put needed changes in docs/redesign/NOTES-B.md.
5. Check all 8 runs at 1440, 1280, 900, 768 and 375, plus reduced motion and the keyboard. Run QA-CHECKLIST.md for your pages.
6. Commit often to redesign-2026-b (short messages, no co-author line). Never merge, rebase or push.

Finish with a report: what's done, QA results, differences from the mockup, and the notes for integration.
```

## Prompt: Track C, Booking (Sonnet, high)

```
You're Track C of the Red Elevators redesign: booking and contact. Other sessions are building other tracks in parallel, so stay strictly inside your own files.

Setup: you're in your own worktree. Create branch redesign-2026-c from redesign-2026 and run `npm ci`. Use `redelevators-dev-c` (port 3003). The mockup preview is at http://localhost:4174/.

1. Read docs/redesign/README.md and the docs it lists, especially IMPLEMENTATION-PLAN.md → "Stage 2", DECISIONS.md (booking, WhatsApp, email), COMPONENTS.md (CalBooker, BookingStage, AlivePhone) and ROUTES-AND-CONTENT.md (/contact, analytics). Read AGENTS.md and the Next 16 scripts doc.
2. Build:
   - CalBooker: the real Cal.com inline embed.
     - Check that @calcom/embed-react supports React 19. If it doesn't, use Cal's vanilla embed in a client component.
     - Theme: dark, brand #E51E2B.
     - The event link comes from src/lib/site.ts. If it's still a placeholder, keep the placeholder and say so in your report.
   - AlivePhone: ported from site.js mountCalmPhone, reacting to the Cal embed events.
   - BookingStage.
   - The /contact page:
     - WhatsApp as a wa.me link only; the number is never printed;
     - the email card, the summary doc and the FAQ.
   - Analytics: "Booking step", "Booking complete" and "WhatsApp click", using the existing track() helper.
3. You may add the Cal dependency; put the exact install command in docs/redesign/NOTES-C.md. Other shared changes also go in NOTES-C.md.
4. Check against the mockup at 1440, 1100, 900 and 375 (the phone hides under 1100). If a test event exists, run a test booking. Run QA-CHECKLIST.md for your pages.
5. Commit often to redesign-2026-c (short messages, no co-author line). Never merge, rebase or push.

Finish with a report: what's done, QA results, anything blocked on my Cal.com account, and the notes for integration.
```

## Prompt: Track D, Homepage (Opus, high)

```
You're Track D of the Red Elevators redesign: the homepage, including the scroll story. This is the most delicate part of the build. Other sessions are building other tracks in parallel, so stay strictly inside your own files.

Setup: you're in your own worktree. Create branch redesign-2026-d from redesign-2026 and run `npm ci`. Use `redelevators-dev-d` (port 3004). The mockup preview is at http://localhost:4174/.

1. Read docs/redesign/README.md and the docs it lists, especially IMPLEMENTATION-PLAN.md → "Stage 2" and "Homepage notes", COMPONENTS.md (Story section) and ROUTES-AND-CONTENT.md (/). Read AGENTS.md and the relevant Next 16 docs.
2. Read redesign-mockups/r3/home.html and home.js end to end before writing code. Then port the StoryStage structure-for-structure:
   - the phone, the laptop console, the lift card (FLIP, spotlight, beam, scan, highlight);
   - the return card with the staggered flips;
   - the rail, the time-of-day background, and the phone-version CSS.
   Keep every number. Add the off-screen pause, the static reduced-motion version, and server-rendered hero text.
3. Assemble chapters 04–09 on / using the other tracks' components through their stubs:
   - Journey pinned (B);
   - service cards, calculator and tiers, Calendar3Week (A);
   - BookingStage (C).
   You own ToolOrbit and the story components.
4. Shared files are frozen. Put needed changes in docs/redesign/NOTES-D.md.
5. Check, slowly scrolling the whole story:
   - at 1900, 1440, 1280 and 1100: no lift-card/text overlap, and everything inside the 1240 column;
   - at 375: the phone version and the "Skip the story" link;
   - reduced motion;
   - the loop stops when off-screen.
   Run QA-CHECKLIST.md for /.
6. Commit often to redesign-2026-d (short messages, no co-author line). Never merge, rebase or push.

Finish with a report: what's done, the overlap/QA results with widths, differences from the mockup, and the notes for integration.
```

## Prompt: Review a track before merging (Opus, high)

```
Review branch redesign-2026-<X> (Track <X> of the Red Elevators redesign) before it's merged. Don't change code; report only.

Read docs/redesign/README.md and the docs it lists, especially the Track <X> section of IMPLEMENTATION-PLAN.md and NOTES-<X>.md. Then:
1. Check file ownership: list every file this branch changed compared with redesign-2026 (`git diff --name-only redesign-2026...redesign-2026-<X>`). Flag any change outside Track <X>'s owned files.
2. Run lint and build on the branch.
3. Run its dev server and compare every page it owns against the mockup preview (http://localhost:4174/) at 1440, 1280, 900, 768 and 375, plus reduced motion. Go through QA-CHECKLIST.md.
4. Read the code for correctness:
   - server vs client components; hydration safety (no randomness or time before mount);
   - effects cleaned up, and loops paused off-screen;
   - accessibility;
   - copy matching the mockup.

Report findings ordered by severity, each with the file, what's wrong, and the fix. End with: ready to merge, or not yet.
```

## Prompt: Stage 3, Integration (Opus, high; run once per track, then a final time)

```
Integration for the Red Elevators redesign. Branch: redesign-2026 (the main checkout or its own worktree). Use `redelevators-dev-integration` (port 3005).

Read docs/redesign/README.md and IMPLEMENTATION-PLAN.md → "Stage 3".

Merge track branch redesign-2026-<X> into redesign-2026:
1. Merge it (no fast-forward), resolve any conflicts in favour of the owning track's version, then run lint and build.
2. Apply the "Shared changes needed" from docs/redesign/NOTES-<X>.md, as long as they don't break other tracks. Note anything you deferred.
3. Quick QA on the pages this track touched, plus the pages that use its components (stubs are now real).
4. Commit with a short message and no co-author line. Don't push. Don't touch main.

When all four tracks are merged (I'll say "final integration"), do the rest of Stage 3:
- confirm no stubs remain;
- the full QA checklist at every width;
- metadata, OG and JSON-LD; the full analytics event table; a Lighthouse pass on / and /services;
- list the open owner items from DECISIONS.md.
Report what's ready and what needs me. Don't merge to main.
```

## Prompt: Fix something you noticed (any model)

```
On branch <branch>, page <url> at <width>px: <what's wrong>. Compare with the mockup at http://localhost:4174/<same page>. Fix it inside this track's own files (see docs/redesign/IMPLEMENTATION-PLAN.md ownership), check it at that width and at 375, and commit with a short message and no co-author line.
```
