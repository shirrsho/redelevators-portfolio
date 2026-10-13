/* ==========================================================================
   Red Elevators — Round 3 homepage engine (mockup).
   ========================================================================== */
(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const arrow = '<svg viewBox="0 0 16 11" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M0 5.5H14.6M10.3 1.2L14.9 5.5L10.3 9.8"/></svg>';

// ---- A / B headline ---------------------------------------------------------

$('#reassure').innerHTML = ['Live in 2–3 weeks', 'Works with your tools', 'We run it after launch'].map(t => `<span>${ico('check')}${t}</span>`).join('');
$('#sunIco').innerHTML = ico('sun');

// ---- Story copy (one line per step) -------------------------------------------
const PAINS = [
  ['Guests message at 2am.', 'And slow replies cost you ranking.'],
  ['The platforms take a cut.', 'Of every stay, and the guest relationship.'],
  ['Midweek nights sit empty.', 'Same price as Saturday. Nobody marketing them.'],
  ['Turnovers run on group chats.', 'Cleaners, codes and linen, all by hand.'],
];
const TURNS = [
  ['Every guest, answered in your voice.', 'In seconds, any hour, any language.', 'auto', 'AI Automation'],
  ['Guests book direct. No commission.', 'Past guests come back to your own site.', 'mkt', 'Marketing'],
  ['Prices move. Quiet nights fill.', 'Rates follow demand; campaigns target the gaps.', 'both', 'Automation + Marketing'],
  ['Turnovers schedule themselves.', 'Cleaner booked, code sent, calendars synced.', 'auto', 'AI Automation'],
];
$('#linesP').innerHTML = PAINS.map(p => `<div class="ln"><h2 class="d2">${p[0]}</h2><p>${p[1]}</p></div>`).join('');
$('#linesT').innerHTML = TURNS.map(t => `<div class="ln"><h2 class="d2">${t[0]}</h2><p>${t[1]}</p><span class="tag ${t[2] === 'both' ? '' : t[2]}">${t[3]}</span></div>`).join('');

// ---- Phone notifications ------------------------------------------------------------
const tile = (bg, inner) => `<div class="ic" style="background:${bg}">${inner}</div>`;
const N = [ // arrival order (oldest first)
  { tile: tile('#3a3a46', ico('calendar')), app: 'Calendar', tt: 'Tue–Thu still open', bd: '3 nights unbooked at Canal House this week.', ago: '1h ago', pain: 2, fix: 2, done: 'Rate adjusted, campaign live, 2 of 3 booked' },
  { tile: tile('#FF5A5F', logo('Airbnb', 20, true)), app: 'Airbnb', tt: 'Response rate', bd: '2 messages waiting. Reply within 24h to keep your rate.', ago: '40m ago', pain: 0, fix: 0, done: 'All messages answered' },
  { tile: tile('#003A9A', logo('Booking.com', 20, true)), app: 'Booking.com', tt: 'New reservation · 2 nights', bd: 'Harbor Studio, Oct 18–20. Commission applies.', ago: '31m ago', pain: 1, fix: 1, done: 'Returning guest re-booked direct' },
  { tile: tile('#25D366', logo('WhatsApp', 20, true)), app: 'WhatsApp', tt: 'Rosa (cleaning)', bd: 'Can’t get into Canal House. The code isn’t working.', ago: '14m ago', pain: 3, fix: 3, done: 'New code sent, clean set for 11:00' },
  { tile: tile('#FF5A5F', logo('Airbnb', 20, true)), app: 'Airbnb', tt: 'James · Garden Suite', bd: 'Any chance we can check in at 11 instead of 3?', ago: '6m ago', pain: 0, fix: 0, done: 'Offered 12:00, cleaner confirmed' },
  { tile: tile('#FF5A5F', logo('Airbnb', 20, true)), app: 'Airbnb', tt: 'Maria · Loft 2B', bd: 'Hi! We just arrived. What’s the wifi password? 🙂', ago: 'now', pain: 0, fix: 0, done: 'Sent wifi + house guide' },
];
const LIFT = [
  { n: 5, chip: '2 guests waiting', big: '2:14am', small: 'Reply late and your ranking slips.', hl: 'What’s the wifi password?' },
  { n: 2, chip: 'Commission on this stay', big: '~15%', small: 'Typical OTA commission, on every stay.', hl: 'Commission applies.' },
  { n: 0, chip: '3 nights empty this week', big: 'Tue–Thu', small: 'Priced like Saturday. Nobody marketing them.', hl: '3 nights unbooked' },
  { n: 3, chip: 'Turnover at risk', big: '11:00', small: 'Next guests arrive at 3pm.', hl: 'The code isn’t working.' },
];
LIFT.forEach(L => { N[L.n].hl = L.hl; });
const hlBd = n => n.hl ? n.bd.replace(n.hl, `<mark>${n.hl}</mark>`) : n.bd;
const markTile = `<div class="ic mark" style="background:#111">${MARK}</div>`;
const stack = $('#stack'), more = $('#more');
const cards = N.map(n => {
  const el = document.createElement('div'); el.className = 'n';
  el.innerHTML = `${n.tile}<div class="hd"><span>${n.app}</span><span>${n.ago}</span></div><div class="tt">${n.tt}</div><div class="bd">${hlBd(n)}</div>`;
  stack.insertBefore(el, more);
  return { n, el, isDone: false };
});
// the morning summary lives in the same stack
const summary = document.createElement('div'); summary.className = 'n';
summary.innerHTML = `${markTile}<div class="hd"><span>Red Elevators</span><span>7:30</span></div><div class="tt">Good morning. Nothing needs you.</div><div class="bd" style="-webkit-line-clamp:4">Overnight: 6 messages answered · 1 direct booking · 2 quiet nights filled · Canal House turnover sorted.</div>`;
summary.style.opacity = 0; stack.appendChild(summary);

function setDone(c, d) {
  if (c.isDone === d) return; c.isDone = d;
  c.el.classList.toggle('done', d);
  c.el.innerHTML = d
    ? `${markTile}<div class="hd"><span>✓ Handled for you</span><span>just now</span></div><div class="tt">${c.n.tt}</div><div class="bd">${c.n.done}</div>`
    : `${c.n.tile}<div class="hd"><span>${c.n.app}</span><span>${c.n.ago}</span></div><div class="tt">${c.n.tt}</div><div class="bd">${hlBd(c.n)}</div>`;
}

// ---- Laptop console ------------------------------------------------------------------
const TOOLS = ['Airbnb', 'Booking.com', 'Claude', 'Stripe', 'MailChimp', 'Meta', 'Google Ads', 'WhatsApp', 'Airtable'];
const VIEW_TOOLS = [['Airbnb', 'Claude'], ['Stripe', 'MailChimp', 'Booking.com'], ['Meta', 'Google Ads'], ['WhatsApp', 'Airtable'], TOOLS];
const NAV = [['message', 'Inbox'], ['direct', 'Bookings'], ['price', 'Pricing & ads'], ['clean', 'Turnovers'], ['sun', 'Summary']];
$('#conSide').innerHTML = NAV.map((n, i) => `<div class="nv" data-i="${i}">${ico(n[0])}${n[1]}</div>`).join('') +
  `<div class="lbl">CONNECTED</div>` + TOOLS.map(t => `<div class="tl" data-t="${t}">${logo(t, 12)}${t}<i></i></div>`).join('');
const chart = (() => {
  const a = [118, 118, 118, 118, 132, 132, 118, 118, 118, 118, 118, 132, 132, 118], b = [109, 112, 116, 121, 151, 158, 126, 104, 106, 111, 124, 154, 160, 128];
  const W = 420, H = 110, x = i => 10 + i * (W - 20) / 13, y = v => H - 10 - (v - 95) / 70 * (H - 20);
  const p = arr => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:110px"><path d="${p(a)}" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.5" stroke-dasharray="4 4"/>
    <path class="draw" d="${p(b)}" fill="none" stroke="#FF2D3B" stroke-width="2" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1) .3s"/>
    ${[7, 8, 9].map(i => `<rect x="${x(i) - 12}" y="4" width="24" height="${H - 8}" rx="4" fill="rgba(143,212,176,.08)"/>`).join('')}</svg>`;
})();
$('#conMain').innerHTML = `
  <div class="view" data-v="0">
    <h5>Inbox <span>3 conversations · all answered</span></h5>
    <div style="display:grid;grid-template-columns:150px minmax(0,1fr);gap:10px;height:330px">
      <div style="display:grid;gap:6px;align-content:start">
        ${[['Maria · Loft 2B', 'now'], ['James · Garden Suite', '6m'], ['Airbnb · rate', '40m']].map((c, i) => `<div class="card stg s${i + 1}" style="padding:8px"><div style="font-weight:600;font-size:11.5px">${c[0]}</div><div style="color:var(--green);font-size:10.5px;margin-top:2px">✓ answered · ${c[1]}</div></div>`).join('')}
      </div>
      <div class="card" style="display:flex;flex-direction:column;gap:8px">
        <div class="mono" style="font-size:10px">AIRBNB · MARIA · LOFT 2B</div>
        <div class="bub in stg s1">Hi! We just arrived. What’s the wifi password? 🙂</div>
        <div class="typing stg s2"><i></i><i></i><i></i></div>
        <div class="bub out stg s3">Welcome, Maria! Wifi is <b>LoftGuest</b> / sunny-balcony-42. Your house guide (parking, bins, best coffee) is here: re.guide/loft2b<small>Your assistant · in your tone</small></div>
        <div class="chip handled stg s4" style="align-self:flex-start;font-size:11px;padding:5px 9px;white-space:normal;border-radius:10px"><i></i>James: early check-in → 12:00 offered, cleaner confirmed</div>
      </div>
    </div>
  </div>
  <div class="view" data-v="1">
    <h5>Bookings <span>direct · this week</span></h5>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div class="card stg s1"><div class="mono" style="font-size:10px">RETURNING GUEST · EMAIL</div><div style="font-weight:600;margin:6px 0 4px">“Book direct next time, skip the fees”</div><div style="color:var(--sub)">Sent to 38 past guests of Harbor Studio</div></div>
      <div class="card stg s2"><div class="mono" style="font-size:10px">HARBOR STUDIO</div><div style="font-weight:600;margin:6px 0 4px">Oct 18–20 · 2 nights</div><div style="display:flex;justify-content:space-between;color:var(--sub)"><span>Total</span><span style="color:var(--ink)">$340</span></div></div>
      <div class="card stg s3" style="grid-column:1/3;display:flex;align-items:center;gap:10px">${logo('Stripe', 18)}<div><div style="font-weight:600">Paid · booked direct</div><div style="color:var(--sub);font-size:11px">Calendars blocked on Airbnb and Booking.com</div></div><span class="chip handled" style="margin-left:auto;font-size:11px;padding:4px 9px"><i></i>Confirmed</span></div>
      <div class="card stg s4" style="grid-column:1/3;display:flex;justify-content:space-between;align-items:center"><span style="color:var(--sub)">Platform commission on this stay</span><span style="font-family:var(--display);font-size:28px">$0</span></div>
    </div>
  </div>
  <div class="view" data-v="2">
    <h5>Pricing &amp; ads <span>Canal House · next 14 nights</span></h5>
    <div class="card stg s1">${chart}<div style="display:flex;gap:14px;font-size:10.5px;color:var(--sub);margin-top:4px"><span>- - before</span><span style="color:#ff6b74">— adjusted to demand</span><span style="color:var(--green)">▮ Tue–Thu campaign</span></div></div>
    <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:10px;margin-top:10px">
      <div class="card stg s2" style="display:flex;gap:10px;align-items:center">${logo('Meta', 20)}<div><div style="font-weight:600">Midweek escape · Tue–Thu</div><div style="color:var(--sub);font-size:11px">Instagram + Facebook · $12/day</div></div><span class="chip handled" style="margin-left:auto;font-size:11px;padding:4px 9px"><i></i>Live</span></div>
      <div class="card stg s3"><div class="mono" style="font-size:10px">GAP NIGHTS</div><div style="display:flex;gap:6px;margin-top:6px">${['Tue ✓', 'Wed ✓', 'Thu …'].map((d, i) => `<span class="tag" style="${i < 2 ? 'color:var(--green);border-color:rgba(143,212,176,.35)' : ''}">${d}</span>`).join('')}</div></div>
    </div>
  </div>
  <div class="view" data-v="3">
    <h5>Turnovers <span>today · Canal House</span></h5>
    <div style="display:grid;gap:8px">
      ${[['10:00', 'Guest checks out', 'Checkout reminder sent at 8:00', 'guest'], ['11:00', 'Rosa cleans', 'Booked automatically · linen ordered', 'clean'], ['11:02', 'New door code 4821', 'Sent to Rosa and tonight’s guest on WhatsApp', 'key'], ['14:00', 'Ready for 3pm arrival', 'Photos checked · calendar updated', 'check']].map((r, i) =>
        `<div class="card stg s${i + 1}" style="display:grid;grid-template-columns:44px 26px 1fr auto;gap:10px;align-items:center"><span class="mono">${r[0]}</span><span style="color:var(--green)">${ico(r[3])}</span><div><div style="font-weight:600">${r[1]}</div><div style="color:var(--sub);font-size:11px">${r[2]}</div></div><span style="color:var(--green)">✓</span></div>`).join('')}
    </div>
  </div>
  <div class="view" data-v="4">
    <h5>Overnight summary <span>02:14 → 07:30</span></h5>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${[['6', 'guest messages answered'], ['1', 'booking moved direct'], ['2', 'quiet nights filled'], ['1', 'turnover sorted']].map(r => `<div class="card"><div style="font-family:var(--display);font-size:30px">${r[0]}</div><div style="color:var(--sub)">${r[1]}</div></div>`).join('')}
      <div class="card" style="grid-column:1/3;color:var(--green)">✓ Nothing needs the owner today</div>
    </div>
  </div>`;
const views = $$('#conMain .view'), navEls = $$('#conSide .nv'), toolEls = $$('#conSide .tl');

// ---- Rail ----------------------------------------------------------------------
const SEG = [[0, .12], [.12, .44], [.44, .88], [.88, 1]];
$('#rail').innerHTML = ['The night', 'Sound familiar?', 'The turn', 'Morning'].map((t, i) => `<button data-jump="${i}"><i></i>${t}</button>`).join('');
const railBtns = $$('#rail button');
const story = $('#story'), span = () => story.offsetHeight - innerHeight;
document.addEventListener('click', e => {
  const j = e.target.closest('[data-jump]'); if (!j) return; e.preventDefault();
  const i = +j.dataset.jump; scrollTo({ top: story.offsetTop + (SEG[i][0] + (i ? .015 : 0)) * span(), behavior: 'smooth' });
});

// ---- Stage layout per chapter --------------------------------------------------------
const phoneRig = $('#phoneRig'), laptopRig = $('#laptopRig'), phone = $('#phone'), lift = $('#lift');
const scrim = $('#scrim'), retn = $('#retn');
const beam = $('#beam'), beamFill = $('#beamFill'), beamEdge = $('#beamEdge'), beamTag = $('#beamTag');
let flip = false, copyRight = 0;
addEventListener('resize', () => { lastKey = ''; });
const wire = $('#wire'), wirePath = $('#wirePath'), wireDot = $('#wireDot'), sent = $('#sent');
function place(el, o) {
  el.style.setProperty('--x', o.x); el.style.setProperty('--y', o.y); el.style.setProperty('--s', o.s.toFixed(3)); el.style.setProperty('--o', o.o ?? 1);
  const c = el.firstElementChild.style; c.setProperty('--rx', (o.rx ?? 4) + 'deg'); c.setProperty('--ry', (o.ry ?? -12) + 'deg'); c.setProperty('--rz', (o.rz ?? 0) + 'deg');
}
let mx = 0, my = 0, mxs = 0, mys = 0;
addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });

const X = f => `calc(var(--edge) + min(100%, var(--max)) * ${f})`; // a point inside the nav-width column
function layout(s) {
  const col = Math.min(document.documentElement.clientWidth, 1240);
  const pf = Math.min(1.05, innerHeight * .78 / 620), lf = Math.min(col * .5 / 760, innerHeight * .6 / 500);
  const tx = mxs * 8, ty = mys * 6;
  const P = [
    { x: X(.74), y: '53%', s: pf, ry: -14 + tx, rx: 5 - ty, rz: 1.2 },
    { x: X(.75), y: '53%', s: pf, ry: -8 + tx, rx: 3 - ty },
    { x: X(.5), y: '66%', s: pf * .62, ry: 12 + tx, rx: 3 - ty, rz: -2 },
    { x: X(.66), y: '53%', s: pf, ry: -6 + tx, rx: 2 - ty },
  ][s.ch];
  const L = [
    { x: X(1.18), y: '48%', s: lf, o: 0, ry: -24 },
    { x: X(1.18), y: '48%', s: lf, o: 0, ry: -24 },
    { x: X(.69), y: '44%', s: lf, ry: -10 + tx * .6, rx: 4 - ty * .6 },
    { x: X(.79), y: '42%', s: lf * .82, o: .45, ry: -16, rx: 4 },
  ][s.ch];
  place(phoneRig, P); place(laptopRig, L);
  // the pulled card sits a fixed gap left of the phone, but never over the chapter headline
  // measured: right edge of the chapter text on screen → room left before the phone
  const vw = document.documentElement.clientWidth, edge = Math.max(0, (vw - col) / 2);
  const phoneLeft = edge + col * .75 - 150 * pf, textRight = copyRight || edge + 64 + 330;
  const room = phoneLeft - 44 - (textRight + 32), k = Math.max(.8, Math.min(1, room / 330));
  lift.style.setProperty('--lk', k.toFixed(3));
  lift.style.setProperty('--lx', `${Math.max(phoneLeft - 44 - 165 * k, textRight + 32 + 165 * k)}px`);
}

// ---- Background colour follows the time of day ------------------------------------------
const NIGHT = [10, 11, 20], DAWN = [26, 20, 15], DAY = [20, 19, 18];
function paintBg(sp) {
  const y = scrollY, H = innerHeight;
  const turnStart = story.offsetTop + .5 * span(), storyEnd = story.offsetTop + span();
  const flowTop = $('#journey-sec').offsetTop, calmTop = $('#calm').offsetTop;
  let c;
  if (y < turnStart) c = NIGHT;
  else if (y < storyEnd) c = mix(NIGHT, DAWN, clamp((y - turnStart) / (storyEnd - turnStart)));
  else if (y < flowTop + H) c = mix(DAWN, DAY, clamp((y - storyEnd) / (flowTop + H - storyEnd)));
  else if (y < calmTop - H * .9) c = DAY;
  else c = mix(DAY, NIGHT, clamp((y - (calmTop - H * .9)) / (H * .7)));
  document.documentElement.style.setProperty('--bg', `rgb(${c})`);
}

// ---- Story frame ----------------------------------------------------------------------
let p = 0, ps = 0, arrived = 0, lastKey = '';
const t0 = performance.now();
const measure = () => { p = clamp(-story.getBoundingClientRect().top / span()); };
addEventListener('scroll', measure, { passive: true }); measure(); ps = p;
function stateOf(v) {
  let ch = 3; for (let i = 0; i < 4; i++) if (v < SEG[i][1]) { ch = i; break; }
  const [a, b] = SEG[ch], chP = (v - a) / (b - a);
  let step = 0, local = chP;
  if (ch === 1 || ch === 2) { const f = chP * 4; step = Math.min(3, Math.floor(f)); local = f - step; }
  return { ch, step, local, chP };
}
const fmt = m => `${Math.floor(m / 60)}:${String(Math.floor(m % 60)).padStart(2, '0')}`;
const GAP = 86; let VIS = 3;
const chs = $$('.ch'), linesP = $$('#linesP .ln'), linesT = $$('#linesT .ln'), dotsP = $$('#dotsP i'), dotsT = $$('#dotsT i');
const tmpA = { x: 0, y: 0 };

function step() {
  VIS = innerWidth <= 760 ? 2 : 3;
  ps += (p - ps) * .12; mxs += (mx - mxs) * .06; mys += (my - mys) * .06;
  const s = stateOf(ps), t = (performance.now() - t0) / 1000;
  const key = `${s.ch}:${s.step}`;
  if (key !== lastKey) {
    lastKey = key;
    chs.forEach((c, i) => { c.classList.toggle('on', i === s.ch); c.classList.toggle('gone', i < s.ch); });
    linesP.forEach((l, i) => l.classList.toggle('on', s.ch === 1 && i === s.step));
    if (s.ch === 1) { // where the visible chapter text ends, so the card never sits on it
      copyRight = 0;
      linesP[s.step].querySelectorAll('h2,p').forEach(e => { const rg = document.createRange(); rg.selectNodeContents(e); for (const r of rg.getClientRects()) copyRight = Math.max(copyRight, r.right); });
    }
    linesT.forEach((l, i) => l.classList.toggle('on', s.ch === 2 && i === s.step));
    dotsP.forEach((d, i) => { d.classList.toggle('on', s.ch === 1 && i === s.step); d.classList.toggle('done', s.ch > 1 || (s.ch === 1 && i < s.step)); });
    dotsT.forEach((d, i) => { d.classList.toggle('on', s.ch === 2 && i === s.step); d.classList.toggle('done', s.ch > 2 || (s.ch === 2 && i < s.step)); });
    $('#kickP').textContent = `Sound familiar? · 0${s.ch === 1 ? s.step + 1 : 1}/04`;
    $('#kickT').textContent = `Then it runs itself · 0${s.ch === 2 ? s.step + 1 : 1}/04`;
    railBtns.forEach((b, i) => b.classList.toggle('on', i === s.ch));
    const v = s.ch === 2 ? s.step : s.ch === 3 ? 4 : -1;
    views.forEach((el, i) => el.classList.toggle('on', i === v));
    if (v >= 0) { const d = views[v].querySelector('.draw'); if (d) d.style.strokeDashoffset = 0; }
    navEls.forEach((el, i) => el.classList.toggle('on', i === v));
    toolEls.forEach(el => el.classList.toggle('live', v >= 0 && VIEW_TOOLS[v].includes(el.dataset.t)));
    // lifted card
    if (s.ch === 1) {
      const L = LIFT[s.step], n = N[L.n];
      lift.classList.remove('scan');
      lift.innerHTML = `<div class="chip problem"><i></i>${L.chip}</div><div class="n">${n.tile}<div class="hd"><span>${n.app}</span><span>${n.ago}</span></div><div class="tt">${n.tt}</div><div class="bd">${n.bd.replace(L.hl, `<mark>${L.hl}</mark>`)}</div></div><div class="big">${L.big}<small>${L.small}</small></div>`;
      flip = true;
    }
    lift.classList.toggle('on', s.ch === 1);
    if (s.ch === 2) {
      const c = cards.filter(k => k.n.fix === s.step).pop();
      retn.innerHTML = c ? `<div class="n">${markTile}<div class="hd"><span>✓ Handled for you</span><span>just now</span></div><div class="tt">${c.n.tt}</div><div class="bd">${c.n.done}</div></div>` : '';
    }
    phone.classList.toggle('focus', s.ch === 1);
  }
  railBtns.forEach((b, i) => b.querySelector('i').style.setProperty('--f', clamp((ps - SEG[i][0]) / (SEG[i][1] - SEG[i][0])).toFixed(3)));
  layout(s);

  // notifications arrive in the hero
  const target = s.ch === 0 ? Math.min(N.length, Math.floor(Math.max(0, t - .6) / 1.1) + 1) : N.length;
  if (target > arrived) { arrived = target; phone.classList.remove('buzz'); void phone.offsetWidth; phone.classList.add('buzz'); }
  const live = [];
  cards.forEach((c, i) => {
    let st = i < arrived ? 'open' : 'hidden';
    if (st === 'open' && s.ch === 2) {
      if (s.step > c.n.fix) st = 'gone';
      else if (s.step === c.n.fix) { // the card the solution flies into lands first; the rest follow a beat apart
        const grp = cards.filter(k => k.n.fix === c.n.fix), ord = grp.length - 1 - grp.indexOf(c);
        if (s.local > .55 + ord * .12) st = 'done';
      }
    }
    if (s.ch === 3) st = 'gone';
    c.st = st; setDone(c, st === 'done');
    if (st === 'open' || st === 'done') live.push(c);
  });
  live.reverse();
  const focusOf = c => (s.ch === 1 && c.n.pain === s.step) || (s.ch === 2 && c.n.fix === s.step);
  live.sort((a, b) => focusOf(b) - focusOf(a));
  cards.forEach(c => {
    const el = c.el, idx = live.indexOf(c);
    if (c.st === 'hidden') { el.style.opacity = 0; el.style.transform = 'translateY(-30px) scale(.96)'; return; }
    if (c.st === 'gone') { el.style.opacity = 0; el.style.transform = 'translateY(-70px) scale(.9)'; el.classList.remove('focus', 'dim'); return; }
    if (idx < VIS) { el.style.opacity = 1; el.style.transform = `translateY(${idx * GAP}px)`; el.style.zIndex = 20 - idx; }
    else { const k = idx - VIS; el.style.opacity = k < 2 ? .45 - k * .2 : 0; el.style.transform = `translateY(${(VIS - 1) * GAP + 14 + k * 9}px) scale(${.94 - k * .04})`; el.style.zIndex = 5 - k; }
    const f = focusOf(c);
    el.classList.toggle('lifted', s.ch === 1 && f && idx === 0);
    el.classList.toggle('dim', (s.ch === 1 || s.ch === 2) && !f);
  });
  // pulled from the phone: the card flies out of its slot (FLIP), then a beam links slot → card
  const ghost = cards.find(c => c.el.classList.contains('lifted'));
  const wide = innerWidth > 760, liftN = lift.querySelector('.n');
  if (flip && ghost && liftN && wide) {
    flip = false;
    const sr = stack.getBoundingClientRect(), g = { left: sr.left, top: sr.top, width: sr.width }, r = liftN.getBoundingClientRect();
    liftN.style.transition = 'none';
    liftN.style.transform = `translate(${g.left - r.left}px, ${g.top - r.top}px) scale(${g.width / r.width})`;
    liftN.getBoundingClientRect();
    requestAnimationFrame(() => { liftN.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1)'; liftN.style.transform = 'none'; lift.classList.add('scan'); });
  } else if (flip && !wide) { flip = false; lift.classList.add('scan'); }
  const beamOn = s.ch === 1 && !!ghost && !!liftN && wide;
  beam.classList.toggle('on', beamOn); beamTag.classList.toggle('on', beamOn); scrim.classList.toggle('on', beamOn);
  if (beamOn) { // spotlight: everything dims except the slot the card came from
    const b = ghost.el.getBoundingClientRect(), o = scrim.getBoundingClientRect(), p = 6, r = 24;
    const x = b.left - o.left - p, y = b.top - o.top - p, w = b.width + 2 * p, hh = b.height + 2 * p;
    scrim.style.clipPath = `path(evenodd, 'M0 0H${o.width}V${o.height}H0Z M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + hh - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + hh}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + hh - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z')`;
  }
  // reverse move: the solved card flies from the laptop back into its slot on the phone
  const back = s.ch === 2 && wide ? cards.filter(k => k.n.fix === s.step).pop() : null;
  const tf = back ? clamp((s.local - .22) / .33) : 0;
  if (back && s.local > .18 && s.local < .6 && retn.firstElementChild) {
    const lr = laptopRig.getBoundingClientRect(), b = back.el.getBoundingClientRect(), o = retn.parentElement.getBoundingClientRect();
    const ax = lr.left + lr.width * .55 - o.left, ay = lr.top + lr.height * .38 - o.top, bx = b.left + b.width / 2 - o.left, by = b.top + b.height / 2 - o.top;
    const e = tf < .5 ? 2 * tf * tf : 1 - Math.pow(-2 * tf + 2, 2) / 2, cx = (ax + bx) / 2, cy = Math.min(ay, by) - 160;
    const qx = (1 - e) * (1 - e) * ax + 2 * (1 - e) * e * cx + e * e * bx, qy = (1 - e) * (1 - e) * ay + 2 * (1 - e) * e * cy + e * e * by;
    const sc = 1 + (b.width / 300 - 1) * e;
    retn.style.transform = `translate(${qx - 150}px, ${qy - retn.offsetHeight / 2}px) scale(${sc})`;
    retn.style.opacity = s.local < .24 ? (s.local - .18) / .06 : s.local > .55 ? Math.max(0, 1 - (s.local - .55) / .05) : 1;
  } else retn.style.opacity = 0;
  if (beamOn) {
    const a = liftN.getBoundingClientRect(), b = ghost.el.getBoundingClientRect(), o = beam.getBoundingClientRect();
    const ax = a.right - o.left, at = a.top - o.top + 10, ab = a.bottom - o.top - 10, bx = b.left - o.left, bt = b.top - o.top, bb = b.bottom - o.top;
    beamFill.setAttribute('d', `M${ax} ${at} L${bx} ${bt} L${bx} ${bb} L${ax} ${ab} Z`);
    beamEdge.setAttribute('d', `M${ax} ${at} L${bx} ${bt} M${ax} ${ab} L${bx} ${bb}`);
    beamTag.style.left = `${b.left - o.left + b.width / 2}px`; beamTag.style.top = `${bt - 10}px`;
  }
  const hidden = Math.max(0, live.length - VIS);
  more.textContent = hidden ? `${hidden} more` : ''; more.style.top = `${Math.min(live.length, VIS) * GAP + (hidden ? 26 : 0)}px`;
  summary.style.opacity = s.ch === 3 ? 1 : 0; summary.style.transform = s.ch === 3 ? 'none' : 'translateY(20px)';

  // time of day
  const m = s.ch === 3 ? 1 : s.ch === 2 ? clamp((s.chP - .5) * 2) : 0;
  const mins = s.ch === 0 ? 134 : s.ch === 1 ? 134 + s.chP * 17 : s.ch === 2 ? 151 + s.chP * 299 : 450;
  $('#ptime').textContent = fmt(mins); $('#stime').textContent = fmt(mins);
  phone.classList.toggle('day', s.ch === 3);
  $('#aSun').style.opacity = m; $('#aMoon').style.opacity = 1 - m; $('#aLamp').style.opacity = 1 - m;

  // cause → effect: a pulse travels from the laptop to the phone
  const wiring = s.ch === 2 && s.local > .22 && s.local < .75;
  wire.classList.toggle('on', wiring); sent.classList.toggle('on', s.ch === 2 && s.local > .5 && s.local < .8);
  if (s.ch === 2 && innerWidth > 760) {
    const lr = laptopRig.getBoundingClientRect(), pr = phoneRig.getBoundingClientRect();
    const ax = lr.left + lr.width * .62, ay = lr.top + lr.height * .42, bx = pr.left + pr.width * .62, by = pr.top + pr.height * .4;
    wirePath.setAttribute('d', `M${ax} ${ay} C ${ax} ${ay - 140}, ${bx + 40} ${by - 160}, ${bx} ${by}`);
    const len = wirePath.getTotalLength(), q = wirePath.getPointAtLength(len * clamp((s.local - .22) / .33));
    wireDot.setAttribute('cx', q.x); wireDot.setAttribute('cy', q.y); wireDot.style.opacity = 0;
    sent.style.left = `${bx + 10}px`; sent.style.top = `${by - 150}px`;
  }

  $('#nav').classList.toggle('scrolled', scrollY > 10);
  paintBg(ps);
}
function frame() { step(); requestAnimationFrame(frame); }

// ---- Chapter 5: services ----------------------------------------------------------------
const VIZ = {
  chat: `<div class="m-chat"><div class="bub in">Late check-in ok?</div><div class="bub out">Of course! Code is 4821.</div><div class="bub in">Perfect, thank you 🙏</div></div>`,
  spark: `<div class="m-chat" style="width:76%"><div class="bub in">Can I bring my dog? 🐶</div><div style="display:flex;align-items:center;gap:8px;justify-content:flex-end"><span class="m-spark" style="width:18px;height:18px">${ico('assistant')}</span><div class="bub out" style="animation-delay:1.4s">Yes! Small dogs are welcome. Here's the pet guide.</div></div></div>`,
  cal: `<div class="m-cal">${Array.from({ length: 21 }, (_, i) => `<i style="animation-delay:${(i * 137 % 21) * .12}s"></i>`).join('')}</div>`,
  doc: `<div class="m-doc"><i></i><i></i><i></i><i></i><span class="chip handled"><i></i>Published</span></div>`,
  ad: `<div class="m-ad"><div class="img"></div><div class="cta">Book now</div></div>`,
  frames: `<div class="m-frames"><i></i><i></i><i></i></div>`,
  web: `<div class="m-web"><span class="h"></span><span class="s"></span><span class="b"></span><svg class="cur" viewBox="0 0 10 14"><path d="M0 0v12l3-3 2 5 2-1-2-5h4z" fill="#fff"/></svg></div>`,
  fun: `<div class="m-fun"><i></i><i></i><i></i><i></i></div>`,
};
const SVC = [
  ['auto', 'message', 'chat', 'Guest Messaging & CRM', 'Every message answered, every guest remembered.'],
  ['auto', 'assistant', 'spark', 'AI Guest Assistant', 'Trained on your house rules. Replies around the clock.'],
  ['auto', 'direct', 'cal', 'Direct Booking Engine', 'Brings past guests back to book direct.'],
  ['auto', 'content', 'doc', 'Listing & Content Engine', 'Fresh listings and guides, published on schedule.'],
  ['mkt', 'social', 'ad', 'Paid Social for Bookings', 'Ads that follow your empty nights.'],
  ['mkt', 'camera', 'frames', 'Listing Photo & Ad Creative', 'One shoot, every format, one approval.'],
  ['mkt', 'website', 'web', 'Direct Booking Website', 'Your own site, synced with your calendar.'],
  ['mkt', 'funnel', 'fun', 'Full-Funnel Booking Campaigns', 'From first look to confirmed stay.'],
];
$('#grid8').innerHTML = SVC.map((s, i) => `<a class="svc rv d${(i % 4) + 1}x" href="/services/${SITE.SERVICES[i].slug}/" data-p="${s[0]}">
  <div class="viz"><div class="mv">${VIZ[s[2]]}</div></div>
  <div class="body"><div class="row"><div class="ico-tile" style="width:38px;height:38px">${ico(s[1])}</div><span class="tag ${s[0]}">${s[0] === 'auto' ? 'AI Automation' : 'Marketing'}</span></div>
  <h4>${s[3]}</h4><p>${s[4]}</p></div><span class="go">${ico('arrow')}</span></a>`).join('');
$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#tabs button').forEach(x => x.classList.toggle('on', x === b));
  $$('.svc').forEach(c => c.classList.toggle('off', b.dataset.f !== 'all' && c.dataset.p !== b.dataset.f));
});

