/* ==========================================================================
   Red Elevators — the system player (Systems page + every service page).
   Left: what the guest (or owner) sees. Right: the steps, labelled with the
   four parts every system has. Needs logos.js, icons.js and site.js first.
   ========================================================================== */
(() => {
const { SERVICES, $, $$ } = SITE;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LG = { 'Meta Ads': 'Meta' };
const tool = t => t === 'You' ? ico('lock') : (window.LOGOS || {})[LG[t] || t] ? logo(LG[t] || t, 20) : `<span class="mono-t">${t[0]}</span>`;
const PARTS = [['trigger', 'Trigger'], ['tools', 'Your tools'], ['check', 'Your checkpoint'], ['log', 'Log']];
const SHORT = ['Guest Messaging', 'AI Guest Assistant', 'Direct Booking Engine', 'Listing & Content', 'Paid Social', 'Photo & Ad Creative', 'Booking Website', 'Booking Campaigns'];
const REPLAY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>Replay';

// ---- the eight runs: steps [time, part, tool, text] and a screen whose parts appear by step (data-at / data-to) ----
const at = (k, html, to) => html.replace(/^<(\w+)/, `<$1 data-at="${k}"${to !== undefined ? ` data-to="${to}"` : ''}`);
const typing = (k, to) => at(k, '<div class="typ"><i></i><i></i><i></i></div>', to);
const RUNS = [
  { see: 'guest', dev: 'phone', app: ['Airbnb', 'Maria · Loft 2B', 'Arrives today', '#FF5A5F'],
    title: 'A guest question, answered in seconds', desc: 'A message lands, the system reads it, checks the booking and replies in your tone.',
    steps: [['0.0s', 'trigger', 'Airbnb', 'Maria asks: “Could we check in early, around 11?”'], ['0.4s', 'tools', 'Claude', 'Claude reads it: an early check-in request'], ['0.9s', 'tools', 'Guesty', 'Guesty: Loft 2B is cleaned by 11:30, free from 12:00'], ['2.1s', 'tools', 'Claude', 'Claude drafts the reply in your tone'], ['2.3s', 'check', 'You', 'Your rule: no money involved, so it can send. Anything else waits for you'], ['4.0s', 'log', 'Guesty', 'Sent, and saved to Maria’s guest profile']],
    screen: at(0, '<div class="bub in">Hi! Could we check in early, around 11? ✈️<small>2:14 pm</small></div>') + typing(1, 5) + at(5, '<div class="bub out">Hi Maria! Your loft is ready from 12:00, so come at noon. Happy to hold your bags from 11 😊<small>Replied in 4 s</small></div>'),
    was: '~12 min', now: '4 seconds', ctl: 'You set the tone. Refunds, complaints and anything unusual come to you first.' },
  { see: 'guest', dev: 'phone', app: ['WhatsApp', 'Harbor Studio', 'Assistant · replies 24/7', '#25D366'],
    title: 'One assistant runs every conversation', desc: 'A late-night question gets a real answer from your house guide, plus an offer you’d never have time to make.',
    steps: [['23:40', 'trigger', 'WhatsApp', 'A guest asks about parking and a late checkout'], ['+0.5s', 'tools', 'Claude', 'Claude finds the parking details in your house guide'], ['+1.2s', 'tools', 'n8n', 'n8n checks tomorrow: no arrival until 4pm, so late checkout works'], ['+2.0s', 'tools', 'Claude', 'Claude answers both and offers late checkout for $25'], ['+2.1s', 'check', 'You', 'Payment only through your Stripe link. Refunds always come to you'], ['+40s', 'log', 'Notion', 'Guest says yes: +$25, logged']],
    screen: at(0, '<div class="bub in">Hi! Is parking free? And could we check out late tomorrow?<small>11:40 pm</small></div>') + typing(1, 3) + at(3, '<div class="bub out wa">Parking is free in the courtyard, gate code 1942 🚗 Late checkout until 2pm is available for $25. Want it?<small>11:40 pm</small></div>') + at(4, '<div class="bub in">Yes please!<small>11:41 pm</small></div>') + at(5, '<div class="bub out wa">Done ✓ Pay here: harborstudio.com/late<small>11:41 pm</small></div>') + at(5, '<div class="pill">+$25 · late checkout</div>'),
    was: 'You, at 11:40pm', now: 'Instant, any hour', ctl: 'It answers only from your house guide. Money, damage and complaints go to you.' },
  { see: 'guest', dev: 'phone', app: ['Mail', 'Inbox', 'Sofia’s phone', '#3a3a46', 'mail'],
    title: 'Past guests, back on the calendar', desc: 'Your guest list is sorted, each guest gets a personal note, and the offer sends itself.',
    steps: [['Mon 8:00', 'trigger', 'Airtable', '38 past guests in your list'], ['+2s', 'tools', 'n8n', 'Picks the 12 who stayed in spring and left 5 stars'], ['+30s', 'tools', 'Claude', 'Writes a personal note for each of them'], ['8:15', 'check', 'You', 'You approve the offer once: 10% off, direct only'], ['9:00', 'tools', 'MailChimp', 'Sent at 9am in each guest’s time zone'], ['Wed', 'log', 'Stripe', 'Sofia books 3 nights direct. $0 commission']],
    screen: at(0, '<div class="scard muted"><div class="row"><b>Weekly digest</b><span class="muted">7:02</span></div><div class="ln" style="width:70%"></div></div>') + at(0, '<div class="scard muted"><div class="row"><b>Your receipt</b><span class="muted">Yesterday</span></div><div class="ln" style="width:55%"></div></div>') + at(4, '<div class="scard" style="border-color:rgba(139,147,255,.5)"><div class="row"><b>Harbor Studio</b><span class="okk">New</span></div><div style="margin-top:4px">Sofia, spring is back at the harbor 🌊</div><div class="muted" style="margin-top:4px">As a past guest, book direct and save 10%…</div></div>', 5) + at(5, '<div class="scard"><b>Sofia, spring is back at the harbor 🌊</b><p class="muted" style="margin-top:6px">It’s been a year since your stay. The terrace is open again. As a past guest, book direct and save 10%.</p><div style="margin-top:10px;padding:9px;border-radius:9px;background:#d8203a;text-align:center;font-weight:600">Book direct</div></div>') + at(5, '<div class="pill">Booked · May 3–6 · $612 · no fee</div>'),
    was: '~3 hours a send', now: '2 min to approve', ctl: 'Nothing goes out until you approve the offer. You choose who gets it.' },
  { see: 'guest', dev: 'web', url: 'harborstudio.com/guides/spring',
    title: 'Fresh listings and guides, on schedule', desc: 'A topic comes due, gets researched and written in your voice, checked, and published.',
    steps: [['Mon 7:00', 'trigger', 'n8n', 'The spring guide is due'], ['7:01', 'tools', 'Claude', 'Researches what’s new near Canal House'], ['7:04', 'tools', 'Claude', 'Writes it in your voice, with photos you’ve approved'], ['7:05', 'check', 'You', 'Facts and links checked. You can pull it before 9am'], ['9:00', 'tools', 'Webflow', 'Published on your site'], ['9:01', 'log', 'Airbnb', 'Listing description updated to match']],
    screen: at(0, '<div class="mono" style="font-size:11px">GUIDE · SPRING 2026</div>') + at(1, '<div class="scard muted">Research notes: 4 new cafés · market reopens Sat · ferry timetable changed</div>', 2) + at(2, '<div><div style="font-family:var(--display);font-size:22px;font-weight:600;letter-spacing:-.02em;line-height:1.15">Spring near Canal House: six new spots</div><div class="ln"></div><div class="ln" style="width:92%"></div><div class="ln" style="width:80%"></div></div>') + at(2, '<div class="tiles"><div class="tl" style="height:84px"></div><div class="tl" style="height:84px;filter:hue-rotate(160deg)"></div></div>') + at(3, '<div class="row" style="gap:6px"><span class="okk">✓ 6 links</span><span class="okk">✓ facts</span><span class="okk">✓ tone</span><span></span></div>') + at(4, '<div class="pill">Published · Mon 9:00</div>') + at(5, '<div class="scard"><div class="row"><span style="width:18px">' + logo('Airbnb', 16) + '</span><b>Listing description</b><span class="okk">Updated</span></div></div>'),
    was: '~4 hours a month', now: '0 hours', ctl: 'Every piece can be pulled before it publishes. Your voice, your photos.' },
  { see: 'you', dev: 'web', url: 'Ads · Harbor Studio · today',
    title: 'Budget follows the bookings, every day', desc: 'Each morning the ads are compared, the weak one is flagged, and budget moves to what books.',
    steps: [['7:00', 'trigger', 'Meta', 'Yesterday’s ad results come in'], ['7:01', 'tools', 'Make', 'Compares cost per booking across your 3 ads'], ['7:01', 'tools', 'Slack', '“Weekend in the city” costs $58 a booking, 3× the others'], ['7:02', 'check', 'You', 'Inside your $40/day limit, so it can shift. Bigger moves wait for you'], ['7:02', 'tools', 'Meta', 'Moves $12/day to “Midweek escape”'], ['7:02', 'log', 'Notion', 'Change logged, with the reason']],
    screen: at(0, '<div class="scard"><div class="row"><b>Midweek escape</b><span class="muted">$19 / booking</span></div><div class="bar2" style="--bc:#8fd4b0"><i style="--w:45%"></i></div></div>') + at(0, '<div class="scard"><div class="row"><b>Weekend in the city</b><span class="muted">$58 / booking</span></div><div class="bar2" style="--bc:#ff8a80"><i style="--w:40%"></i></div></div>') + at(0, '<div class="scard"><div class="row"><b>Long stay, pay for five</b><span class="muted">$21 / booking</span></div><div class="bar2"><i style="--w:15%"></i></div></div>') + at(2, '<div class="row" style="gap:6px"><span class="flag">Weak: Weekend in the city</span><span></span></div>') + at(4, '<div class="scard" style="border-color:rgba(143,212,176,.4)"><div class="row"><b>Budget moved</b><span class="okk">+$12/day</span></div><div class="muted" style="margin-top:4px">Weekend in the city paused → Midweek escape now $26/day</div></div>') + at(5, '<div class="pill">Logged · 7:02</div>'),
    was: '~30 min every morning', now: '0 minutes', ctl: 'You set the daily limit. Anything above it waits for your OK.' },
  { see: 'you', dev: 'web', url: 'Creative set · Spring',
    title: 'One property, every format, one approval', desc: 'One shoot becomes every format you need, with captions, and you approve it once.',
    steps: [['Tue', 'trigger', 'Canva', 'One shoot of Harbor Studio is approved'], ['+1 min', 'tools', 'Canva', 'Cut into every format: feed, story, banner, listing'], ['+2 min', 'tools', 'Claude', 'Writes a caption for each one'], ['+3 min', 'check', 'You', 'One approval for the whole set, in Slack'], ['+3 min', 'tools', 'Meta', 'Ready to run on Meta and Google'], ['+3 min', 'log', 'Notion', 'Set saved to your library']],
    screen: at(0, '<div class="tl" style="height:130px"><b>Original</b></div>', 1) + at(1, '<div class="tiles"><div class="tl" style="height:92px"><b>1:1 feed</b></div><div class="tl" style="height:92px;filter:hue-rotate(20deg)"><b>9:16 story</b></div><div class="tl" style="height:60px;filter:hue-rotate(-20deg)"><b>16:9 banner</b></div><div class="tl" style="height:60px;filter:saturate(.7)"><b>Listing</b></div></div>') + at(2, '<div class="scard muted">“Midweek escape. Wake up on the water, book direct and save 10%.” <span class="muted">+3 more</span></div>') + at(3, '<div class="scard" style="border-color:rgba(232,163,61,.5)"><div class="row"><b>Approve “Spring set”?</b><span class="okk">Approved ✓</span></div><div class="muted" style="margin-top:4px">4 formats · 4 captions</div></div>') + at(4, '<div class="pill">Ready to run · Meta + Google</div>'),
    was: '~1 day of resizing', now: '1 approval', ctl: 'Nothing runs without your sign-off on the set.' },
  { see: 'you', dev: 'web', url: 'harborstudio.com · Book',
    title: 'The site and the calendar stay in sync', desc: 'Every night your site is checked against every calendar and your price rules.',
    steps: [['02:00', 'trigger', 'Guesty', 'Nightly check: your site against every calendar'], ['02:00', 'tools', 'Airbnb', 'Oct 18–20 was just booked on Airbnb'], ['02:00', 'tools', 'n8n', 'Your site still showed it open, so it’s blocked there too'], ['02:01', 'tools', 'PriceLabs', 'Sunday’s rate is $20 under your floor: flagged'], ['07:30', 'check', 'You', 'Rate changes need your OK: one tap'], ['07:30', 'log', 'Notion', 'Report saved. Zero double bookings']],
    screen: '<div class="row"><b>October</b><span class="muted" style="font-size:12px">Loft 2B</span></div><div class="cal">' + ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<span class="h">${d}</span>`).join('') + Array.from({ length: 21 }, (_, i) => { const d = i + 13; return d >= 18 && d <= 20 ? `<span class="b" style="transition:background .5s,color .5s">${d}</span>` : `<span>${d}</span>`; }).join('') + '</div>' + at(1, '<div class="row" style="gap:6px"><span class="flag" style="background:rgba(232,163,61,.15);color:#f3c27a">Airbnb: Oct 18–20 booked</span><span></span></div>') + at(2, '<div class="row" style="gap:6px"><span class="okk">Blocked on your site</span><span></span></div>') + at(3, '<div class="scard"><div class="row"><b>Sun, Oct 26</b><span class="flag">$120 &lt; $140 floor</span></div></div>') + at(4, '<div class="scard" style="border-color:rgba(232,163,61,.5)"><div class="row"><b>Raise to $140?</b><span class="okk">Approved ✓</span></div></div>') + at(5, '<div class="pill">All calendars in sync ✓</div>'),
    was: 'A double booking, eventually', now: 'Caught overnight', ctl: 'You own the site and the data. Price changes need your OK.' },
  { see: 'you', dev: 'web', url: 'Bookings · this week',
    title: 'One view, from first click to confirmed stay', desc: 'Clicks from every channel become one funnel, and the leak gets flagged with a fix.',
    steps: [['8:00', 'trigger', 'Google Ads', 'Clicks from Google, Meta and email come in'], ['8:00', 'tools', 'Make', 'Merged into one funnel'], ['8:01', 'tools', 'Claude', 'Finds the leak: 40% leave at the payment step'], ['8:01', 'tools', 'Slack', 'Suggests a fix: show the full price upfront'], ['8:05', 'check', 'You', 'You decide on the fix'], ['Fri', 'log', 'Notion', 'One-page report in your inbox']],
    screen: at(0, '<div class="fun">' + [['Clicks', '1,240', 100, '#8b93ff'], ['Site visits', '860', 69, '#8b93ff'], ['Reached payment', '210', 17, '#8b93ff'], ['Booked', '126', 10, '#8fd4b0']].map(f => `<div><div class="row"><span class="muted">${f[0]}</span><b>${f[1]}</b></div><div class="bar2" style="--bc:${f[3]}"><i style="--w:${f[2]}%"></i></div></div>`).join('') + '</div>') + at(1, '<div class="row" style="gap:6px"><span class="okk">Google</span><span class="okk">Meta</span><span class="okk">Email</span><span></span></div>') + at(2, '<div class="row" style="gap:6px"><span class="flag">−40% at payment</span><span></span></div>') + at(3, '<div class="scard" style="border-color:rgba(232,163,61,.5)"><b>Suggested fix</b><div class="muted" style="margin-top:4px">Show cleaning fee and taxes on the first screen.</div></div>') + at(5, '<div class="pill">Weekly report sent · Fri 8:00</div>'),
    was: '~2 hours a week', now: 'In your inbox', ctl: 'You set the goals and the budget. Fixes are suggestions until you say yes.' },
];

// opts: { i: starting system, tabs: show the picker, hash: keep #slug in the URL, link: 'service' | 'systems' }
function mountPlayer(root, opts = {}) {
  const uid = 'pl' + Math.random().toString(36).slice(2, 7);
  const tab = s => `<button role="tab" data-i="${s.idx}" data-p="${s.p}" aria-selected="false" aria-controls="${uid}">${ico(s.icon)}${SHORT[s.idx]}</button>`;
  root.innerHTML = (opts.tabs ? `<div class="sxp" role="tablist" aria-label="Systems"><div class="sxp-row"><span class="mono">AI AUTOMATION</span>${SERVICES.filter(s => s.p === 'auto').map(tab).join('')}</div><div class="sxp-row"><span class="mono">MARKETING</span>${SERVICES.filter(s => s.p === 'mkt').map(tab).join('')}</div></div>` : '') +
    `<div class="pl rv" id="${uid}" ${opts.tabs ? 'role="tabpanel"' : ''}>
      <div class="pl-left"><span class="mono see"></span><div class="devh"></div><div class="cap" aria-live="polite"></div><span class="mono" style="justify-self:center;font-size:11px">Illustrative example</span></div>
      <div class="pl-right">
        <div class="pl-head"><span class="tag"></span><h3></h3><p></p>
          <div class="pl-act"><button class="btn quiet replay">${REPLAY}</button><a class="link ex"></a></div></div>
        <div class="legend"><span class="mono">FOUR PARTS</span>${PARTS.map(p => `<button data-part="${p[0]}"><i></i>${p[1]}</button>`).join('')}</div>
        <ol class="steps"></ol>
        <div class="pl-foot"></div>
      </div>
    </div>`;
  const q = s => $(s, root), qq = s => $$(s, root);
  const tabs = qq('.sxp button'), pl = q('.pl'), stepsEl = q('.steps'), dev = q('.devh'), foot = q('.pl-foot'), cap = q('.cap');
  if (opts.tabs) {
    q('.sxp').addEventListener('click', e => { const b = e.target.closest('button'); if (b) select(+b.dataset.i, true); });
    q('.sxp').addEventListener('keydown', e => { // arrow keys move between tabs
      const i = tabs.indexOf(document.activeElement); if (i < 0 || !['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); select(+n.dataset.i, true);
    });
  }
  const legend = q('.legend');
  const legendHl = part => { stepsEl.classList.toggle('hl', !!part); qq('.st').forEach(s => s.classList.toggle('hl', s.dataset.part === part)); qq('.legend button').forEach(b => b.classList.toggle('on', b.dataset.part === part)); };
  legend.addEventListener('pointerover', e => { const b = e.target.closest('button'); legendHl(b ? b.dataset.part : null); });
  legend.addEventListener('pointerleave', () => legendHl(null));
  legend.addEventListener('focusin', e => { const b = e.target.closest('button'); if (b) legendHl(b.dataset.part); });
  legend.addEventListener('focusout', () => legendHl(null));
  q('.replay').addEventListener('click', () => play());

  let cur = 0, timer = null, seen = false;
  function select(i, go) {
    cur = i; const s = SERVICES[i], r = RUNS[i];
    tabs.forEach(b => b.setAttribute('aria-selected', +b.dataset.i === i));
    const on = tabs.find(b => +b.dataset.i === i); if (on && go && innerWidth <= 860) on.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    const tg = q('.pl-head .tag'); tg.textContent = s.title; tg.className = `tag ${s.p}`; tg.hidden = opts.link === 'systems';
    q('.pl-head h3').textContent = r.title; q('.pl-head p').textContent = r.desc;
    const ex = q('.ex');
    if (opts.link === 'systems') { ex.href = 'systems.html'; ex.textContent = 'See all eight systems →'; }
    else { ex.href = `service.html?s=${s.slug}`; ex.textContent = 'See the service →'; }
    q('.see').textContent = r.see === 'you' ? 'WHAT YOU SEE' : 'WHAT YOUR GUEST SEES';
    const a = r.app || [];
    dev.innerHTML = r.dev === 'phone'
      ? `<div class="dv phone scene"><div class="app"><span class="av" style="--g:${a[3]}">${a[4] ? ico(a[4]) : logo(a[0], 17, true)}</span><div><b>${a[1]}</b><small>${a[2]}</small></div></div><div class="body">${r.screen}</div></div>`
      : `<div class="dv web scene"><div class="bar"><i></i><span>${r.url}</span></div><div class="body">${r.screen}</div></div>`;
    stepsEl.innerHTML = '<span class="fill"></span>' + r.steps.map(st => `<li class="st" data-part="${st[1]}"><span class="nd">${tool(st[2])}</span><span class="tx"><small>${st[0]} · ${st[2]}</small>${st[3]}</span><span class="pt">${PARTS.find(p => p[0] === st[1])[1].toUpperCase()}</span></li>`).join('');
    foot.innerHTML = `<div class="was"><span class="mono">BY HAND</span><b>${r.was}</b></div><div class="now"><span class="mono">WITH THE SYSTEM</span><b>${r.now}</b></div><div class="ctl"><span class="mono">YOU STAY IN CONTROL</span><p>${r.ctl}</p></div>`;
    if (go && opts.hash) history.replaceState(null, '', `#${s.slug}`);
    if (go || seen) play(); else show(-1);
  }
  function show(n) {
    const sts = qq('.st'), last = sts.length - 1;
    sts.forEach((el, i) => { el.classList.toggle('on', i === n); el.classList.toggle('done', i < n || (n === last && i === n)); });
    $$('[data-at]', dev).forEach(el => { const a = +el.dataset.at, t = el.dataset.to; el.classList.toggle('on', n >= a); el.classList.toggle('off', t !== undefined && n >= +t); });
    $$('.cal .b', dev).forEach(el => { const b = n >= 1, x = n >= 2; el.style.background = x ? 'rgba(255,255,255,.02)' : b ? 'rgba(232,163,61,.25)' : ''; el.style.color = x ? 'var(--dim)' : ''; el.style.textDecoration = x ? 'line-through' : ''; });
    const at = sts[Math.max(0, n)], fill = q('.steps .fill');
    if (fill && at) fill.style.height = n < 0 ? '0px' : `${at.offsetTop + at.offsetHeight / 2 - 22}px`;
    foot.style.opacity = n >= last ? 1 : .55;
    // scroll only as far as the newest item needs, so earlier context stays visible
    const body = $('.body', dev);
    if (body) setTimeout(() => {
      if (n < 0) { body.scrollTop = 0; return; }
      const shown = $$('[data-at].on:not(.off)', dev).filter(el => +el.dataset.at === Math.max(...$$('[data-at].on:not(.off)', dev).map(x => +x.dataset.at)));
      const last = shown[shown.length - 1]; if (!last) return;
      const over = last.offsetTop + last.offsetHeight + 14 - (body.scrollTop + body.clientHeight);
      if (over > 0) body.scrollTo({ top: body.scrollTop + over, behavior: reduce ? 'auto' : 'smooth' });
    }, 120);
    const st = RUNS[cur].steps[Math.max(0, n)], part = PARTS.find(p => p[0] === st[1]);
    cap.dataset.part = st[1]; cap.innerHTML = `<b>${Math.max(0, n) + 1}/${sts.length} · ${part[1].toUpperCase()}</b><span>${st[3]}</span>`;
  }
  function play() {
    clearTimeout(timer); seen = true;
    const n = RUNS[cur].steps.length;
    if (reduce) { show(n - 1); return; }
    show(-1);
    const tick = i => { show(i); if (i < n - 1) timer = setTimeout(() => tick(i + 1), i === 0 ? 1300 : 1500); };
    timer = setTimeout(() => tick(0), 350);
  }
  // starts when the player comes into view, not on page load
  new IntersectionObserver(([e]) => { if (e.isIntersecting && !seen) play(); }, { threshold: .35 }).observe(pl);
  select(opts.i || 0, false);
  return { select, get cur() { return cur; } };
}

window.PLAYER = { mountPlayer, SHORT, RUNS };
})();
