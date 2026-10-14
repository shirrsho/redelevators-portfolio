import type { IconName } from "./icons";

// The eight "Watch one run" scenes for the SystemPlayer (Systems page + every service page).
// Ported unchanged from redesign-mockups/r3/player.js (RUNS, PARTS). Index-aligned with SERVICES.
//
// `screen` is the device's inner markup exactly as the mockup builds it: each element that
// appears by step carries data-at="<step>" (shown from that step) and optionally
// data-to="<step>" (hidden again from that step). Elements without data-at are always shown.
// It is trusted static HTML: render it server-side with dangerouslySetInnerHTML and toggle the
// .on / .off classes from the player, as player.js → show() does. Tool logos inside it are
// pre-rendered SVG (src/lib/logos.ts → logoSvg). See docs/redesign/NOTES.md for why this one
// scene stays HTML rather than JSX.

export type Part = "trigger" | "tools" | "check" | "log";
export const PARTS: readonly (readonly [part: Part, label: string])[] = [
  ["trigger","Trigger"],
  ["tools","Your tools"],
  ["check","Your checkpoint"],
  ["log","Log"],
];

/** A step: [timecode, part, tool ("You" = your checkpoint), text]. */
export type RunStep = readonly [time: string, part: Part, tool: string, text: string];

export type Run = {
  /** Whose screen the device shows: the guest's or the owner's. */
  see: "guest" | "you";
  dev: "phone" | "web";
  /** Phone app header: [app/logo name, title, subtitle, avatar colour, optional icon instead of logo]. */
  app?: readonly [app: string, title: string, sub: string, color: string, icon?: IconName];
  /** Browser bar text for the web device. */
  url?: string;
  title: string;
  desc: string;
  steps: readonly RunStep[];
  screen: string;
  /** Result strip: by hand / with the system / you stay in control. */
  was: string;
  now: string;
  ctl: string;
};