// ---- 08 · Your tools + our promises: the orbit returns -------------------------------------------
const R1 = ['Airbnb', 'Booking.com', 'WhatsApp', 'Stripe', 'Meta', 'Google Ads'];
const R2 = ['Claude', 'n8n', 'Make', 'Zapier', 'HubSpot', 'MailChimp', 'Airtable', 'Notion', 'Google Sheets', 'Webflow'];
const ring = (list, r, cls, dur) => `<div class="ring ${cls}" style="width:calc(${r * 2}px * var(--k));height:calc(${r * 2}px * var(--k));--dur:${dur}s">${list.map((l, i) =>
  `<div class="lg" style="--a:${(360 / list.length) * i}deg;--r:calc(${r}px * var(--k))" title="${l}"><span>${logo(l, 24)}</span></div>`).join('')}</div>`;
$('#orbit').innerHTML = ring(R2, 222, 'r2', 90) + ring(R1, 136, 'r1', 60) + `<div class="core">${MARK_FULL}</div>`;
$('#points').innerHTML = [['lock', 'Built in your accounts. You own it.', 'Every workflow, login and line of data stays yours. Leave anytime, keep it all.'],
  ['bolt', 'Nothing new to learn', 'Your team keeps the tools they already know.'],
  ['calendar', 'Live in 2–3 weeks', 'From first call to a running system.'],
  ['run', 'We run it after launch', 'Monitoring, fixes and a monthly summary. Swap a tool anytime.']]
  .map(p => `<div><div class="ico-tile">${ico(p[0])}</div><div><h5>${p[1]}</h5><p>${p[2]}</p></div></div>`).join('');
