/* ==========================================================================
   Red Elevators — shared site layer for the inner-page mockups:
   nav, footer, service data, pipeline player, scheduler, reveal.
   Needs logos.js + icons.js first.
   ========================================================================== */
(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ARROW = '<svg viewBox="0 0 16 11" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M0 5.5H14.6M10.3 1.2L14.9 5.5L10.3 9.8"/></svg>';

// ---- Services (titles + descriptions are the company's own copy; before/after,
// deliverables and FAQ are draft copy for the owner to confirm) ----------------
const SERVICES = [
  { slug: 'guest-messaging', p: 'auto', icon: 'message', viz: 'chat', hero: 'chat', title: 'Guest Messaging & CRM',
    outcome: 'Every guest message answered, from one inbox.',
    desc: 'Inquiries, booking questions and check-in details answered instantly across Airbnb, Vrbo and direct, every guest message handled from one place.',
    short: 'Every message answered, every guest remembered.',
    before: ['Airbnb, Booking.com and WhatsApp each get checked separately, all day', 'The same check-in answer gets typed out for the tenth time this week', 'Booking details get looked up in another tab before every reply', 'Guest notes live in someone’s head, not in a CRM'],
    control: ['The system reads, looks up and drafts.', 'You set the tone and the rules. Anything unusual, like refunds or complaints, comes to you before it’s sent.'],
    gets: [['mail', 'One inbox', 'Airbnb, Booking.com, Vrbo and direct, in one place.'], ['message', 'Replies in your voice', 'Written with you once, used automatically.'], ['guest', 'A guest CRM', 'Every stay, preference and review remembered.'], ['run', 'Monthly tuning', 'We review conversations and sharpen replies.']],
    faq: [['Will guests know it’s automated?', 'Replies are written in your voice from your own answers. Anything the system isn’t sure about comes to you first.'], ['Does it work with my PMS?', 'We build on what you already use, such as Guesty or Hostaway. No PMS yet? We’ll recommend one in the audit.'], ['What about my response rate?', 'Replies go out in minutes at any hour, which is exactly what the platforms look for.']] },
  { slug: 'ai-guest-assistant', p: 'auto', icon: 'assistant', viz: 'spark', hero: 'chat2', title: 'AI Guest Assistant',
    outcome: 'A 24/7 assistant that knows your property.',
    desc: 'An assistant that answers guests in natural language, day and night; house rules, local tips, upsells and FAQs; so you’re not on your phone at 2am.',
    short: 'Trained on your house rules. Replies around the clock.',
    before: ['Guests message at midnight about wifi, parking and checkout', 'Local tips get typed out again for every new guest', 'Upsells like late checkout are never offered', 'Every question waits until you’re awake'],
    control: ['The assistant answers only from your house guide and rules.', 'Anything about money, damage or a complaint is handed to you with the conversation attached.'],
    gets: [['assistant', 'Trained on your property', 'House rules, guides and local tips.'], ['message', 'Where guests already are', 'WhatsApp and platform messages.'], ['payment', 'Built-in upsells', 'Late checkout, early check-in, extras.'], ['guest', 'Clean handoffs', 'Hard questions come to you with context.']],
    faq: [['Can it reply in other languages?', 'Yes. It answers in the language the guest writes in.'], ['What if it doesn’t know the answer?', 'It says so politely and hands the conversation to you, instead of guessing.'], ['Can I read the conversations?', 'Every conversation is logged in your own workspace, and you can step in at any time.'], ['Which AI do you use?', 'Mostly Anthropic’s Claude for guest-facing writing, and OpenAI where it fits a task better. You’re never locked to one.']] },
  { slug: 'direct-booking-engine', p: 'auto', icon: 'direct', viz: 'cal', hero: 'email', title: 'Direct Booking Engine',
    outcome: 'Past guests come back. Directly.',
    desc: 'Past guests and leads re-engaged automatically to drive repeat, direct bookings; fewer OTA commissions, more margin on every stay.',
    short: 'Brings past guests back to book direct.',
    before: ['Past guests sit in a spreadsheet nobody opens', 'Repeat guests rebook on the platform, and the commission is paid again', 'Offers go out once a year, if at all, as one generic blast', 'Nobody knows which past guests actually came back'],
    control: ['You approve every offer and the discount behind it.', 'The system segments, personalizes and sends. Replies come straight to you.'],
    gets: [['guest', 'A clean guest list', 'Every past stay, segmented.'], ['mail', 'Personal offers', 'Written per guest, sent at the right moment.'], ['direct', 'Direct checkout', 'Bookings land in your calendar, not the OTA’s.'], ['price', 'Repeat tracking', 'See who came back and what it was worth.']],
    faq: [['Can I contact guests who booked on Airbnb?', 'Only where you’re allowed to, such as direct guests and those who opted in. We check this together in the audit.'], ['Do I need a booking website?', 'It helps. We can build one, or connect to your PMS booking page.'], ['How often do guests hear from me?', 'A few well-timed messages a year. Never spam.']] },
  { slug: 'listing-content-engine', p: 'auto', icon: 'content', viz: 'doc', hero: 'editor', title: 'Listing & Content Engine',
    outcome: 'Listings and guides that stay fresh on their own.',
    desc: 'Optimized listing copy, neighborhood guides and social posts researched and published on schedule; every property kept fresh with no writer on payroll.',
    short: 'Fresh listings and guides, published on schedule.',
    before: ['Listing descriptions were written once and never touched again', 'The area guide is a PDF from three years ago', 'Social posts happen when someone has a spare evening', 'Every new property starts from a blank page'],
    control: ['You set the topics and the voice, and can pull anything before it goes out.', 'The system researches, writes, checks and schedules.'],
    gets: [['content', 'Listing copy', 'Tuned per platform and per property.'], ['direct', 'Neighborhood guides', 'Kept current for guests and for search.'], ['social', 'Social posts', 'Scheduled from the same source.'], ['check', 'A quality check', 'Every piece reviewed before it publishes.']],
    faq: [['Will it sound like AI?', 'It writes to a voice guide we build with you, and nothing publishes without passing a check.'], ['Which platforms does it update?', 'Your website and social channels directly. Platform listings are prepared for you to paste or sync.'], ['Can I edit before it goes live?', 'Always. You can approve, edit or pull anything.']] },
  { slug: 'paid-social', p: 'mkt', icon: 'social', viz: 'ad', hero: 'ad', title: 'Paid Social for Bookings',
    outcome: 'Ads that fill your empty nights.',
    desc: 'Meta and Instagram ads that fill the calendar with direct bookings, not just likes.',
    short: 'Ads that follow your empty nights.',
    before: ['Ads get checked in Ads Manager whenever someone remembers', 'A tired ad keeps spending for days before anyone notices', 'Budget is the same on a quiet Tuesday as on a sold-out Saturday', 'Results are a weekly report pulled together by hand'],
    control: ['The system checks performance daily and recommends.', 'You approve every budget shift and every new creative before it runs.'],
    gets: [['social', 'Campaigns built for bookings', 'Clicks to your booking page, not likes.'], ['calendar', 'Gap-night targeting', 'Budget follows the empty dates.'], ['price', 'Daily budget checks', 'Weak ads flagged, winners funded.'], ['run', 'One simple report', 'What you spent and what it booked.']],
    faq: [['What budget do I need?', 'It depends on your market and gaps. You’ll get a recommended range after the audit, and you stay in control of every change.'], ['Do you make the ads?', 'Yes, together with our creative service, or from your existing photos.'], ['Instagram only?', 'Meta (Instagram and Facebook) first, plus Google where it makes sense.']] },
  { slug: 'photo-ad-creative', p: 'mkt', icon: 'camera', viz: 'frames', hero: 'frames', title: 'Listing Photo & Ad Creative',
    outcome: 'One shoot. Every format. One approval.',
    desc: 'Scroll-stopping property photos, reels and ad creative built to earn the click and the booking.',
    short: 'One shoot, every format, one approval.',
    before: ['Every new ad starts from a blank canvas', 'Each platform’s size gets resized by hand', 'Approval happens across scattered messages', 'Final files get uploaded to each account one by one'],
    control: ['You approve the concept and the final set.', 'The system resizes, formats and routes it, so nothing goes live without your sign-off.'],
    gets: [['camera', 'Photo direction', 'Shot lists that sell the stay.'], ['build', 'Every format', 'Feed, story, reel and listing sizes.'], ['check', 'One approval', 'A single review before anything runs.'], ['social', 'Ready to run', 'Delivered straight into your ad accounts.']],
    faq: [['Do you do the photo shoot?', 'We direct it and can arrange a photographer, or work from your best existing photos.'], ['Video too?', 'Yes, short reels cut from the same shoot.'], ['Who owns the files?', 'You do, in your own drive.']] },
  { slug: 'direct-booking-website', p: 'mkt', icon: 'website', viz: 'web', hero: 'site', title: 'Direct Booking Website',
    outcome: 'Your own booking site. No commission.',
    desc: 'A fast, commission-free booking site tuned to turn lookers into confirmed reservations.',
    short: 'Your own site, synced with your calendar.',
    before: ['Every booking goes through a platform that takes a cut', 'Your website is a brochure with an email address', 'Rates on the site don’t match the platforms', 'Double bookings get caught by luck'],
    control: ['You own the site, the domain and the guest data.', 'The system checks rates and availability daily and flags anything that doesn’t match.'],
    gets: [['website', 'A fast booking site', 'Built to turn visits into stays.'], ['payment', 'Secure payments', 'Stripe checkout, money straight to you.'], ['calendar', 'Synced calendars', 'With your PMS and every platform.'], ['alert', 'Daily checks', 'Stale rates and clashes flagged early.']],
    faq: [['Will it connect to my PMS?', 'Yes. We sync availability and rates with what you already use.'], ['Who owns it?', 'You do: the domain, the site and every guest record.'], ['How do guests find it?', 'Through returning guests, search, and our ads and campaigns.']] },
  { slug: 'booking-campaigns', p: 'mkt', icon: 'funnel', viz: 'fun', hero: 'funnel', title: 'Full-Funnel Booking Campaigns',
    outcome: 'From first look to confirmed stay.',
    desc: 'From first impression to confirmed stay, across search, social and email.',
    short: 'From first look to confirmed stay.',
    before: ['Search, social and email run as separate efforts', 'Nobody can say which channel actually brings bookings', 'People who looked but didn’t book never hear from you', 'Reports count clicks, not stays'],
    control: ['You set the goals and the budget.', 'The system pulls every channel into one view daily and flags where guests drop off.'],
    gets: [['funnel', 'One full funnel', 'Awareness, retargeting and email in one plan.'], ['guest', 'Follow-up for lookers', 'Reminders for people who almost booked.'], ['price', 'One dashboard', 'Every channel, measured in bookings.'], ['run', 'Monthly tuning', 'Effort moves to what works.']],
    faq: [['Is this just ads?', 'No. It joins ads, search, email and your website into one path to booking.'], ['How do you measure it?', 'In bookings and revenue, tracked through to your calendar.'], ['Do I need the other services?', 'It works best with a direct booking website, but we start from what you have.']] },
];
// The automated chains, from the live site's systems data
const CHAINS = [
  ['A guest question, answered in seconds', 'A message lands from any channel, the system reads it, pulls the booking details and drafts the right reply.', [['Trigger', 'Message in', 'Airbnb'], ['Step 01', 'Read intent', 'Claude'], ['Step 02', 'Pull booking', 'Guesty'], ['Step 03', 'Draft reply', 'Claude'], ['Result', 'Sent & logged', 'Guesty']]],
  ['One assistant runs every conversation', 'A guest messages on WhatsApp; the assistant works out what they need, takes the action and replies in natural language.', [['Trigger', 'Message in', 'WhatsApp'], ['Step 01', 'Understand', 'Claude'], ['Step 02', 'Take action', 'n8n'], ['Step 03', 'Draft reply', 'Claude'], ['Result', 'Logged', 'Notion']]],
  ['Past guests, back on the calendar', 'Your guest list is segmented, each contact gets a personal offer to book direct, and it sends itself.', [['Trigger', 'Guest list', 'Airtable'], ['Step 01', 'Segment', 'n8n'], ['Step 02', 'Personalize', 'Claude'], ['Step 03', 'Send', 'n8n'], ['Result', 'Logged', 'Guesty']]],
  ['Fresh listings and guides, on schedule', 'A topic is picked, researched and written, checked, and published, keeping every listing and guide current.', [['Trigger', 'Topic due', 'n8n'], ['Step 01', 'Research', 'Claude'], ['Step 02', 'Write', 'Claude'], ['Step 03', 'Quality check', 'n8n'], ['Result', 'Published', 'Webflow']]],
  ['Budget follows the bookings, every day', 'Ad performance is checked daily, weak ads are flagged, and budget shifts toward what’s driving bookings.', [['Trigger', 'Daily check', 'Meta Ads'], ['Step 01', 'Compare', 'Make'], ['Step 02', 'Flag changes', 'Slack'], ['Result', 'Budget shifted', 'Meta Ads']]],
  ['One property, every format, one approval', 'A creative set is built once, resized for each platform automatically, and routed for a single approval.', [['Trigger', 'Set approved', 'Canva'], ['Step 01', 'Resize', 'Canva'], ['Step 02', 'Route approval', 'Slack'], ['Result', 'Ready to run', 'Meta Ads']]],
  ['The site and the calendar stay in sync', 'Availability, pricing and content are checked daily, so a double booking or stale rate is flagged before it costs you.', [['Trigger', 'Daily sync', 'Guesty'], ['Step 01', 'Compare rates', 'PriceLabs'], ['Step 02', 'Flag issues', 'Slack'], ['Result', 'Reported', 'Notion']]],
  ['One view, from first click to confirmed stay', 'Every channel’s performance is pulled into one place daily, so the whole funnel is visible.', [['Trigger', 'Daily pull', 'Google Ads'], ['Step 01', 'Merge channels', 'Make'], ['Step 02', 'Flag drop-off', 'Slack'], ['Result', 'Reported', 'Notion']]],
];
SERVICES.forEach((s, i) => { s.chain = CHAINS[i]; s.idx = i; });
const LOGO_ALIAS = { 'Meta Ads': 'Meta' };
const toolMark = (t, size = 26) => {
  const key = LOGO_ALIAS[t] || t;
  return (window.LOGOS || {})[key] ? logo(key, size) : `<span class="lp-txt" style="font-size:${Math.max(11, Math.round(size * .42))}px">${t}</span>`;
};

const toolPill = (t, size = 16) => {
  const key = LOGO_ALIAS[t] || t;
  return `<span class="logo-pill">${(window.LOGOS || {})[key] ? logo(key, size) : ''}<span>${t}</span></span>`;
};

const VIZ = {
  chat: `<div class="m-chat"><div class="bub in">Late check-in ok?</div><div class="bub out">Of course! Code is 4821.</div><div class="bub in">Perfect, thank you 🙏</div></div>`,
  spark: `<div class="m-chat" style="width:76%"><div class="bub in">Can I bring my dog? 🐶</div><div style="display:flex;align-items:center;gap:8px;justify-content:flex-end"><span class="m-spark" style="width:18px;height:18px">${ico('assistant')}</span><div class="bub out" style="animation-delay:1.4s">Yes! Small dogs are welcome.</div></div></div>`,
  cal: `<div class="m-cal">${Array.from({ length: 21 }, (_, i) => `<i style="animation-delay:${(i * 137 % 21) * .12}s"></i>`).join('')}</div>`,
  doc: `<div class="m-doc"><i></i><i></i><i></i><i></i><span class="chip handled"><i></i>Published</span></div>`,
  ad: `<div class="m-ad"><div class="img"></div><div class="cta">Book now</div></div>`,
  frames: `<div class="m-frames"><i></i><i></i><i></i></div>`,
  web: `<div class="m-web"><span class="h"></span><span class="s"></span><span class="b"></span><svg class="cur" viewBox="0 0 10 14"><path d="M0 0v12l3-3 2 5 2-1-2-5h4z" fill="#fff"/></svg></div>`,
  fun: `<div class="m-fun"><i></i><i></i><i></i><i></i></div>`,
};

// ---- WhatsApp ----------------------------------------------------------------------------------------
const WA_NUM = '8801521707826', WA_SHOW = '+880 1521-707826';
const WA = (msg = 'Hi Red Elevators! I’d like to talk about automating my rentals.') => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
const WA_ICON = () => logo('WhatsApp', 20, true);

// ---- Nav + footer ------------------------------------------------------------------
const page = document.body.dataset.page || '';
const NAV = [['services', 'Services', 'Eight systems, two pillars'], ['systems', 'Systems', 'Watch them run'], ['approach', 'Approach', 'Live in three weeks'], ['pricing', 'Pricing', 'Clear prices'], ['contact', 'Contact', 'Book a free call']];
const bookHref = page === 'home' ? '#calm' : '/contact/';
const navHTML = `<header class="nav" id="nav">
  <a class="logo" href="/" aria-label="Red Elevators, home"><img src="/assets/logo-lockup-dark.svg" alt="Red Elevators"></a>
  <nav class="links" aria-label="Main">${NAV.map(l => `<a href="/${l[0]}/"${page === l[0] ? ' class="on" aria-current="page"' : ''}>${l[1]}</a>`).join('')}</nav>
  <div class="nav-r"><a class="book" href="${bookHref}">Book a call</a>
  <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="msheet"><i></i><i></i></button></div></header>
  <div class="msheet" id="msheet" aria-hidden="true">
    <nav aria-label="Mobile">${NAV.map((l, i) => `<a href="/${l[0]}/" style="--i:${i}"${page === l[0] ? ' class="on"' : ''}><span>${l[1]}</span><small>${l[2]}</small></a>`).join('')}</nav>
    <div class="ms-foot" style="--i:5"><a class="btn primary" href="${bookHref}">Book a free 30-min call</a><a class="link" href="mailto:contact@redelevators.com">contact@redelevators.com</a></div>
  </div>`;
const footHTML = `<footer><div class="wrap"><div class="fgrid">
  <div><img src="/assets/logo-lockup-dark.svg" alt="Red Elevators" style="height:34px"><p class="small" style="margin-top:16px;max-width:280px">Automation and marketing systems for short-term rentals. Built in weeks, run by us.</p><a class="link" href="mailto:contact@redelevators.com" style="margin-top:18px">contact@redelevators.com</a></div>
  <div><h6>AI Automation</h6>${SERVICES.filter(s => s.p === 'auto').map(s => `<a href="/services/${s.slug}/">${s.title}</a>`).join('')}</div>
  <div><h6>Marketing</h6>${SERVICES.filter(s => s.p === 'mkt').map(s => `<a href="/services/${s.slug}/">${s.title}</a>`).join('')}</div>
  <div><h6>Company</h6><a href="/approach/">Approach</a><a href="/pricing/">Pricing</a><a href="/systems/">Systems</a><a href="/contact/">Contact</a><a href="https://www.linkedin.com/company/red-elevators">LinkedIn</a></div>
  </div><div class="fbot"><span>© 2026 Red Elevators · <a href="/privacy/">Privacy</a></span><span>Growth on autopilot</span></div></div></footer>`;
const navSlot = $('#site-nav'); if (navSlot) navSlot.outerHTML = navHTML;
// mobile menu: full-screen sheet
{
  const burger = $('.burger'), sheet = $('#msheet');
  if (burger && sheet) {
    const set = open => { document.body.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); sheet.setAttribute('aria-hidden', !open); };
    burger.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
    sheet.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }
}
const footSlot = $('#site-foot'); if (footSlot) footSlot.outerHTML = footHTML;

