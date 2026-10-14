# QA checklist (run at the end of every phase)

## Build
- [ ] `npm run lint` passes. `npm run build` passes (Turbopack).
- [ ] No hydration warnings in the browser console. No console errors on any page.

## Visual fidelity (against the mockup preview, `site-preview` port 4174)
- [ ] Widths: 1900, 1440, 1280, 1100, 900, 768, 375. Compare side by side.
- [ ] Content stays inside the 1240px column; the nav's logo left edge lines up with the page content.
- [ ] No horizontal scroll at any width (`document.documentElement.scrollWidth === clientWidth`).
- [ ] Fonts are Schibsted Grotesk, Hanken Grotesk and JetBrains Mono. Check computed `font-family`; there is no fallback flash beyond `next/font`'s swap.
- [ ] No functional text below 11px.

## Behaviour
- [ ] Nav: top / scrolled / current page / hover. Mobile sheet opens, closes on link click and Escape, and locks scroll.
- [ ] Every looping demo starts in view and pauses out of view.
- [ ] `prefers-reduced-motion: reduce` (DevTools → Rendering): every component shows its final state, and the homepage story becomes static sections.
- [ ] Homepage story:
  - [ ] The lift card never overlaps the chapter text (scroll slowly through "Sound familiar?" at 1100 / 1280 / 1440 / 1900).
  - [ ] The beam and spotlight follow the slot.
  - [ ] Handled cards flip one after another, the target first.
- [ ] Journey (home): pinned, moves sideways with scroll, arrows jump a step, the current card is highlighted.
- [ ] SystemPlayer:
  - [ ] All 8 runs complete.
  - [ ] No device overflow; the newest item is visible and earlier context kept.
  - [ ] At 375×812 the chips, title, device and caption fit on one screen.
  - [ ] Tabs work with arrow keys.
  - [ ] `#slug` deep links work, including a hash change on the same page.
- [ ] Booking: a test booking via Cal.com completes; AlivePhone reacts; analytics fire.
- [ ] Currency: USD by default; AED and EUR switch every price on the page; the choice persists after reload.
- [ ] WhatsApp appears only on `/contact`, as a link; the number is never printed.
- [ ] Old service slugs redirect to the new ones (permanent).

## Accessibility
- [ ] One H1 per page; headings in order.
- [ ] Keyboard: every control is reachable, focus is visible, and there are no traps (sheet, tabs, booker).
- [ ] `aria-current` on the current nav item; `aria-expanded` on the burger; `role=tablist`/`tab`/`tabpanel` on the player.
- [ ] Contrast: white on the red buttons; amber and green labels on dark.
- [ ] Every decorative SVG is `aria-hidden`; logos have alt text.

## Content and SEO
- [ ] Every page has a title and description (titles from `build-site.py` → `TITLES`).
- [ ] All copy is in the server HTML (view source), not injected by JS.
- [ ] The sitemap lists the new slugs, `/pricing` and `/privacy`.
- [ ] Illustrative labels are present on demos and numbers. There are no real client names or metrics.
- [ ] Before any push: search for TEMP, TODO, placeholder and `.todo`, and confirm the price placeholder flags are intentional.