$('#also').innerHTML = ['Guesty', 'Hostaway', 'PriceLabs', 'Google Calendar', '+ your PMS'].map(t => `<span class="logo-pill">${t}</span>`).join('');

// ---- Chapter 7: how we work ----------------------------------------------------------------
$('#time').innerHTML += [['audit', 'Days 1–3', 'Audit', 'We map your setup and find what to automate first.', 'You: one 30-min call'],
  ['design', 'Week 1', 'Design', 'A plan in plain language. You approve it.', 'You: approve the plan'],
  ['build', 'Weeks 2–3', 'Build', 'We build it inside your accounts and test it end to end.', 'You: nothing'],
  ['run', 'Ongoing', 'Run', 'We watch it, fix it and improve it. You get a monthly summary.', 'You: read the summary']]
  .map((w, i) => `<div class="wk rv d${i + 1}x" data-phase="${['audit', 'design', 'build', 'live'][i]}"><div class="ico-tile">${ico(w[0])}</div><span class="mono">${w[1]}</span><h4>${w[2]}</h4><p>${w[3]}</p><span class="chip"><i></i>${w[4]}</span></div>`).join('');

SITE.mountCal3($('#homeCal'), { link: $('#time'), legend: true });
SITE.mountJourney($('#journey'), { pin: $('#journey-sec') });
SITE.mountCalc($('#calcBox'));
SITE.mountPricing($('#homeTiers'), true);

// ---- Final chapter: a calm phone that stays alive, follows the booking, nudges to WhatsApp ----
const calm = SITE.mountCalmPhone($('#calmHold'), { nudge: 'contact' });
SITE.mountScheduler($('#sched'), (d, t) => calm.booked(d, t), (step, d, t) => step === 'day' ? calm.day(d) : step === 'time' ? calm.time(d, t) : null);
$('#homeCur').insertAdjacentHTML('afterbegin', SITE.curToggle());

// ---- Reveal on scroll ----------------------------------------------------------------------
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18 });
$$('.rv, .weeks').forEach(el => io.observe(el));

window.Home = { step: (n = 1) => { for (let i = 0; i < n; i++) step(); }, go: v => { scrollTo(0, story.offsetTop + v * span()); measure(); ps = p; lastKey = ''; step(); } };
requestAnimationFrame(frame);
})();
