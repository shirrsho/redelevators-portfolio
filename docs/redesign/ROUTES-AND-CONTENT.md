# Routes, page structure, SEO and analytics

**Mockup files:** `redesign-mockups/r3/<file>.html`. The page sections below are listed top to bottom.

**Content to port:** copy and data live in the mockup JS:
- `site.js`: `SERVICES`, `CHAINS`, `JOURNEY`, `PRICE`, `FX`, FAQ.
- `home.js`: `PAINS`, `TURNS`, `N` (notifications), `LIFT`, `CR`.
- `player.js`: `RUNS`.
- The `systems.html` script: `CR` (the control room).

Move these into typed modules under `src/lib/` **unchanged**.

## Routes

| Route | Mockup | Hero type | Notes |
|---|---|---|---|
| `/` | `home.html` + `home.js` | A · Story | 9 chapters (see below). `--bg` animates with scroll |
| `/services` | `services.html` | B · Split | Animated two-device hero (ad → booking → system rows) |
| `/services/[slug]` ×8 | `service.html` | B · Split | One hero scene per service (`HERO` map); `generateStaticParams` over the 8 slugs |
| `/systems` | `systems.html` | Split with control room | The shared player with tabs; `#<slug>` deep links |
| `/approach` | `approach.html` | B · Split | 3-week calendar linked to the phases |
| `/pricing` | `pricing.html` | C · Short | **New route** |
| `/contact` | `contact.html` | C · Short | Booking stage, WhatsApp, email, summary doc, FAQ |
| `/privacy` | `privacy.html` | C · Short | **New route**; light "paper" reading section |
| not-found | `404.html` | — | Phone lock screen: "This page checked out." |

**Service slugs:** `guest-messaging`, `ai-guest-assistant`, `direct-booking-engine`, `listing-content-engine` (AI Automation); `paid-social`, `photo-ad-creative`, `direct-booking-website`, `booking-campaigns` (Marketing).

## Redirects (`next.config.ts` → `redirects()`, `permanent: true`)
Next 16 sends **308** for `permanent: true`. Search engines treat 308 like 301, so that's fine. Docs: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md`.

`/services/workflow-crm-automation` → `/services/guest-messaging` · `ai-assistants-chatbots` → `ai-guest-assistant` · `sales-outreach-systems` → `direct-booking-engine` · `content-engines` → `listing-content-engine` · `paid-social-advertising` → `paid-social` · `creative-ad-design` → `photo-ad-creative` · `ecommerce-growth` → `direct-booking-website` · `full-funnel-campaigns` → `booking-campaigns`.

Update `src/app/sitemap.ts` to the new slugs, and add `/pricing` and `/privacy` to it.

## Page sections

### `/`: Home
1. **Story stage** (`#story`, 820vh desktop / 880vh mobile, sticky 100vh stage). Chapters run by scroll segments `[0,.12] [.12,.44] [.44,.88] [.88,1]`:
   - **The night (hero, H1):**
     - Eyebrow "For short-term rental hosts & property managers" and the H1.
     - Lead, primary CTA "Book a free 30-min call" (→ `#calm`), quiet "See how it works", three reassurances and "Skip the story →".
     - Notifications arrive on the phone over time; the phone tilts slightly with the cursor.
   - **Sound familiar? (4 steps):** for each pain,
     - The matching notification is **pulled out of the phone** (FLIP).
     - A **spotlight** dims and blurs everything except the empty slot.
     - A **zoom beam** links the slot to the card, labelled "FROM YOUR LOCK SCREEN".
     - A light sweeps the card, the key phrase gets an amber highlight, then the big metric appears.
     - The card is placed from the measured right edge of the chapter text, so it never overlaps it.
     - **On phones:** the card zooms inside the phone instead.
   - **The turn (4 steps):**
     - A laptop console shows each fix.
     - A green "Handled for you" card **flies from the laptop into its slot** on the phone.
     - Cards in the same group flip one after another, the target first.
     - The background goes from night to dawn.
   - **Morning:** 7:30am, "Good morning. Nothing needs you." with CTA "Follow a booking ↓".
   - **Chapter rail** (bottom-left), plus the jump buttons.
2. **04 One booking:** the journey, **scroll-pinned** (the section holds while vertical scroll moves the 7 cards sideways; the current card is highlighted; 80vw cards on phones).
3. **05 What we build:** 8 service cards with looping mini demos, filtered by pillar.
4. **06 What you get back. What it costs.:** the savings calculator, the currency toggle and the compact pricing tiers.
5. **07 How we work:** the 3-week calendar (hover or tap a day; the linked steps light up).
6. **08 Your tools, our promises:** the tool orbit (2 rings of official tool marks around the full Red Elevators mark), 4 promises and "also works with" pills.
7. **09 Your calm 2am:** the **BookingStage** (Cal.com booker plus the alive phone). It is identical to Contact.

### `/services`
1. **Hero:**
   - The headline "Eight systems. Two pillars."
   - **The animated duo**, a 12.6s loop:
     - The phone ad cycles 3 creatives, story-style.
     - A tap on "Book now" turns the screen into "You're booked, Sofia."
     - A pulse travels to the laptop, and the rows work in turn (booking → welcome → answer → calendars), with the counters ticking.
   - The laptop scales to the column and the row text stays clear of the phone.
   - Under 900px it stacks: the phone, then the screen card.
