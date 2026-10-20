// Cloudflare Turnstile, once per conversation (WIDGET.md rule 2). Loaded only when the panel first opens.
// The widget is rendered "interaction-only": invisible unless Cloudflare needs the visitor to click.
// Never give the container id="turnstile": element ids become globals and would shadow window.turnstile.

type Api = {
  render: (el: HTMLElement, o: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Api;
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let script: Promise<Api> | null = null;

function load(): Promise<Api> {
  script ??= new Promise<Api>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
    s.onerror = () => {
      script = null;
      reject(new Error("turnstile blocked"));
    };
    document.head.append(s);
  });
  return script;
}

let widget: { id: string; el: HTMLElement } | null = null;
/** The last mount request, so a retry can mount again after the script was blocked. */
let lastMount: { el: HTMLElement; sitekey: string } | null = null;
let token: string | null = null;
let failed = false;
const waiting = new Set<(t: string | null) => void>();
const settle = (t: string | null) => {
  waiting.forEach((w) => w(t));
  waiting.clear();
};

/** Renders the widget into `el` (the panel's slot). Safe to call again with the same element. */
export async function mountTurnstile(el: HTMLElement, sitekey: string): Promise<void> {
  lastMount = { el, sitekey };
  if (widget?.el === el) return;
  const api = await load().catch(() => null);
  if (!api) {
    failed = true;
    settle(null);
    return;
  }
  if (widget) api.remove(widget.id);
  token = null;
  failed = false;
  widget = {
    el,
    id: api.render(el, {
      sitekey,
      appearance: "interaction-only",
      theme: "dark",
      callback: (t: string) => {
        token = t;
        settle(t);
      },
      "expired-callback": () => (token = null),
      "error-callback": () => {
        token = null;
        failed = true;
        settle(null);
      },
    }),
  };
}

export function unmountTurnstile(el: HTMLElement) {
  if (lastMount?.el === el) lastMount = null;
  if (widget?.el !== el) return;
  window.turnstile?.remove(widget.id);
  widget = null;
  token = null;
}

/** A fresh token for a new conversation, waiting up to `ms` for Cloudflare. Null if it never came. */
export async function turnstileToken(ms = 20000): Promise<string | null> {
  if (token) return token;
  if (failed) {
    // A blocked script or a failed challenge: try once more, since the visitor may have allowed it meanwhile.
    failed = false;
    if (widget) window.turnstile?.reset(widget.id);
    else if (lastMount) await mountTurnstile(lastMount.el, lastMount.sitekey);
    if (token) return token;
    if (failed) return null;
  }
  return new Promise((resolve) => {
    const done = (t: string | null) => {
      clearTimeout(timer);
      resolve(t);
    };
    const timer = setTimeout(() => {
      waiting.delete(done);
      resolve(null);
    }, ms);
    waiting.add(done);
  });
}

/** Tokens are single-use: after sending one, ask for the next (ready for the next new conversation). */
export function resetTurnstile() {
  token = null;
  failed = false;
  if (widget) window.turnstile?.reset(widget.id);
}