const band = (title = 'See what you can stop doing by hand.', sub = 'A free 30-minute call. We map your setup and show you what to automate first.') => `
  <div class="band rv"><div><h2 class="d2">${title}</h2><p class="lead" style="margin-top:14px">${sub}</p></div>
  <div class="ctas"><a class="btn primary" href="/contact/">Book a free 30-min call ${ARROW}</a></div></div>`;

// ---- Pipeline player (trigger → steps → result, with a live log) -----------------------
function mountPipe(root, logEl, chain, opts = {}) {
  const nodes = chain[2];
  root.innerHTML = `<span class="pulse"></span>` + nodes.map(n => `<div class="pn"><div class="bx">${toolMark(n[2])}</div><span class="st">${n[0]}</span><span class="ac">${n[1]}</span><span class="tl">${n[2]}</span></div>`).join('');
  const pns = $$('.pn', root), pulse = $('.pulse', root);
  let i = -1, timer, t = 14 * 60 + 2;
  const stamp = () => { t += 1 + Math.floor(Math.random() * 3); return `02:${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
  function tick() {
    i++;
    if (i >= nodes.length) { i = -1; timer = setTimeout(() => { pns.forEach(p => p.classList.remove('on', 'done')); if (logEl) logEl.innerHTML = ''; tick(); }, 2200); return; }
    pns.forEach((p, k) => { p.classList.toggle('on', k === i); p.classList.toggle('done', k < i); });
    const r = pns[i].getBoundingClientRect(), rr = root.getBoundingClientRect();
    pulse.style.left = `${r.left - rr.left + r.width / 2 - 5}px`;
    if (logEl) {
      const d = document.createElement('div');
      d.innerHTML = `<i>${stamp()}</i>  ${nodes[i][0].toLowerCase()} · ${nodes[i][1].toLowerCase()} <i>(${nodes[i][2]})</i>${i === nodes.length - 1 ? '  <b>✓ done</b>' : ''}`;
      logEl.appendChild(d); requestAnimationFrame(() => d.classList.add('in'));
    }
    timer = setTimeout(tick, opts.speed || 1100);
  }
  tick();
  return { stop: () => clearTimeout(timer) };
}

// ---- Booking: a Cal.com-style booker (dark theme, brand colour, free plan) -------------
function mountScheduler(root, onBooked, onStep, opts = {}) {
  root.className = 'calbk';
  root.innerHTML = `<div class="grid">
    <div class="who"><div class="av">${MARK}</div><small>Red Elevators</small><h4>Free 30-min rental systems call</h4>
      <span class="m">${ico('clock')}30m</span><span class="m">${ico('website')}Google Meet</span><span class="m">${ico('direct')}Your time zone</span>
      <p>We map your setup and show you what to automate first. No commitment.</p><p class="when" id="whenTxt"></p>
      ${opts.wa ? `<a class="wa-link" href="${WA()}" target="_blank" rel="noopener">${logo('WhatsApp', 14, true)} Prefer WhatsApp?</a>` : ''}</div>
    <div class="mid"><div class="mh">November 2026<span>‹ ›</span></div><div class="days"></div></div>
    <div class="times"></div>
    <div class="step2"><div class="form">
      <label>Your name<input placeholder="Alex Morgan"></label>
      <label>Email<input type="email" placeholder="alex@example.com"></label>
      <label>How many units do you run?<select><option>1–2</option><option>3–10</option><option>11–50</option><option>50+</option></select></label>
      <label>Anything we should know?<textarea placeholder="Your PMS, what takes the most time…" style="min-height:70px"></textarea></label>
      <div class="row2"><button class="ghostbtn back" type="button">Back</button><button class="bkbtn confirm" type="button">Confirm booking</button></div></div></div>
    <div class="step3"><div class="ok">${ico('check')}</div><h4>This meeting is scheduled</h4><p style="color:var(--sub);margin-top:6px;font-size:13.5px">We sent a calendar invite to your email.</p>
      <dl><dt>What</dt><dd>Free 30-min rental systems call</dd><dt>When</dt><dd class="w"></dd><dt>Where</dt><dd>Google Meet (link in the invite)</dd></dl></div>
  </div><div class="bar">Booking by <b>Cal.com</b></div>`;
  const days = $('.days', root), times = $('.times', root);
  days.innerHTML = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => `<b>${d}</b>`).join('') + '<span></span>'.repeat(6) +
    Array.from({ length: 30 }, (_, i) => { const d = i + 1, dow = (6 + i) % 7, av = dow < 5 && d > 2 && ![6, 19, 24].includes(d); return `<button class="${av ? 'av' : ''}${d === 12 ? ' sel' : ''}${d === 2 ? ' today' : ''}" ${av ? '' : 'disabled'} data-d="${d}">${d}</button>`; }).join('');
  const dayName = d => new Date(2026, 10, d).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  let selDay = 12, h24 = true, selTime = '';
  const SLOTS = ['09:30', '10:00', '10:30', '11:30', '13:00', '14:30', '15:30', '17:00'];
  const fmt = t => { if (h24) return t; let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return `${h}:${String(m).padStart(2, '0')}${ap}`; };
  const render = () => {
    times.innerHTML = `<div class="th">${new Date(2026, 10, selDay).toLocaleDateString('en-US', { weekday: 'short' })} ${selDay}<div class="fmt"><button class="${h24 ? '' : 'on'}" data-f="12">12h</button><button class="${h24 ? 'on' : ''}" data-f="24">24h</button></div></div>` +
      SLOTS.map(t => `<button data-t="${t}">${fmt(t)}</button>`).join('');
  };
  render();
  days.addEventListener('click', e => { const b = e.target.closest('button.av'); if (!b) return; selDay = +b.dataset.d; $$('button', days).forEach(x => x.classList.toggle('sel', x === b)); render(); onStep && onStep('day', dayName(selDay)); });
  times.addEventListener('click', e => {
    const f = e.target.closest('[data-f]'); if (f) { h24 = f.dataset.f === '24'; render(); return; }
    const b = e.target.closest('button[data-t]'); if (!b) return;
    selTime = b.dataset.t; root.classList.add('s2');
    $('#whenTxt', root).innerHTML = `${ico('calendar')}${dayName(selDay)}, ${fmt(selTime)}`;
    onStep && onStep('time', dayName(selDay), fmt(selTime));
  });
  $('.back', root).addEventListener('click', () => { root.classList.remove('s2'); onStep && onStep('back'); });
  $('.confirm', root).addEventListener('click', () => {
    root.classList.remove('s2'); root.classList.add('s3');
    $('.step3 .w', root).textContent = `${dayName(selDay)}, ${fmt(selTime)} · 30 min`;
    onBooked && onBooked(dayName(selDay), fmt(selTime));
  });
}

// ---- Device builders -----------------------------------------------------------------
const phoneShell = (inner, cls = '') => `<div class="phone ${cls}"><div class="frame"></div><span class="side"></span><span class="side l"></span>
  <div class="screen"><div class="wall"></div><div class="island"></div>${inner}<div class="homebar"></div><div class="glare"></div></div></div>`;
const laptopShell = inner => `<div class="laptop"><div class="lid"><span class="cam"></span><div class="lcd">${inner}</div></div><div class="base"></div></div>`;

// chat that plays itself: script = [['in'|'out'|'typing'|'note', text], ...]
function playChat(body, script, loop = true) {
  let k = 0, timer;
  const run = () => {
    if (k >= script.length) { if (!loop) return; timer = setTimeout(() => { body.innerHTML = ''; k = 0; run(); }, 3200); return; }
    const [kind, text] = script[k++];
    const el = document.createElement('div');
    if (kind === 'typing') { el.className = 'typing'; el.innerHTML = '<i></i><i></i><i></i>'; }
    else if (kind === 'note') { el.className = 'note'; el.textContent = text; }
    else { el.className = `bub ${kind}`; el.innerHTML = text; }
    body.appendChild(el); requestAnimationFrame(() => el.classList.add('show'));
    const wait = kind === 'typing' ? 1100 : 1300;
    timer = setTimeout(() => { if (kind === 'typing') el.remove(); run(); }, wait);
  };
  run();
}


// ---- Currency: US dollar first (US + UAE focus), dirham and euro alongside ------------------------
let CUR = new URLSearchParams(location.search).get('cur');
try { CUR = CUR || localStorage.getItem('re-cur'); } catch (e) {}
if (!['usd', 'aed', 'eur'].includes(CUR)) CUR = 'usd';
const FX = { usd: 1, aed: 3.67, eur: .92 };                      // display only; prices below are set per currency
const SYM = () => ({ usd: '$', aed: 'AED ', eur: '€' })[CUR];
// placeholder prices, rounded per currency (not a live exchange rate)
const PRICE = { usd: { s: [990, 2600], m: [160, 490] }, aed: { s: [3600, 9500], m: [590, 1800] }, eur: { s: [900, 2400], m: [150, 450] } };
const money = n => SYM() + Math.round(n).toLocaleString('en-US');
const curListeners = [];
function setCur(c) { CUR = c; try { localStorage.setItem('re-cur', c); } catch (e) {} $$('.curtoggle button').forEach(b => b.classList.toggle('on', b.dataset.c === c)); curListeners.forEach(fn => fn()); }
const curToggle = () => `<div class="curtoggle" role="group" aria-label="Currency">${[['usd', '$ USD'], ['aed', 'AED'], ['eur', '€ EUR']].map(c => `<button data-c="${c[0]}" class="${CUR === c[0] ? 'on' : ''}">${c[1]}</button>`).join('')}</div>`;
document.addEventListener('click', e => { const b = e.target.closest('.curtoggle button'); if (b) setCur(b.dataset.c); });

// ---- Savings calculator ---------------------------------------------------------------------
function mountCalc(root) {
  const F = [['units', 'Units you run', 1, 60, 4, ''], ['msgs', 'Guest messages per unit, per week', 5, 60, 18, ''], ['turn', 'Turnovers per unit, per month', 1, 15, 6, ''],
    ['ota', 'Bookings through Airbnb / Booking.com', 0, 100, 85, '%'], ['rate', 'Average nightly rate', 40, 400, 120, 'cur'], ['nights', 'Nights booked per unit, per month', 5, 30, 18, '']];
  root.classList.add('calc');
  root.innerHTML = `<div class="cin"><div class="chead"><span class="mono">YOUR BUSINESS</span>${curToggle()}</div>${F.map(f => `<label class="sl"><span>${f[1]}<b data-o="${f[0]}"></b></span><input type="range" min="${f[2]}" max="${f[3]}" value="${f[4]}" data-k="${f[0]}"></label>`).join('')}</div>
    <div class="cout"><div class="big"><span class="mono">HOURS BACK EACH MONTH</span><b class="cH">0</b><small class="cD"></small></div>
      <div class="two2"><div><span class="mono">COMMISSION KEPT / MONTH</span><b class="cC">0</b></div><div><span class="mono">REPLIES SENT FOR YOU</span><b class="cR">0</b></div></div>
      <div class="week"><span class="mono">YOUR MONTH, IN HOURS OF ADMIN</span><div class="wb"><i class="wNow"></i><em>now</em></div><div class="wb"><i class="wAfter after"></i><em>with the system</em></div></div>
      <div><span class="mono">START WITH</span><div class="recs"></div></div>
      <p class="mono" style="margin-top:6px">Illustrative estimate. Your audit call gives real numbers.</p></div>`;
  const val = k => +$(`input[data-k="${k}"]`, root).value;
  const anim = (el, to, pre = '') => { const from = +(el.dataset.v || 0); el.dataset.v = to; const t0 = performance.now(); const tick = n => { const k = Math.min(1, (n - t0) / 450), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = pre + v.toLocaleString('en-US'); if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); el.textContent = pre + to.toLocaleString('en-US'); };
  function calc() {
    F.forEach(f => { $(`[data-o="${f[0]}"]`, root).textContent = f[5] === 'cur' ? money(val(f[0]) * FX[CUR]) : val(f[0]) + (f[5] === '%' ? '%' : ''); });
    const u = val('units'), now = u * (val('msgs') * 4.33 * 4 / 60 + val('turn') * 25 / 60 + 3), back = Math.round(now * .7);
    const kept = Math.round(u * val('nights') * val('rate') * FX[CUR] * val('ota') / 100 * .25 * .15), replies = Math.round(u * val('msgs') * 4.33 * .8);
    anim($('.cH', root), back); anim($('.cC', root), kept, SYM()); anim($('.cR', root), replies);
    $('.cD', root).textContent = `about ${Math.max(1, Math.round(back / 8))} working days`;
    $('.wNow', root).style.width = '100%'; $('.wAfter', root).style.width = `${Math.max(6, (now - back) / Math.max(now, 1) * 100)}%`;
    const rec = [];
    if (val('msgs') >= 12) rec.push(SERVICES[0], SERVICES[1]);
    if (val('ota') >= 60) rec.push(SERVICES[2], SERVICES[6]);
    if (val('nights') <= 18) rec.push(SERVICES[4]);
    if (!rec.length) rec.push(SERVICES[0]);
    $('.recs', root).innerHTML = [...new Set(rec)].slice(0, 3).map(s => `<a class="chip" href="/services/${s.slug}/">${ico(s.icon)}${s.title}</a>`).join('');
  }
  root.addEventListener('input', calc); calc(); curListeners.push(calc);
}

// ---- Pricing (placeholder prices) -------------------------------------------------------------
const TIERS = [
  { n: 'Starter', for: '1–5 units', line: 'One system, set up and run for you.', i: 0, items: ['One system of your choice', 'Built inside your own tools', 'Monthly tuning and summary', 'Email and WhatsApp support'] },
  { n: 'Growth', for: '5–30 units', line: 'Automation and marketing working together.', i: 1, pop: true, items: ['Up to three systems', 'Paid social managed (ad spend separate)', 'Direct booking site or engine', 'Priority support'] },
  { n: 'Portfolio', for: '30+ units', line: 'Everything, for larger operators.', i: null, items: ['Any of the eight systems', 'A dedicated build lead', 'Team training and documentation', 'Agreed response times'] },
];
function mountPricing(root, compact = false) {
  root.classList.add('tiers');
  const draw = () => {
    const P = PRICE[CUR];
    root.innerHTML = TIERS.map(t => `<div class="tier${t.pop ? ' pop' : ''}">${t.pop ? '<span class="badge">Recommended</span>' : ''}
      <span class="mono">${t.for.toUpperCase()}</span><h4>${t.n}</h4><p class="ln">${t.line}</p>
      <div class="pr">${t.i !== null ? `<span class="from">from</span><b>${money(P.m[t.i])}</b><span>/month</span>` : '<b>Custom</b>'}</div>
      <p class="setup">${t.i !== null ? `+ ${money(P.s[t.i])} one-time setup` : 'Scoped after the audit call'}</p>
      ${compact ? '' : `<ul>${t.items.map(i => `<li>${ico('check')}${i}</li>`).join('')}</ul>`}
      <a class="btn ${t.pop ? 'primary' : 'quiet'}" href="/contact/">${t.i !== null ? 'Start with a call' : 'Talk to us'}</a></div>`).join('');
  };
  draw(); curListeners.push(draw);
}
function mountBuilder(root) {
  root.classList.add('builder');
  root.innerHTML = `<div class="picks">${SERVICES.map((s, i) => `<label class="pk"><input type="checkbox" ${i === 0 ? 'checked' : ''} data-i="${i}"><span class="box">${ico('check')}</span>${ico(s.icon)}<span>${s.title}</span><span class="tag ${s.p}">${s.p === 'auto' ? 'Auto' : 'Mkt'}</span></label>`).join('')}</div>
    <div class="est"><div class="chead"><span class="mono">YOUR ESTIMATE</span>${curToggle()}</div><div class="row"><div><b class="bS">0</b><small>one-time setup</small></div><div><b class="bM">0</b><small>per month</small></div></div>
    <p class="small bNote"></p><a class="btn primary" href="/contact/">Get a fixed quote</a><p class="mono">Placeholder prices for review. Three or more systems get a bundle saving.</p></div>`;
  const SET = [990, 770, 880, 660, 770, 660, 1320, 990], MO = [160, 130, 110, 100, 220, 110, 70, 200], fx = () => FX[CUR];
  const run = () => {
    const on = $$('input:checked', root).map(x => +x.dataset.i), k = on.length >= 3 ? .85 : 1;
    const st = Math.round(on.reduce((a, i) => a + SET[i], 0) * k * fx() / 50) * 50, mo = Math.round(on.reduce((a, i) => a + MO[i], 0) * k * fx() / 10) * 10;
    $('.bS', root).textContent = money(st); $('.bM', root).textContent = money(mo);
    $('.bNote', root).textContent = on.length ? `${on.length} system${on.length > 1 ? 's' : ''}${on.length >= 3 ? ' · bundle saving applied' : ''}. Ad spend is separate and paid to Meta or Google directly.` : 'Pick at least one system.';
  };
  root.addEventListener('change', run); run(); curListeners.push(run);
}

// ---- The calm phone: alive before booking, reacting while booking ----------------------------
function mountCalmPhone(holder, opts = {}) {
  holder.innerHTML = phoneShell(`<div class="status"><span>2:14</span><span><span class="batt"></span></span></div>
    <div class="clock"><div class="date">Tuesday, October 14</div><div class="time">2:14</div></div>
    <div class="live"><div class="lh"><span class="lm">${MARK}</span><b>Red Elevators</b><span class="run"><i></i>Tonight · running</span></div>
      <div class="lr"><span>Messages answered</span><b class="lc">3</b></div>
      <div class="lr"><span>Next arrival</span><b>Maria · 15:00 · code sent</b></div>
      <div class="lr"><span>This week</span><b class="lw">88% booked</b></div><div class="lbar"><i style="width:88%"></i></div></div>
    <div class="stack cstack"></div><div class="lockicons"><b></b><b></b></div>`, 'alive') + `<p class="mono ex-label">Example night · illustrative</p>`;
  const phone = $('.phone', holder), stack = $('.cstack', holder), lc = $('.lc', holder), lw = $('.lw', holder), lbar = $('.lbar i', holder);
  let count = 3, week = 88, booked = false, ghost = null, nudged = false, idle;
  const QUIET = [['Answered', 'James asked about parking'], ['Booked direct', 'Harbor Studio · 2 nights'], ['Turnover set', 'Rosa · 11:00 · code sent'], ['Rate adjusted', 'Friday +8% · demand is up'], ['Review requested', 'Canal House · checked out'], ['Answered', 'Sofia asked for the pet guide']];
  let qi = 0;
  const card = (cls, ic, hd, tt, bd, href) => { const n = document.createElement(href ? 'a' : 'div'); n.className = `n ${cls}`; if (href) { n.href = href; n.target = '_blank'; n.rel = 'noopener'; }
    n.innerHTML = `<div class="ic"${ic[1] ? ` style="background:${ic[1]}"` : ''}>${ic[0]}</div><div class="hd"><span>${hd}</span><span>now</span></div><div class="tt">${tt}</div><div class="bd">${bd}</div>`; return n; };
  let pinned = null; // the booking placeholder or the nudge stays on top until replaced
  const trim = () => [...stack.children].filter(x => !x.dataset.gone).slice(2).forEach(x => { if (x === pinned) return; x.dataset.gone = 1; x.classList.remove('in'); setTimeout(() => x.remove(), 500); });
  const push = (n, pin = false) => { if (pinned && !pin) stack.insertBefore(n, pinned.nextSibling); else stack.prepend(n); if (pin) pinned = n; requestAnimationFrame(() => n.classList.add('in')); trim(); };
  // quiet, silent "handled" notifications: the system working while you sleep
  const quiet = setInterval(() => {
    if (booked && Math.random() < .5) return;
    const q = QUIET[qi++ % QUIET.length];
    push(card('quiet', [MARK, '#111'], `✓ ${q[0]}`, q[1], 'Handled by your system · nothing needed'));
    if (q[0] === 'Answered') lc.textContent = ++count;
    if (q[0] === 'Booked direct' && week < 97) { week += 3; lw.textContent = `${week}% booked`; lbar.style.width = week + '%'; }
  }, 5200);
  // nudge toward WhatsApp if the visitor isn't booking
  const arm = () => { clearTimeout(idle); if (booked || nudged) return; idle = setTimeout(() => {
      nudged = true;
      const n = opts.nudge === 'wa'
        ? card('nudge', [WA_ICON(), '#25D366'], 'Red Elevators', 'Rather chat first?', 'Tap to message us on WhatsApp →', WA())
        : card('nudge ask', [MARK, '#111'], 'Red Elevators', 'Questions before you book?', 'Message us · a real person replies →', opts.contactHref || '/contact/#chat');
      if (opts.nudge !== 'wa') { n.removeAttribute('target'); n.removeAttribute('rel'); }
      push(n, true); phone.classList.add('buzz');
    }, opts.idle || 12000); };
  // the idle clock only runs while the phone is actually on screen
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) arm(); else clearTimeout(idle); }), { threshold: .4 }).observe(holder);
  ['pointerdown', 'keydown'].forEach(ev => holder.closest('section, main')?.addEventListener(ev, () => { if (!nudged) arm(); }));
  const ghostCard = (title, body) => {
    if (!ghost) { if (pinned && pinned !== ghost) { pinned.dataset.gone = 1; pinned.classList.remove('in'); const old = pinned; setTimeout(() => old.remove(), 500); } ghost = card('ghost', [ico('calendar'), '#fff'], 'Your call', title, body); push(ghost, true); }
    else { $('.tt', ghost).textContent = title; $('.bd', ghost).textContent = body; ghost.classList.remove('pulse'); void ghost.offsetWidth; ghost.classList.add('pulse'); }
  };
  return {
    day: d => { if (!booked) ghostCard(`${d} · pick a time`, 'Not booked yet · 30-min call with Red Elevators'); },
    time: (d, t) => { if (!booked) ghostCard(`${d} · ${t}`, 'Almost there · add your details to confirm'); },
    back: () => {},
    booked: (d, t) => {
      booked = true; clearTimeout(idle);
      if (ghost) { ghost.remove(); ghost = null; pinned = null; }
      push(card('done', [ico('calendar'), '#fff'], 'Calendar · confirmed', 'Call with Red Elevators ✓', `${d}, ${t} · 30 min · Google Meet link inside`), true);
      phone.classList.remove('buzz'); void phone.offsetWidth; phone.classList.add('buzz');
    },
    stop: () => clearInterval(quiet),
  };
}

// ---- WhatsApp button + mobile action bar (every page) ---------------------------------------------
function mountChatButtons() {
  const fab = document.createElement('a');
  fab.className = 'wa-fab'; fab.href = WA(); fab.target = '_blank'; fab.rel = 'noopener'; fab.setAttribute('aria-label', 'Chat on WhatsApp');
  fab.innerHTML = `${logo('WhatsApp', 26, true)}<span>Chat on WhatsApp</span>`;
  const bar = document.createElement('div');
  bar.className = 'mbar';
  bar.innerHTML = `<a class="btn primary" href="/contact/">Book a call</a><a class="btn wa" href="${WA()}" target="_blank" rel="noopener">${logo('WhatsApp', 18, true)} WhatsApp</a>`;
  document.body.append(fab, bar);
  // on the homepage, stay out of the way until the 2am story is over
  const story = document.getElementById('story');
  if (story) {
    const upd = () => { const past = scrollY > story.offsetTop + story.offsetHeight - innerHeight * 1.2; bar.classList.toggle('hide', !past); fab.classList.toggle('hide', !past); };
    addEventListener('scroll', upd, { passive: true }); upd();
  }
}

// ---- Try the assistant (scripted demo) ------------------------------------------------------
function mountTry(root) {
  const RULES = [
    [/refund|complain|broken|dirty|angry|cancel|damage|not working/i, null],
    [/wifi|wi-fi|internet|password/i, 'The wifi is <b>LoftGuest</b>, password <b>sunny-balcony-42</b>. It’s also on the card by the door 🙂', 'House guide · Wifi'],
    [/check.?in|arrive|early|bags|luggage/i, 'Check-in is from 3pm. Arriving earlier? The hall lockbox is free from 11am for your bags.', 'House rules · Arrival'],
    [/check.?out|late|leave/i, 'Checkout is 11am. Late checkout until 1pm is $25. Shall I add it for you?', 'House rules · Checkout + upsell'],
    [/park|car/i, 'Free street parking on Canal Street after 6pm. The nearest garage is the Central garage on 5th Street, a 4-minute walk.', 'Local guide · Parking'],
    [/breakfast|coffee|eat|restaurant|food|dinner/i, 'Café Lumen is 3 minutes away and opens at 8. For dinner, your host loves Osteria Nove.', 'Local guide · Food'],
    [/dog|pet|cat/i, 'Small dogs are welcome with a $20 cleaning fee. Please keep them off the sofa 🐶', 'House rules · Pets'],
  ];
  root.classList.add('try');
  root.innerHTML = `<div class="tcopy"><div class="eyebrow"><i></i>Try it yourself</div><h2 class="d2" style="margin-top:18px">Ask it what a guest would.</h2>
    <p class="lead" style="margin-top:14px">This demo assistant knows one example rental. Ask anything, or try a complaint to see it hand over to you.</p>
    <div class="sugg">${['What’s the wifi password?', 'Can we check in early?', 'Is there parking?', 'Can I bring my dog?', 'I want a refund'].map(q => `<button>${q}</button>`).join('')}</div>
    <p class="mono src" style="margin-top:18px">Answers come only from the house guide.</p></div>
    <div class="tphone">${phoneShell(`<div class="chatui"><div class="ch-h"><span class="av" style="background:#E51E2B">${ico('assistant').replace('class="ico"', 'class="ico" style="width:18px;height:18px"')}</span><div><b>Loft 2B Assistant</b><span>Demo · replies instantly</span></div></div><div class="ch-b tb"><div class="bub out show">Hi! I’m the assistant for Loft 2B. Ask me anything about your stay.</div></div><form class="ch-f tin"><input placeholder="Type a guest question…" autocomplete="off"><button aria-label="Send">${ico('arrow')}</button></form></div>`)}
      <div class="handoff"><div class="n"><div class="ic" style="background:#111">${MARK}</div><div class="hd"><span>Handed to you</span><span>now</span></div><div class="tt">Refund request · Loft 2B</div><div class="bd">Full conversation attached. Nothing was promised to the guest.</div></div></div></div>`;
  const body = $('.tb', root), src = $('.src', root), ho = $('.handoff', root);
  const add = (cls, html) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; body.appendChild(d); requestAnimationFrame(() => d.classList.add('show')); while (body.children.length > 6) body.firstChild.remove(); return d; };
  const ask = q => {
    if (!q.trim()) return; add('bub in', q.replace(/</g, '&lt;'));
    const ty = add('typing', '<i></i><i></i><i></i>');
    setTimeout(() => {
      ty.remove();
      const r = RULES.find(x => x[0].test(q));
      if (r && r[1] === null) { add('bub out', 'I’m sorry about that. I’ve passed this to Sam, your host, who will reply shortly.'); src.innerHTML = '<span style="color:var(--amber)">Handed to the owner: anything about money or complaints.</span>'; ho.classList.add('show'); setTimeout(() => ho.classList.remove('show'), 4200); }
      else if (r) { add('bub out', r[1]); src.textContent = `Answered from: ${r[2]}`; }
      else { add('bub out', 'Good question! I don’t want to guess, so I’ve asked your host. You’ll hear back shortly.'); src.innerHTML = '<span style="color:var(--amber)">Not in the house guide, so it asked the owner instead of guessing.</span>'; }
    }, 900);
  };
  $('.sugg', root).addEventListener('click', e => { const b = e.target.closest('button'); if (b) ask(b.textContent); });
  $('form', root).addEventListener('submit', e => { e.preventDefault(); const i = $('input', e.target); ask(i.value); i.value = ''; });
}

// ---- Three-week calendar (home + approach): hover/tap a day, phases light up -----------------------
const CAL_PLAN = [['audit', 'audit', 'audit', 'design', 'design'], ['design', 'build', 'build', 'build', 'build'], ['build', 'build', 'build', 'build', 'live']];
const CAL_YOU = { '0-0': 1, '0-4': 1, '2-4': 1 };
const CAL_TIP = { '0-0': 'You: 30-min audit call', '0-1': 'We walk your inbox, calendars and hand-offs', '0-2': 'Leak report ready: what to fix first', '0-3': 'Workflow drafted, every checkpoint marked',
  '0-4': 'You: approve the plan (15 min)', '1-0': 'Final tweaks to the design', '1-1': 'Building inside your own tools', '1-2': 'Connecting PMS, inbox and calendars', '1-3': 'Writing replies in your voice',
  '1-4': 'First test run on real data', '2-0': 'Edge cases: refunds, late arrivals', '2-1': 'Second test run, all paths', '2-2': 'All tests passing', '2-3': 'Soft launch on one unit',
  '2-4': 'You: launch walkthrough. You’re live' };
const PHASE = { audit: ['Audit', 'rgba(185,195,255,.62)'], design: ['Design', 'rgba(255,196,140,.68)'], build: ['Build', 'rgba(255,45,59,.72)'], live: ['Live', 'rgba(143,212,176,.78)'] };
function mountCal3(root, opts = {}) {
  root.classList.add('cal3', 'interactive');
  let n = 0;
  root.innerHTML = `<div class="wd"><span></span>${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<span>${d}</span>`).join('')}</div>`
    + CAL_PLAN.map((w, wi) => `<div class="wk3"><span>Week ${wi + 1}</span>${w.map((p, di) => `<button class="d" data-p="${p}" data-k="${wi}-${di}" style="--c:${PHASE[p][1]};--dl:${(n++) * .06}s" aria-label="Week ${wi + 1} ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][di]}: ${CAL_TIP[wi + '-' + di]}">${CAL_YOU[wi + '-' + di] ? '<span class="you"></span>' : ''}</button>`).join('')}<div class="d we"></div><div class="d we"></div></div>`).join('')
    + `<div class="run" data-p="live">${ico('run')} Week 4 onward · we run it, you get a monthly summary</div>
    <div class="cal-detail"><span class="cd-ph"></span><span class="cd-tx">Hover or tap a day to see what happens.</span></div>
    ${opts.legend === false ? '' : `<div class="leg">${Object.entries(PHASE).map(([k, v]) => `<span data-p="${k}"><i style="background:${v[1]}"></i>${v[0]}</span>`).join('')}<span><i style="background:#fff;border-radius:50%"></i>Needs you (3 times)</span></div>`}`;
  const cells = $$('button.d', root), ph = $('.cd-ph', root), tx = $('.cd-tx', root), linked = opts.link ? $$('[data-phase]', opts.link) : [];
  const highlight = (p, k) => {
    root.classList.toggle('hl', !!p);
    cells.forEach(c => c.classList.toggle('dim', !!p && c.dataset.p !== p));
    cells.forEach(c => c.classList.toggle('cur', c.dataset.k === k));
    linked.forEach(l => l.classList.toggle('on', l.dataset.phase === p));
    if (p && k) { const [w, d] = k.split('-').map(Number); ph.textContent = `${PHASE[p][0]} · Week ${w + 1}, ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][d]}`; ph.style.setProperty('--c', PHASE[p][1]); tx.textContent = CAL_TIP[k]; root.classList.add('has-detail'); }
    else if (p) { ph.textContent = PHASE[p][0]; ph.style.setProperty('--c', PHASE[p][1]); tx.textContent = { audit: 'Days 1–3 · we learn your setup.', design: 'Week 1 · a plan in plain language.', build: 'Weeks 2–3 · built and tested in your tools.', live: 'Week 3 onward · live, then we run it.' }[p]; root.classList.add('has-detail'); }
  };
  cells.forEach(c => { c.addEventListener('mouseenter', () => highlight(c.dataset.p, c.dataset.k)); c.addEventListener('focus', () => highlight(c.dataset.p, c.dataset.k)); c.addEventListener('click', () => { highlight(c.dataset.p, c.dataset.k); opts.onPick && opts.onPick(c.dataset.p); }); });
  root.addEventListener('mouseleave', () => highlight(null));
  linked.forEach(l => { l.addEventListener('mouseenter', () => highlight(l.dataset.phase)); l.addEventListener('mouseleave', () => highlight(null)); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { root.classList.add('in'); io.disconnect(); } }), { threshold: .3 });
  io.observe(root);
}

// ---- One booking, start to finish (Systems page): swipeable journey -------------------------------
const JOURNEY = [
  ['message', 'Enquiry', 'Day −14', [['out', 'Is Loft 2B free Oct 18–20?'], ['in', 'Yes, it is! Book direct here and skip the fees →']], ['Airbnb', 'Claude'], 'Checked the calendar and replied in seconds, in your tone.'],
  ['payment', 'Booked direct', 'Day −14', [['in', 'Booking confirmed · Oct 18–20 · $340 ✓']], ['Stripe', 'Google Sheets'], 'Payment taken, every calendar blocked, guest added to your CRM.'],
  ['key', 'Before arrival', 'Day −1', [['in', 'Your door code is 4821. Here’s your check-in guide 🗝️']], ['WhatsApp'], 'Fresh door code generated and sent with the guide.'],
  ['assistant', 'During the stay', 'Day 0–2', [['out', 'Where’s the nearest pharmacy?'], ['in', 'Two minutes’ walk: the Main Street pharmacy, open till 10pm.']], ['Claude'], 'Answered from your local guide, any hour, any language.'],
  ['clean', 'Checkout & turnover', 'Day 2', [['in', 'Thanks for staying! Safe travels 👋']], ['WhatsApp', 'Airtable'], 'Rosa booked for 11:00, linens ordered, next code queued.'],
  ['review', 'Review', 'Day 3', [['in', 'How was your stay? A review would mean a lot ★']], ['Airbnb'], 'Asked at the best moment. Five stars flagged to you.'],
  ['mail', 'Comes back', 'Day +90', [['in', 'Spring is coming. Past guests save 10% booking direct.']], ['MailChimp', 'Meta'], 'Past guests invited back direct, by email and ads.'],
];
function mountJourney(root, opts = {}) {
  root.classList.add('journey');
  root.innerHTML = `<div class="jtrack">${JOURNEY.map((f, i) => `<div class="fstep" data-i="${i}">
    <div class="top"><div class="ico-tile">${ico(f[0])}</div><h4>${f[1]}</h4><span class="mono">${f[2]}</span></div>
    <div class="lane"><span class="mono">Guest sees</span><div style="display:grid;gap:6px">${f[3].map(b => `<div class="bub ${b[0]}">${b[1]}</div>`).join('')}</div></div>
    <div class="lane"><span class="mono">System does</span><div class="sys"><span class="lg">${f[4].map(l => logo(l, 16)).join('')}</span><span>${f[5]}</span></div></div></div>`).join('')}</div>
    <div class="jctl"><button class="jb" data-d="-1" aria-label="Previous step">${ico('arrow')}</button><div class="progress" style="margin:0;flex:1"><i></i></div><button class="jb" data-d="1" aria-label="Next step">${ico('arrow')}</button><span class="mono jc">1 / ${JOURNEY.length}</span></div>`;
  const track = $('.jtrack', root), cards = $$('.fstep', root), bar = $('.progress i', root), jc = $('.jc', root);
  const show = f => {
    bar.style.width = `${Math.max(8, f * 100)}%`;
    const i = Math.round(f * (cards.length - 1)); jc.textContent = `${i + 1} / ${cards.length}`;
    cards.forEach((c, k) => { c.classList.toggle('on', k <= i); c.classList.toggle('cur', k === i); });
  };
  // pinned: the section holds still and vertical scroll drives the cards sideways (homepage)
  const sec = opts.pin, pinned = sec && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (pinned) {
    root.classList.add('pinned'); sec.classList.add('jpinned');
    let max = 0;
    const travel = () => sec.offsetHeight - innerHeight;
    const size = () => { const last = cards[cards.length - 1]; max = Math.max(0, last.offsetLeft + last.offsetWidth - track.clientWidth); sec.style.height = `${innerHeight + max * 1.1 + innerHeight * .25}px`; upd(); };
    const upd = () => {
      const f = clamp(-sec.getBoundingClientRect().top / Math.max(1, travel()));
      track.style.transform = `translateX(${-f * max}px)`; show(f);
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', size); size(); setTimeout(size, 600);
    root.addEventListener('click', e => {
      const b = e.target.closest('.jb'); if (!b) return;
      const f = clamp(-sec.getBoundingClientRect().top / travel()), i = clamp(Math.round(f * (cards.length - 1)) + +b.dataset.d, 0, cards.length - 1);
      scrollTo({ top: sec.offsetTop + i / (cards.length - 1) * travel(), behavior: 'smooth' });
    });
    return;
  }
  const upd = () => { const max = track.scrollWidth - track.clientWidth; show(max > 0 ? track.scrollLeft / max : 0); };
  track.addEventListener('scroll', upd, { passive: true }); upd();
  root.addEventListener('click', e => { const b = e.target.closest('.jb'); if (!b) return; track.scrollBy({ left: +b.dataset.d * (cards[0].offsetWidth + 20), behavior: 'smooth' }); });
}

// ---- Reveal + nav state ------------------------------------------------------------------
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.rv, .weeks, .cal3').forEach(el => io.observe(el));
}
addEventListener('scroll', () => { const n = $('#nav'); if (n) n.classList.toggle('scrolled', scrollY > 10); }, { passive: true });

window.SITE = { mountJourney, mountCal3, mountCalmPhone, WA, WA_SHOW, curToggle, setCur, mountCalc, mountPricing, mountBuilder, mountTry, SERVICES, VIZ, ARROW, toolMark, toolPill, band, mountPipe, mountScheduler, phoneShell, laptopShell, playChat, reveal, $, $$ };
})();