2. **Pillar 01:** 4 service rows. **Pillar 02:** 4 rows.
3. **Better together:** a loop diagram.
4. **CTA band.**

### `/services/[slug]`
1. **Breadcrumb and service picker.**
2. **Hero (split)**, one scene per service:
   - `guest-messaging`: the one-inbox laptop (4 channels, then answered, a thread, the guest profile filling in).
   - `ai-guest-assistant`: the "last night's shift" panel (timeline 22:00–07:00, sources lighting up, a handover in amber, totals).
   - `direct-booking-engine`: the email-to-booking laptop.
   - `listing-content-engine`: the editor plus checks.
   - `paid-social`: the phone ad plus a booking drop.
   - `photo-ad-creative`: three frames.
   - `direct-booking-website`: the site plus the booking bar.
   - `booking-campaigns`: the funnel.
3. **Try it** (the two messaging services only): the assistant demo, where you type or tap chips.
4. **What changes:** before/after (it auto-flips once, then the visitor toggles).
5. **How it runs:** the **shared SystemPlayer fixed to this service** (no tabs, link "See all eight systems →").
6. **What you get** (4 cards), then the FAQ.
7. **Related services, previous/next, and the CTA.**

### `/systems`
1. **Hero:**
   - The headline "Every system, end to end." with a Book CTA and "Watch one run ↓".
   - The **control room**: 8 rows grouped by pillar, live counters ticking every 2.6s, and a feed line. Clicking a row selects that system in the player and scrolls to it.
2. **Watch one run:**
   - Tabs, which become sticky scrollable chips under 860px.
   - The **SystemPlayer**: the device scene on the left; the steps on the right with timecodes, tool logos and part labels; a legend; the result strip.
   - It plays in view, Replay runs it again, and the URL hash is kept in sync.
3. **One booking:** the journey, swipe version.
4. **CTA band.**

### `/approach`
1. **Hero:** the 3-week calendar (clicking a day scrolls to its phase).
2. **4 phase rows:** you vs us, what you get, and an animated visual each.
3. **After launch, the FAQ, and the CTA.**

### `/pricing`
1. **Hero:** with the currency toggle.
2. **Tiers:** Starter, Growth (marked Recommended) and Portfolio. The placeholder flag stays visible.
3. **Plan builder.**
4. **Savings calculator.**
5. **Included, the FAQ (includes AED billing), and the CTA.**

### `/contact`
1. **Centred intro and 3 step cards.**
2. **BookingStage.**
3. **Ask first:** the WhatsApp card (a button only, no number) and the email card.
4. **What you take away:** the summary document.
5. **FAQ.**

### `/privacy`
1. **Hero and 4 summary cards.**
2. **Light reading section** with a sticky table of contents that tracks the scroll.
3. The `.todo` highlights mark items the owner must fill in. **The copy must match the real tracking setup; see DECISIONS → open item 3.**

### 404
A phone lock screen where a notification arrives: "This page checked out." There are three ways back. Keep the Umami "404" event.

## SEO and metadata
- Keep `src/lib/seo.ts` (`pageMetadata()`, JSON-LD helpers). Give every route a title and description. The titles are in `redesign-mockups/build-site.py` → `TITLES`.
- **All copy must be server-rendered HTML.** The mockups build some content with JS for convenience; in Next the text must be in the HTML for SEO. Animations only enhance it.
- **Headings:** exactly one H1 per page. Section titles are H2. The story's chapter lines are H2s inside the story.
- **OG and Twitter images:** keep the existing `opengraph-image.tsx`, restyled to Aurora plus the new font.
- **Icons:** generate them from `logo-mark-solid.svg`.

## Analytics (Umami: keep existing events, add new ones)
- **Keep:** the existing setup in `layout.tsx` (`stats.js` with `data-performance`, `src/lib/analytics.ts` → `track()`, `components/Analytics.tsx` scroll depth plus outbound).
- **Keep these event names** (dashboards depend on them):
  - "Book a call", "Email click", "Email copied", "Jump to booking", "Nav click", "See how it works", "Service click", "View all services", "View all systems", "404".
- **Keep the `data-umami-event-location` attributes:**
  - hero, cta, footer, contact, header, mobile, nav-desktop, nav-mobile, plus the page-specific values.
- **Add these events:**

| Event | When |
|---|---|
| `Booking step` | Cal.com: date chosen / time chosen. Use Cal's embed events |
| `Booking complete` | Cal.com booking confirmed. This is the main conversion |
| `WhatsApp click` | Contact page button |
| `Currency change` | Data: `{ currency }` |
| `System play` | Player selection. Data: `{ system, source: tabs \| control-room \| service-page }` |
| `Story skip` | "Skip the story" |
| `Calculator used` | First slider interaction |
| `Plan builder used` | First tick |

- The **Meta Pixel** and Umami `recorder.js` depend on DECISIONS → open item 3. Don't remove them silently, and don't keep them without matching the privacy copy.
