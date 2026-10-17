#!/usr/bin/env python3
"""
Build the mockups (r3/) into a site preview (site/) that behaves like the real
website: homepage at /, real URLs (/services/<slug>/, /pricing/ …), proper
titles, shared assets under /assets/. No review controls.

Run from anywhere:  python3 redesign-mockups/build-site.py
Serve:              python3 -m http.server 4174 --directory redesign-mockups/site
"""
import re, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC, OUT = ROOT / 'r3', ROOT / 'site'

SLUGS = ['guest-messaging', 'ai-guest-assistant', 'direct-booking-engine', 'listing-content-engine',
         'paid-social', 'photo-ad-creative', 'direct-booking-website', 'booking-campaigns']
TITLES = {
    'home': 'Red Elevators · Automation & marketing for short-term rentals',
    'services': 'Services · Red Elevators', 'systems': 'Systems · Red Elevators', 'approach': 'Approach · Red Elevators',
    'pricing': 'Pricing · Red Elevators', 'contact': 'Book a call · Red Elevators', '404': 'Page not found · Red Elevators',
    'privacy': 'Privacy · Red Elevators', '_design/components': 'Component library · design review', '_design/layouts': 'Sitemap & layouts · design review',
    '_design/nav-hero': 'Nav & hero · design review', '_design/contact': 'Contact options · design review', '_design/contact-summary': 'Contact summary section · design review', '_design/logo': 'Logo · design review', '_design/fonts': 'Fonts · design review',
}
ASSETS = ['base.css', 'devices.css', 'sections.css', 'themes.css', 'theme.js', 'site.js', 'player.js', 'home.js', 'logos.js', 'icons.js', 'red-elevators-logo-dark.svg', 'red-elevators-logo-dark-notag.svg',
          'logo-lockup-dark.svg', 'logo-lockup-light.svg', 'logo-mark.svg', 'logo-mark-solid.svg']
SVGS = [a for a in ASSETS if a.endswith('.svg')]
PAGES = {'home.html': '', 'services.html': 'services', 'systems.html': 'systems', 'approach.html': 'approach',
         'pricing.html': 'pricing', 'contact.html': 'contact', 'privacy.html': 'privacy',
         'components.html': '_design/components', 'layouts.html': '_design/layouts',
         'navhero.html': '_design/nav-hero', 'contact-review.html': '_design/contact', 'contact-summary.html': '_design/contact-summary', 'logo.html': '_design/logo', 'fonts.html': '_design/fonts'}


def links(text: str) -> str:
    """Rewrite mockup file links to real site URLs (HTML and JS template strings)."""
    text = re.sub(r'service\.html\?s=\$\{([^}]+)\}', r'/services/${\1}/', text)          # JS: service.html?s=${s.slug}
    text = re.sub(r'service\.html\?s=([a-z0-9-]+)', r'/services/\1/', text)              # literal slugs
    text = text.replace('`${l[0]}.html`', '`/${l[0]}/`').replace('href="${l[0]}.html"', 'href="/${l[0]}/"')
    for f, path in [('home.html', '/'), ('services.html', '/services/'), ('systems.html', '/systems/'), ('approach.html', '/approach/'),
                    ('pricing.html', '/pricing/'), ('contact.html', '/contact/'), ('privacy.html', '/privacy/'), ('404.html', '/404.html'),
                    ('components.html', '/_design/components/'), ('layouts.html', '/_design/layouts/'),
                    ('navhero.html', '/_design/nav-hero/'), ('contact-review.html', '/_design/contact/'), ('contact-summary.html', '/_design/contact-summary/'), ('logo.html', '/_design/logo/'), ('fonts.html', '/_design/fonts/')]:
        text = re.sub(rf'(?<![\w/.-]){re.escape(f)}', path, text)
    return text


def assets(text: str) -> str:
    for a in ASSETS:
        text = re.sub(rf'(href|src)="{re.escape(a)}(\?v=\d+)?"', rf'\1="/assets/{a}\2"', text)
    for svg in SVGS:
        text = re.sub(rf'(?<![\w/.-]){re.escape(svg)}', f'/assets/{svg}', text)
    return text


def page(html: str, key: str) -> str:
    html = assets(links(html))
    html = re.sub(r'<title>.*?</title>', f'<title>{TITLES[key]}</title>', html, flags=re.S)
    return html


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / 'assets').mkdir(parents=True)
    for a in ASSETS:
        data = (SRC / a).read_text()
        if a.endswith('.js'):
            data = links(data)
            for svg in SVGS:
                data = re.sub(rf'(?<![\w/.-]){re.escape(svg)}', f'/assets/{svg}', data)
            data = data.replace("'/contact/#chat'", "'/contact/#chat'")
        (OUT / 'assets' / a).write_text(data)
    for f, sub in PAGES.items():
        d = OUT / sub if sub else OUT
        d.mkdir(parents=True, exist_ok=True)
        (d / 'index.html').write_text(page((SRC / f).read_text(), sub or 'home'))
    # one real folder per service; the template reads its slug from the URL
    tpl = (SRC / 'service.html').read_text()
    tpl = tpl.replace("new URLSearchParams(location.search).get('s')", "location.pathname.split('/').filter(Boolean)[1]")
    for slug in SLUGS:
        d = OUT / 'services' / slug
        d.mkdir(parents=True, exist_ok=True)
        (d / 'index.html').write_text(page(tpl, 'services').replace(TITLES['services'], f'{slug.replace("-", " ").title()} · Red Elevators'))
    (OUT / '404.html').write_text(page((SRC / '404.html').read_text(), '404'))
    print('built', sum(1 for _ in OUT.rglob('index.html')), 'pages into', OUT)


if __name__ == '__main__':
    main()
