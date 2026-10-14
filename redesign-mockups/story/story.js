/* ==========================================================================
   Red Elevators — story engine + chapter copy, shared by every scene.

   The page is one long sticky stage. Scroll progress p (0..1) is split into
   four chapters:
     0  The night        hero           0.00 – 0.14
     1  Sound familiar?  4 pain steps   0.14 – 0.52
     2  The turn         4 fix steps    0.52 – 0.90
     3  What's next      end card       0.90 – 1.00
   Each scene subscribes with Story.on(fn) and gets
   { p, ch, step, local, chP, t } every frame.

   A page sets window.STORY = { headlineB, subB } before loading this file
   to give its own pain-led (B) headline.
   ========================================================================== */
(() => {
  const page = window.STORY || {};
  const arrow = '<svg viewBox="0 0 16 11" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M0 5.5H14.6M10.3 1.2L14.9 5.5L10.3 9.8"/></svg>';

  const COPY = {
    hero: {
      eyebrow: 'For short-term rental hosts &amp; property managers',
      a: 'Your rentals,<br>running on <em>autopilot.</em>',
      subA: 'We build and run the automation and marketing behind short-term rentals. Guests get answered, nights get booked, turnovers run themselves. You get your evenings back.',
      b: page.headlineB || 'Still answering<br>guests at <em>2am?</em>',
      subB: page.subB || 'There’s a calmer way to run rentals. We build and run the systems that answer guests, fill the calendar and handle turnovers, so you don’t have to.',
    },
    pains: [
      ['Messages at every hour.', 'Check-in questions, wifi passwords, late arrivals. Guests don’t keep office hours, and slow replies cost you ranking.'],
      ['A cut of every booking.', 'The platforms take their share of each stay, and they keep the guest relationship too.'],
      ['Quiet nights mid-week.', 'Prices set once and rarely touched. Gaps in the calendar that nobody is marketing to.'],
      ['Turnovers run on group chats.', 'Cleaners, door codes, linen and late checkouts, all coordinated by hand.'],
    ],
    turns: [
      ['Guests answered in your voice', 'Automation', 'An assistant trained on your house rules replies in seconds, any hour, any language. The tricky ones come to you.'],
      ['Direct bookings you own', 'Marketing', 'Your own booking site and campaigns that bring guests back direct. No commission, and the guest stays yours.'],
      ['Prices and promotion that adapt', 'Both', 'Rates follow season, events and pace, and the quiet nights get their own targeted campaigns.'],
      ['Turnovers that schedule themselves', 'Automation', 'Each booking books the cleaner, sends the door code and updates every calendar. You get the summary.'],
    ],
  };

  // ---- Build the copy column ------------------------------------------------
  const copy = document.getElementById('copy');
  copy.innerHTML = `
    <div class="chap hero" data-ch="0">
      <div class="eyebrow"><i></i>${COPY.hero.eyebrow}</div>
      <h1><span class="va">${COPY.hero.a}</span><span class="vb">${COPY.hero.b}</span></h1>
      <p class="lead"><span class="va">${COPY.hero.subA}</span><span class="vb">${COPY.hero.subB}</span></p>
      <div class="ctas">
        <a class="btn primary" href="#">Book a free 30-min call ${arrow}</a>
        <a class="btn quiet" href="#" data-jump="1">See how it works</a>
      </div>
      <div class="reassure"><span>Live in 2–3 weeks</span><span>Works with Airbnb, Booking.com &amp; your PMS</span><span>We run it after launch</span></div>
    </div>
    <div class="chap" data-ch="1">
      <div class="kicker">Sound familiar?</div>
      <h2>Running rentals is a night shift.</h2>
      <ol class="steps pain">${COPY.pains.map((x, i) => `<li data-i="${i}"><b>0${i + 1}</b><div><h3>${x[0]}</h3></div><p>${x[1]}</p></li>`).join('')}</ol>
    </div>
    <div class="chap" data-ch="2">
      <div class="kicker">Then it starts running itself</div>
      <h2>One system, built around how you already work.</h2>
      <p class="note">Two units or two hundred, it’s the same system.</p>
      <ol class="steps turn">${COPY.turns.map((x, i) => `<li data-i="${i}"><b>0${i + 1}</b><div><h3>${x[0]}<small>${x[1]}</small></h3></div><p>${x[2]}</p></li>`).join('')}</ol>
    </div>
    <div class="chap" data-ch="3">
      <div class="kicker">That’s chapter one</div>
      <h2>Next: follow one booking through the whole system.</h2>
      <p class="lead">From the first message to the five-star review, here’s exactly what we build, and what you’ll never have to do by hand again.</p>
      <div class="ctas">
        <a class="btn primary" href="#">Book a free 30-min call ${arrow}</a>
        <a class="btn quiet" href="#after">Keep reading</a>
      </div>
    </div>`;

  const RAIL = ['The night', 'Sound familiar?', 'The turn', 'What’s next'];
  const SEG = [[0, .14], [.14, .52], [.52, .9], [.9, 1]];
  const stage = document.querySelector('.stage');
  const rail = document.createElement('div'); rail.className = 'rail';
  rail.innerHTML = RAIL.map((t, i) => `<button data-jump="${i}"><i></i>${t}</button>`).join('');
  stage.appendChild(rail);
  const cue = document.createElement('div'); cue.className = 'cue'; cue.innerHTML = '<b></b>Scroll to see the night change';
  stage.appendChild(cue);

  // ---- A / B headline control (mockup only) ----------------------------------
  const ab = document.createElement('div'); ab.className = 'ab';
  ab.innerHTML = '<span>HEADLINE</span><button data-h="a">A · Outcome</button><button data-h="b">B · Pain</button>';
  document.body.appendChild(ab);
  let h = new URLSearchParams(location.search).get('h');
  try { h = h || localStorage.getItem('re-headline'); } catch (e) {}
  const setH = v => {
    document.body.dataset.h = v;
    ab.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.h === v));
    try { localStorage.setItem('re-headline', v); } catch (e) {}
  };
  setH(h === 'b' ? 'b' : 'a');
  ab.addEventListener('click', e => { const b = e.target.closest('button'); if (b) setH(b.dataset.h); });

  // ---- Scroll → state ----------------------------------------------------------
  const story = document.getElementById('story');
  const nav = document.querySelector('.nav');
  const span = () => story.offsetHeight - innerHeight;
  document.addEventListener('click', e => {
    const j = e.target.closest('[data-jump]'); if (!j) return;
    e.preventDefault();
    const i = +j.dataset.jump;
    scrollTo({ top: story.offsetTop + (SEG[i][0] + (i ? .02 : 0)) * span(), behavior: 'smooth' });
  });

  let p = 0, ps = 0;
  const measure = () => { p = Math.min(1, Math.max(0, -story.getBoundingClientRect().top / span())); };
  addEventListener('scroll', measure, { passive: true }); measure(); ps = p;

  function stateOf(v) {
    let ch = 3; for (let i = 0; i < 4; i++) if (v < SEG[i][1]) { ch = i; break; }
    const [a, b] = SEG[ch], chP = (v - a) / (b - a);
    let step = 0, local = chP;
    if (ch === 1 || ch === 2) { const f = chP * 4; step = Math.min(3, Math.floor(f)); local = f - step; }
    return { p: v, ch, step, local, chP };
  }

  const chaps = [...copy.querySelectorAll('.chap')];
  const lists = { 1: [...copy.querySelectorAll('.pain li')], 2: [...copy.querySelectorAll('.turn li')] };
  const railBtns = [...rail.querySelectorAll('button')];
  const subs = [];
  let last = '';
  const t0 = performance.now();

  function update() {
    ps += (p - ps) * .12;
    const s = stateOf(ps); s.t = (performance.now() - t0) / 1000; s.raw = p;
    const key = s.ch + ':' + s.step;
    if (key !== last) {
      last = key;
      chaps.forEach((c, i) => { c.classList.toggle('on', i === s.ch); c.classList.toggle('gone', i < s.ch); });
      [1, 2].forEach(c => lists[c].forEach((li, i) => {
        li.classList.toggle('on', s.ch === c && i === s.step);
        li.classList.toggle('done', s.ch > c || (s.ch === c && i < s.step));
      }));
      railBtns.forEach((b, i) => b.classList.toggle('on', i === s.ch));
    }
    railBtns.forEach((b, i) => b.querySelector('i').style.setProperty('--f', Math.min(1, Math.max(0, (ps - SEG[i][0]) / (SEG[i][1] - SEG[i][0]))).toFixed(3)));
    cue.style.opacity = s.ch === 0 ? 1 - s.chP * 2 : 0;
    nav.classList.toggle('scrolled', scrollY > 10);
    subs.forEach(fn => fn(s));
    return s;
  }
  function frame() { update(); requestAnimationFrame(frame); }

  window.Story = {
    on: fn => subs.push(fn),
    // manual stepping for headless checks
    tick: (n = 1) => { let s; for (let i = 0; i < n; i++) s = update(); return s; },
    measure,
  };
  requestAnimationFrame(frame);
})();