export const RUNS: readonly Run[] = [
  {
    see: "guest",
    dev: "phone",
    app: ["Airbnb","Maria · Loft 2B","Arrives today","#FF5A5F"],
    title: "A guest question, answered in seconds",
    desc: "A message lands, the system reads it, checks the booking and replies in your tone.",
    steps: [
      ["0.0s","trigger","Airbnb","Maria asks: “Could we check in early, around 11?”"],
      ["0.4s","tools","Claude","Claude reads it: an early check-in request"],
      ["0.9s","tools","Guesty","Guesty: Loft 2B is cleaned by 11:30, free from 12:00"],
      ["2.1s","tools","Claude","Claude drafts the reply in your tone"],
      ["2.3s","check","You","Your rule: no money involved, so it can send. Anything else waits for you"],
      ["4.0s","log","Guesty","Sent, and saved to Maria’s guest profile"],
    ],
    screen: "<div data-at=\"0\" class=\"bub in\">Hi! Could we check in early, around 11? ✈️<small>2:14 pm</small></div><div data-at=\"1\" data-to=\"5\" class=\"clp\"><div class=\"typ\"><i></i><i></i><i></i></div></div><div data-at=\"5\" class=\"bub out\">Hi Maria! Your loft is ready from 12:00, so come at noon. Happy to hold your bags from 11 😊<small>Replied in 4 s</small></div>",
    was: "~12 min",
    now: "4 seconds",
    ctl: "You set the tone. Refunds, complaints and anything unusual come to you first.",
  },
  {
    see: "guest",
    dev: "phone",
    app: ["WhatsApp","Harbor Studio","Assistant · replies 24/7","#25D366"],
    title: "One assistant runs every conversation",
    desc: "A late-night question gets a real answer from your house guide, plus an offer you’d never have time to make.",
    steps: [
      ["23:40","trigger","WhatsApp","A guest asks about parking and a late checkout"],
      ["+0.5s","tools","Claude","Claude finds the parking details in your house guide"],
      ["+1.2s","tools","n8n","n8n checks tomorrow: no arrival until 4pm, so late checkout works"],
      ["+2.0s","tools","Claude","Claude answers both and offers late checkout for $25"],
      ["+2.1s","check","You","Payment only through your Stripe link. Refunds always come to you"],
      ["+40s","log","Notion","Guest says yes: +$25, logged"],
    ],
    screen: "<div data-at=\"0\" class=\"bub in\">Hi! Is parking free? And could we check out late tomorrow?<small>11:40 pm</small></div><div data-at=\"1\" data-to=\"3\" class=\"clp\"><div class=\"typ\"><i></i><i></i><i></i></div></div><div data-at=\"3\" class=\"bub out wa\">Parking is free in the courtyard, gate code 1942 🚗 Late checkout until 2pm is available for $25. Want it?<small>11:40 pm</small></div><div data-at=\"4\" class=\"bub in\">Yes please!<small>11:41 pm</small></div><div data-at=\"5\" class=\"bub out wa\">Done ✓ Pay here: harborstudio.com/late<small>11:41 pm</small></div><div data-at=\"5\" class=\"pill\">+$25 · late checkout</div>",
    was: "You, at 11:40pm",
    now: "Instant, any hour",
    ctl: "It answers only from your house guide. Money, damage and complaints go to you.",
  },
  {
    see: "guest",
    dev: "phone",
    app: ["Mail","Inbox","Sofia’s phone","#3a3a46","mail"],
    title: "Past guests, back on the calendar",
    desc: "Your guest list is sorted, each guest gets a personal note, and the offer sends itself.",
    steps: [
      ["Mon 8:00","trigger","Airtable","38 past guests in your list"],
      ["+2s","tools","n8n","Picks the 12 who stayed in spring and left 5 stars"],
      ["+30s","tools","Claude","Writes a personal note for each of them"],
      ["8:15","check","You","You approve the offer once: 10% off, direct only"],
      ["9:00","tools","MailChimp","Sent at 9am in each guest’s time zone"],
      ["Wed","log","Stripe","Sofia books 3 nights direct. $0 commission"],
    ],
    screen: "<div data-at=\"0\" class=\"scard muted\"><div class=\"row\"><b>Weekly digest</b><span class=\"muted\">7:02</span></div><div class=\"ln\" style=\"width:70%\"></div></div><div data-at=\"0\" class=\"scard muted\"><div class=\"row\"><b>Your receipt</b><span class=\"muted\">Yesterday</span></div><div class=\"ln\" style=\"width:55%\"></div></div><div data-at=\"4\" data-to=\"5\" class=\"clp\"><div class=\"scard\" style=\"border-color:rgba(139,147,255,.5)\"><div class=\"row\"><b>Harbor Studio</b><span class=\"okk\">New</span></div><div style=\"margin-top:4px\">Sofia, spring is back at the harbor 🌊</div><div class=\"muted\" style=\"margin-top:4px\">As a past guest, book direct and save 10%…</div></div></div><div data-at=\"5\" class=\"scard\"><b>Sofia, spring is back at the harbor 🌊</b><p class=\"muted\" style=\"margin-top:6px\">It’s been a year since your stay. The terrace is open again. As a past guest, book direct and save 10%.</p><div style=\"margin-top:10px;padding:9px;border-radius:9px;background:#d8203a;text-align:center;font-weight:600\">Book direct</div></div><div data-at=\"5\" class=\"pill\">Booked · May 3–6 · $612 · no fee</div>",
    was: "~3 hours a send",
    now: "2 min to approve",
    ctl: "Nothing goes out until you approve the offer. You choose who gets it.",
  },
  {
    see: "guest",
    dev: "web",
    url: "harborstudio.com/guides/spring",
    title: "Fresh listings and guides, on schedule",
    desc: "A topic comes due, gets researched and written in your voice, checked, and published.",
    steps: [
      ["Mon 7:00","trigger","n8n","The spring guide is due"],
      ["7:01","tools","Claude","Researches what’s new near Canal House"],
      ["7:04","tools","Claude","Writes it in your voice, with photos you’ve approved"],
      ["7:05","check","You","Facts and links checked. You can pull it before 9am"],
      ["9:00","tools","Webflow","Published on your site"],
      ["9:01","log","Airbnb","Listing description updated to match"],
    ],
    screen: "<div data-at=\"0\" class=\"mono\" style=\"font-size:11px\">GUIDE · SPRING 2026</div><div data-at=\"1\" data-to=\"2\" class=\"clp\"><div class=\"scard muted\">Research notes: 4 new cafés · market reopens Sat · ferry timetable changed</div></div><div data-at=\"2\"><div style=\"font-family:var(--display);font-size:22px;font-weight:600;letter-spacing:-.02em;line-height:1.15\">Spring near Canal House: six new spots</div><div class=\"ln\"></div><div class=\"ln\" style=\"width:92%\"></div><div class=\"ln\" style=\"width:80%\"></div></div><div data-at=\"2\" class=\"tiles\"><div class=\"tl\" style=\"height:84px\"></div><div class=\"tl\" style=\"height:84px;filter:hue-rotate(160deg)\"></div></div><div data-at=\"3\" class=\"row\" style=\"gap:6px\"><span class=\"okk\">✓ 6 links</span><span class=\"okk\">✓ facts</span><span class=\"okk\">✓ tone</span><span></span></div><div data-at=\"4\" class=\"pill\">Published · Mon 9:00</div><div data-at=\"5\" class=\"scard\"><div class=\"row\"><span style=\"width:18px\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" aria-label=\"Airbnb\" role=\"img\"><path fill=\"#FF5A5F\" d=\"M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z\"/></svg></span><b>Listing description</b><span class=\"okk\">Updated</span></div></div>",
    was: "~4 hours a month",
    now: "0 hours",
    ctl: "Every piece can be pulled before it publishes. Your voice, your photos.",
  },
  {
    see: "you",
    dev: "web",
    url: "Ads · Harbor Studio · today",
    title: "Budget follows the bookings, every day",
    desc: "Each morning the ads are compared, the weak one is flagged, and budget moves to what books.",
    steps: [
      ["7:00","trigger","Meta","Yesterday’s ad results come in"],
      ["7:01","tools","Make","Compares cost per booking across your 3 ads"],
      ["7:01","tools","Slack","“Weekend in the city” costs $58 a booking, 3× the others"],
      ["7:02","check","You","Inside your $40/day limit, so it can shift. Bigger moves wait for you"],
      ["7:02","tools","Meta","Moves $12/day to “Midweek escape”"],
      ["7:02","log","Notion","Change logged, with the reason"],
    ],
    screen: "<div data-at=\"0\" class=\"scard\"><div class=\"row\"><b>Midweek escape</b><span class=\"muted\">$19 / booking</span></div><div class=\"bar2\" style=\"--bc:#8fd4b0\"><i style=\"--w:45%\"></i></div></div><div data-at=\"0\" class=\"scard\"><div class=\"row\"><b>Weekend in the city</b><span class=\"muted\">$58 / booking</span></div><div class=\"bar2\" style=\"--bc:#ff8a80\"><i style=\"--w:40%\"></i></div></div><div data-at=\"0\" class=\"scard\"><div class=\"row\"><b>Long stay, pay for five</b><span class=\"muted\">$21 / booking</span></div><div class=\"bar2\"><i style=\"--w:15%\"></i></div></div><div data-at=\"2\" class=\"row\" style=\"gap:6px\"><span class=\"flag\">Weak: Weekend in the city</span><span></span></div><div data-at=\"4\" class=\"scard\" style=\"border-color:rgba(143,212,176,.4)\"><div class=\"row\"><b>Budget moved</b><span class=\"okk\">+$12/day</span></div><div class=\"muted\" style=\"margin-top:4px\">Weekend in the city paused → Midweek escape now $26/day</div></div><div data-at=\"5\" class=\"pill\">Logged · 7:02</div>",
    was: "~30 min every morning",
    now: "0 minutes",
    ctl: "You set the daily limit. Anything above it waits for your OK.",
  },
  {
    see: "you",
    dev: "web",
    url: "Creative set · Spring",
    title: "One property, every format, one approval",
    desc: "One shoot becomes every format you need, with captions, and you approve it once.",
    steps: [
      ["Tue","trigger","Canva","One shoot of Harbor Studio is approved"],
      ["+1 min","tools","Canva","Cut into every format: feed, story, banner, listing"],
      ["+2 min","tools","Claude","Writes a caption for each one"],
      ["+3 min","check","You","One approval for the whole set, in Slack"],
      ["+3 min","tools","Meta","Ready to run on Meta and Google"],
      ["+3 min","log","Notion","Set saved to your library"],
    ],
    screen: "<div data-at=\"0\" data-to=\"1\" class=\"clp\"><div class=\"tl\" style=\"height:130px\"><b>Original</b></div></div><div data-at=\"1\" class=\"tiles\"><div class=\"tl\" style=\"height:92px\"><b>1:1 feed</b></div><div class=\"tl\" style=\"height:92px;filter:hue-rotate(20deg)\"><b>9:16 story</b></div><div class=\"tl\" style=\"height:60px;filter:hue-rotate(-20deg)\"><b>16:9 banner</b></div><div class=\"tl\" style=\"height:60px;filter:saturate(.7)\"><b>Listing</b></div></div><div data-at=\"2\" class=\"scard muted\">“Midweek escape. Wake up on the water, book direct and save 10%.” <span class=\"muted\">+3 more</span></div><div data-at=\"3\" class=\"scard\" style=\"border-color:rgba(232,163,61,.5)\"><div class=\"row\"><b>Approve “Spring set”?</b><span class=\"okk\">Approved ✓</span></div><div class=\"muted\" style=\"margin-top:4px\">4 formats · 4 captions</div></div><div data-at=\"4\" class=\"pill\">Ready to run · Meta + Google</div>",
    was: "~1 day of resizing",
    now: "1 approval",
    ctl: "Nothing runs without your sign-off on the set.",
  },
  {
    see: "you",
    dev: "web",
    url: "harborstudio.com · Book",
    title: "The site and the calendar stay in sync",
    desc: "Every night your site is checked against every calendar and your price rules.",
    steps: [
      ["02:00","trigger","Guesty","Nightly check: your site against every calendar"],
      ["02:00","tools","Airbnb","Oct 18–20 was just booked on Airbnb"],
      ["02:00","tools","n8n","Your site still showed it open, so it’s blocked there too"],
      ["02:01","tools","PriceLabs","Sunday’s rate is $20 under your floor: flagged"],
      ["07:30","check","You","Rate changes need your OK: one tap"],
      ["07:30","log","Notion","Report saved. Zero double bookings"],
    ],
    screen: "<div class=\"row\"><b>October</b><span class=\"muted\" style=\"font-size:12px\">Loft 2B</span></div><div class=\"cal\"><span class=\"h\">M</span><span class=\"h\">T</span><span class=\"h\">W</span><span class=\"h\">T</span><span class=\"h\">F</span><span class=\"h\">S</span><span class=\"h\">S</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span class=\"b\" style=\"transition:background .5s,color .5s\">18</span><span class=\"b\" style=\"transition:background .5s,color .5s\">19</span><span class=\"b\" style=\"transition:background .5s,color .5s\">20</span><span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span><span>32</span><span>33</span></div><div data-at=\"1\" class=\"row\" style=\"gap:6px\"><span class=\"flag\" style=\"background:rgba(232,163,61,.15);color:#f3c27a\">Airbnb: Oct 18–20 booked</span><span></span></div><div data-at=\"2\" class=\"row\" style=\"gap:6px\"><span class=\"okk\">Blocked on your site</span><span></span></div><div data-at=\"3\" class=\"scard\"><div class=\"row\"><b>Sun, Oct 26</b><span class=\"flag\">$120 &lt; $140 floor</span></div></div><div data-at=\"4\" class=\"scard\" style=\"border-color:rgba(232,163,61,.5)\"><div class=\"row\"><b>Raise to $140?</b><span class=\"okk\">Approved ✓</span></div></div><div data-at=\"5\" class=\"pill\">All calendars in sync ✓</div>",
    was: "A double booking, eventually",
    now: "Caught overnight",
    ctl: "You own the site and the data. Price changes need your OK.",
  },
  {
    see: "you",
    dev: "web",
    url: "Bookings · this week",
    title: "One view, from first click to confirmed stay",
    desc: "Clicks from every channel become one funnel, and the leak gets flagged with a fix.",
    steps: [
      ["8:00","trigger","Google Ads","Clicks from Google, Meta and email come in"],
      ["8:00","tools","Make","Merged into one funnel"],
      ["8:01","tools","Claude","Finds the leak: 40% leave at the payment step"],
      ["8:01","tools","Slack","Suggests a fix: show the full price upfront"],
      ["8:05","check","You","You decide on the fix"],
      ["Fri","log","Notion","One-page report in your inbox"],
    ],
    screen: "<div data-at=\"0\" class=\"fun\"><div><div class=\"row\"><span class=\"muted\">Clicks</span><b>1,240</b></div><div class=\"bar2\" style=\"--bc:#8b93ff\"><i style=\"--w:100%\"></i></div></div><div><div class=\"row\"><span class=\"muted\">Site visits</span><b>860</b></div><div class=\"bar2\" style=\"--bc:#8b93ff\"><i style=\"--w:69%\"></i></div></div><div><div class=\"row\"><span class=\"muted\">Reached payment</span><b>210</b></div><div class=\"bar2\" style=\"--bc:#8b93ff\"><i style=\"--w:17%\"></i></div></div><div><div class=\"row\"><span class=\"muted\">Booked</span><b>126</b></div><div class=\"bar2\" style=\"--bc:#8fd4b0\"><i style=\"--w:10%\"></i></div></div></div><div data-at=\"1\" class=\"row\" style=\"gap:6px\"><span class=\"okk\">Google</span><span class=\"okk\">Meta</span><span class=\"okk\">Email</span><span></span></div><div data-at=\"2\" class=\"row\" style=\"gap:6px\"><span class=\"flag\">−40% at payment</span><span></span></div><div data-at=\"3\" class=\"scard\" style=\"border-color:rgba(232,163,61,.5)\"><b>Suggested fix</b><div class=\"muted\" style=\"margin-top:4px\">Show cleaning fee and taxes on the first screen.</div></div><div data-at=\"5\" class=\"pill\">Weekly report sent · Fri 8:00</div>",
    was: "~2 hours a week",
    now: "In your inbox",
    ctl: "You set the goals and the budget. Fixes are suggestions until you say yes.",
  },
];
