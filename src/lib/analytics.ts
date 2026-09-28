// Thin wrapper around the self-hosted Umami tracker loaded in layout.tsx.
//
// Most clicks are tracked declaratively with `data-umami-event` attributes,
// which need no code. This helper is for events that have no click to hang
// an attribute on — scroll depth, 404s, outbound links, "email copied".
//
// stats.js loads afterInteractive, so an event can fire before
// `window.umami` exists. Those are retried briefly instead of dropped.

type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void };
  }
}

export function track(name: string, data?: EventData, attempt = 0) {
  if (typeof window === "undefined") return;
  if (window.umami) {
    window.umami.track(name, data);
  } else if (attempt < 20) {
    setTimeout(() => track(name, data, attempt + 1), 500);
  }
}

/** The service slug when on /services/<slug>, else undefined. */
export function serviceFromPath(pathname: string) {
  return pathname.match(/^\/services\/([^/]+)/)?.[1];
}
