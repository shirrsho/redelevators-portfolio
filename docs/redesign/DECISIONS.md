# Decisions (owner-approved, 13–14 Oct 2026)

These are settled. Build them as they are; don't re-open them.

## Positioning and audience
- Red Elevators builds and runs **automation and marketing systems for short-term rentals** (hosts and property managers).
- Markets: **USA and UAE**. Copy is in **US English**.
- Headline: **"Your rentals, running on autopilot."**

## Story and structure
- The homepage is a **scroll-driven story** told on the owner's phone at 2am:
  - **The night:** notifications pile up.
  - **Sound familiar?:** each problem is pulled out of the phone, under a spotlight, with a zoom beam.
  - **The turn:** a laptop shows the system working, and solved cards fly back into the phone.
  - **Morning:** "Nothing needs you."
- The homepage has **9 chapters**:
  1. Story: the night, sound familiar?, the turn, morning (chapters 01–03 plus the morning screen).
  2. 04 One booking: the **journey**, scroll-pinned.
  3. 05 What we build.
  4. 06 What you get back / what it costs: the calculator plus compact tiers.
  5. 07 How we work: the interactive 3-week calendar.
  6. 08 Your tools, our promises: the **tool orbit** plus 4 promises.
  7. 09 Your calm 2am: the **booking stage**, identical to Contact.
- **Systems page:**
  - The hero has a live **control room** on the right.
  - The **"Watch one run" player** has named tabs.
  - The **four parts** of a system are labelled on the player itself; there is no separate section for them.
  - The journey appears here too, as the swipe version.
- **Service pages:** "How it runs" uses the **same player**, fixed to that service.
- **Hero types:**
  - A, Story: home only.
  - B, Split (copy plus a live visual): Services, each service page, Approach.
  - C, Short: Systems uses a split hero with the control room, but this is listed as its own type; Pricing, Contact and Privacy are short.

## Look
- **Aurora** colour direction:
  - Dark base.
  - Indigo (automation) and coral (marketing) pillar colours.
  - Gradient card borders and soft colour fields.
- The **original logo is kept**. The nav and footer use the rebuilt **lockup without the tagline** (`logo-lockup-dark.svg`). Below 32px, use the bars-only mark.
- Brand red `#FF2D3B` is kept. Red means **brand or "book"**. Amber means a problem. Green means handled.
- **Font: Schibsted Grotesk (headings) + Hanken Grotesk (body) + JetBrains Mono (labels)**, confirmed 14 Oct.
- **Nav:** a floating, rounded glass bar, 14px from the top and as wide as the content column. The logo is on the left, the links are centred, and the red "Book a call" is on the right.
  - The current page gets a soft pill and a red dot.
  - Under 900px it shows the logo, Book and a menu button, which opens a full-screen sheet.
- All page content sits inside the **1240px column**; only backgrounds bleed to the edges. This includes the homepage story.

## Booking, contact, money
- **Booking:** the free **Cal.com** plan, embedded. It replaces the Google appointment link. Dark theme with the brand colour; the "Cal.com" mark stays.
- **WhatsApp:** only on the Contact page, as a button. **Never print the number.** Use a `wa.me` link with a prefilled message.
- **Email:** `contact@redelevators.com`.
- **Currency toggle:** **USD is the default**, plus AED and EUR. Each currency has its own prices (no live conversion). The choice is remembered per visitor.
- **Prices are placeholders** (the owner sets real ones later). The UI flags them as placeholders.
- **AI vendor:** name **Claude** in diagrams. The FAQ wording is "mostly Claude, OpenAI where it fits".

## URLs
New service slugs, with 301 redirects from the old ones:

| Old | New |
|---|---|
| `workflow-crm-automation` | `guest-messaging` |
| `ai-assistants-chatbots` | `ai-guest-assistant` |
| `sales-outreach-systems` | `direct-booking-engine` |
| `content-engines` | `listing-content-engine` |
| `paid-social-advertising` | `paid-social` |
| `creative-ad-design` | `photo-ad-creative` |
| `ecommerce-growth` | `direct-booking-website` |
| `full-funnel-campaigns` | `booking-campaigns` |

New pages: `/pricing` and `/privacy`.

## Content rules
- All scene numbers are **illustrative** and are labelled so.
- **No real client names, metrics or screenshots** until the owner clears them.
- The **people/trust section is deferred** by the owner. Leave room for it, but don't build it.

## Still open (needs the owner, not code)
1. **Real prices** in USD, AED and EUR.
2. **Privacy policy legal details:**
   - Registered company name and address.
   - Email provider.
   - Retention period.
   - A legal review before launch.
3. **Tracking vs the privacy page (decide before launch).** The live site loads the **Meta Pixel** and **Umami session recordings (`recorder.js`)**. The drafted privacy page currently says "no ad trackers, cookie-free analytics, anonymous page views". Either:
   - (a) drop the Pixel and the recorder; or
   - (b) keep them, rewrite the privacy page, add a consent banner for EU/UK visitors, and add a "Do Not Sell or Share" notice for California.
4. **Cal.com account:** the owner creates it (free plan) and gives the event link.
5. **WhatsApp number:** a +880 number is set in the mockup. Confirm whether to use a US or UAE WhatsApp Business number instead, since it becomes visible once someone taps the button.
6. **Whether to keep or archive the old mockup rounds** in `redesign-mockups/`.
