// "Show me": highlights part of the real page (the homepage story's spotlight style). The rest of the
// page dims; a tag names what to look at. Any click, scroll-away or Escape ends it.

let current: { el: HTMLElement; off: () => void } | null = null;

export function clearSpotlight() {
  if (!current) return;
  const { el, off } = current;
  current = null;
  off();
  el.classList.remove("on");
  setTimeout(() => el.remove(), 450);
}

/** Waits (up to `ms`) for an element that a page navigation is about to render. */
export function waitFor(selector: string, ms = 5000): Promise<HTMLElement | null> {
  const found = document.querySelector<HTMLElement>(selector);
  if (found) return Promise.resolve(found);
  return new Promise((resolve) => {
    const mo = new MutationObserver(() => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        mo.disconnect();
        clearTimeout(t);
        resolve(el);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    const t = setTimeout(() => {
      mo.disconnect();
      resolve(null);
    }, ms);
  });
}

export function spotlight(target: HTMLElement, label: string, { phone }: { phone: boolean }) {
  clearSpotlight();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + scrollY - (phone ? 96 : 140);
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });

  const spot = document.createElement("div");
  spot.className = "rea-spot";
  spot.setAttribute("aria-hidden", "true");
  const tag = document.createElement("span");
  tag.className = "rea-spot-tag";
  tag.textContent = label;
  spot.append(tag);
  document.body.append(spot);

  const place = () => {
    const r = target.getBoundingClientRect();
    Object.assign(spot.style, { left: `${r.left + scrollX - 12}px`, top: `${r.top + scrollY - 12}px`, width: `${r.width + 24}px`, height: `${r.height + 24}px` });
  };
  place();
  requestAnimationFrame(() => spot.classList.add("on"));

  const ro = new ResizeObserver(place);
  ro.observe(target);
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && clearSpotlight();
  // The first click after the spotlight appears ends it (but lets the click through).
  const onDown = () => clearSpotlight();
  addEventListener("resize", place);
  addEventListener("keydown", onKey);
  const arm = setTimeout(() => addEventListener("pointerdown", onDown, { once: true }), 300);
  current = {
    el: spot,
    off: () => {
      clearTimeout(arm);
      ro.disconnect();
      removeEventListener("resize", place);
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onDown);
    },
  };
}
