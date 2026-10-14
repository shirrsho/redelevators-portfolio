/* Colour-direction switcher + site-wide micro-interactions (Round 4 review). */
(() => {
  const THEMES = [['midnight', 'Midnight', '#0a0b14'], ['aurora', 'Aurora', 'linear-gradient(135deg,#8b93ff,#ff5a4e)'], ['daynight', 'Day & Night', 'linear-gradient(90deg,#0a0b14 50%,#f5f2ec 50%)']];
  // Decided: Aurora. Other directions stay reachable with ?theme=… (and ?switch=1 shows the control).
  let t = new URLSearchParams(location.search).get('theme');
  if (!THEMES.some(x => x[0] === t)) t = 'aurora';
  document.documentElement.dataset.theme = t;

  // which sections are "daytime" (light) in the Day & Night direction
  function daySections() {
    if (document.getElementById('story')) return ['#flow', '#build', '#calc', '#tools', '#how', '#promise', '#pricing-teaser'].map(s => document.querySelector(s)).filter(Boolean);
    return [...document.querySelectorAll('main > section')].filter(s => !s.matches('.phero,.cgrid,.nf,.story,[data-night]'));
  }
  function apply(v) {
    t = v; document.documentElement.dataset.theme = v;
    if (v !== 'aurora') try { const u = new URL(location.href); u.searchParams.set('theme', v); history.replaceState(null, '', u); } catch (e) {}
    daySections().forEach(s => s.classList.toggle('light', v === 'daynight'));
    document.querySelectorAll('.theme-switch button').forEach(b => b.classList.toggle('on', b.dataset.t === v));
    // keep the theme when moving between mockup pages
    if (v !== 'aurora') document.querySelectorAll('a[href$=".html"],a[href*=".html?"]').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href); u.searchParams.set('theme', v); a.setAttribute('href', u.pathname.split('/').pop() + u.search + u.hash);
    });
  }

  // ---- font comparison (?font=inter | bricolage); default is Schibsted Grotesk + Hanken Grotesk ----------------
  const FONTS = {
    schibsted: ['Schibsted + Hanken', ''],
    inter: ['Inter Tight + Inter', 'family=Inter:wght@400;500;600&family=Inter+Tight:wght@300;400;500;600'],
    bricolage: ['Bricolage + Figtree', 'family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Figtree:wght@300..700'],
  };
  let f = new URLSearchParams(location.search).get('font');
  if (!FONTS[f]) f = null;
  if (f && FONTS[f][1]) {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = `https://fonts.googleapis.com/css2?${FONTS[f][1]}&display=swap`; document.head.appendChild(l);
  }
  if (f) document.documentElement.dataset.font = f;
  function fontLinks() {
    if (!f) return;
    document.querySelectorAll('a[href]').forEach(a => {
      const h = a.getAttribute('href'); if (/^(https?:|mailto:|#)/.test(h)) return;
      const u = new URL(h, location.href); if (u.origin !== location.origin) return;
      u.searchParams.set('font', f); a.setAttribute('href', u.pathname + u.search + u.hash);
    });
  }
  function fontSwitch() {
    if (!f) return;
    const sw = document.createElement('div'); sw.className = 'theme-switch';
    sw.innerHTML = '<span>FONT</span>' + Object.entries(FONTS).map(([k, v]) => `<button data-f="${k}" class="${k === f ? 'on' : ''}">${v[0]}</button>`).join('');
    sw.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const u = new URL(location.href); u.searchParams.set('font', b.dataset.f); location.href = u; });
    document.body.appendChild(sw);
  }

  function init() {
    fontSwitch(); fontLinks(); setTimeout(fontLinks, 900);
    const sw = document.createElement('div'); sw.className = 'theme-switch';
    sw.innerHTML = '<span>COLOUR</span>' + THEMES.map(x => `<button data-t="${x[0]}"><i style="background:${x[2]}"></i>${x[1]}</button>`).join('');
    if (new URLSearchParams(location.search).has('switch')) document.body.appendChild(sw);
    sw.addEventListener('click', e => { const b = e.target.closest('button'); if (b) apply(b.dataset.t); });
    apply(t);

    // cursor spotlight on cards (visible in Aurora)
    const SPOT = '.svc,.pc,.gets>div,.sysstage,.srow,.loop .node,.fstep,.phase .vis,.band,.tier,.calc,.try,.c';
    const mark = () => document.querySelectorAll(SPOT).forEach(el => el.classList.add('spot'));
    mark(); setTimeout(mark, 800);
    document.addEventListener('pointermove', e => {
      const el = e.target.closest && e.target.closest('.spot'); if (!el) return;
      const r = el.getBoundingClientRect(); el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });

    // slightly magnetic primary buttons
    document.addEventListener('pointermove', e => {
      document.querySelectorAll('.btn.primary').forEach(b => {
        const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = e.clientX - cx, dy = e.clientY - cy;
        const near = Math.abs(dx) < r.width / 2 + 30 && Math.abs(dy) < r.height / 2 + 30;
        b.style.translate = near ? `${dx * .08}px ${dy * .12}px` : '';
      });
    }, { passive: true });

    // count-up numbers: <b data-count="412">
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '', t0 = performance.now();
      const tick = now => { const k = Math.min(1, (now - t0) / 1200), v = Math.round(end * (1 - Math.pow(1 - k, 3))); el.textContent = pre + v.toLocaleString('en-US') + suf; if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: .4 });
    const watch = () => document.querySelectorAll('[data-count]:not([data-watched])').forEach(el => { el.dataset.watched = 1; io.observe(el); });
    watch(); setTimeout(watch, 800);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
