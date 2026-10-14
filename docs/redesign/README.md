# Red Elevators redesign: start here

This folder is the handoff for building the redesigned site in Next.js. The design is **finished and approved as HTML mockups**. Your job is to port it faithfully into the existing Next.js 16 app, not to redesign it.

## Read in this order

1. [DECISIONS.md](DECISIONS.md): what the owner decided, and what is still open. Don't re-litigate anything listed as decided.
2. [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md): tokens, type, colour, motion, logo, and the rules behind them.
3. [ROUTES-AND-CONTENT.md](ROUTES-AND-CONTENT.md): every route, its sections in order, redirects, SEO, and analytics events.
4. [COMPONENTS.md](COMPONENTS.md): every component, where its mockup code lives, and how it must behave.
5. [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md): the phased build order, with acceptance criteria per phase and Next 16 rules.
6. [QA-CHECKLIST.md](QA-CHECKLIST.md): run it at the end of every phase.
7. [PROMPTS.md](PROMPTS.md): the exact prompts for each session, plus how to run sessions in parallel.

## The source of truth

| What | Where |
|---|---|
| Mockup source (edit only if the owner asks) | `redesign-mockups/r3/` |
| Mockup built with real URLs | `redesign-mockups/site/`, built by `python3 redesign-mockups/build-site.py` |
| Live preview of the mockups | `.claude/launch.json` → `site-preview` (port 4174). Open `http://localhost:4174/`. If it's already running (another session started it), just open the URL; don't start a second one |
| Design review pages | `/_design/layouts/`, `/_design/nav-hero/`, `/_design/logo/`, `/_design/fonts/`, `/_design/components/` on the preview |

Everything else in `redesign-mockups/` (the `hero-*.html` files, `story/`, round index pages) is **old exploration. Ignore it.**

When the mockup and these docs disagree, **the mockup wins on look and behaviour**, and these docs win on architecture and rules. Note any disagreement you find in `docs/redesign/NOTES.md`.

## How to use the mockups while coding

- Run the preview (`site-preview`) next to the Next dev server (`redelevators-dev`, port 3000) and compare page by page, at 1440, 1280, 900, 768 and 375 widths.
- **Port, don't reinvent.** The mockup JS (`site.js`, `home.js`, `player.js`) already solves the timing, layout and edge cases (overlaps, mobile caption, staggered flips, measured card position). Translate it into React and keep the numbers.
- Mockup copy, numbers and data arrays are the content. Move them into typed data files (`src/lib/…`), unchanged.
- Every number shown is **illustrative**, and the UI labels it as such. Keep those labels.

## Project rules that still apply

- `AGENTS.md`: this is Next.js 16. Read the relevant guide in `node_modules/next/dist/docs/` before writing code (paths are in IMPLEMENTATION-PLAN.md).
- Git (owner's rules): work on a feature branch, short commit messages, **no co-author lines**, and **never merge or push to `main` unless the owner asks**. Before any push, check for TEMP or placeholder content.
- No real client names, metrics or screenshots on the public site until the owner clears them.
