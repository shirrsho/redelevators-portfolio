// The assistant's line icons (mockup: assistant.js → I). Decorative: label the control around them.

const PATHS = {
  chat: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.5V16A2.5 2.5 0 0 1 4 13.5z"/><path d="M8.5 9h7M8.5 12h4"/>',
  send: '<path d="M12 18.5v-13M6.5 11L12 5.5 17.5 11"/>',
  close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  person: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
  doc: '<path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.8v6.4l5.2-3.2z" fill="currentColor"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  warn: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  shield: '<path d="M12 3l7.5 3v6c0 4.5-3.2 7.8-7.5 9-4.3-1.2-7.5-4.5-7.5-9V6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>',
  up: '<path d="M7 11v9H4.5A1.5 1.5 0 0 1 3 18.5v-6A1.5 1.5 0 0 1 4.5 11z"/><path d="M7 11l4-7.5a2 2 0 0 1 3.4 1.9L13.5 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7"/>',
  down: '<path d="M7 13V4H4.5A1.5 1.5 0 0 0 3 5.5v6A1.5 1.5 0 0 0 4.5 13z"/><path d="M7 13l4 7.5a2 2 0 0 0 3.4-1.9L13.5 15H19a2 2 0 0 0 2-2.3l-1.2-7A2 2 0 0 0 17.8 4H7"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/>',
  expand: '<path d="M14 4h6v6M20 4l-6.5 6.5M10 20H4v-6M4 20l6.5-6.5"/>',
  shrink: '<path d="M20 4l-6 6M14 5v5h5M4 20l6-6M10 19v-5H5"/>',
} as const;
export type ReaIconName = keyof typeof PATHS;

const BOLD: ReadonlySet<ReaIconName> = new Set(["send", "check"]);

export function ReaIcon({ name, className = "rea-ico" }: { name: ReaIconName; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={BOLD.has(name) ? 2.2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}

/** The assistant's mark: three rising bars (the logo's elevator), in the AI's indigo. */
export function Mark({ small }: { small?: boolean }) {
  return (
    <span className={`rea-mark${small ? " sm" : ""}`} aria-hidden="true">
      <svg viewBox="2 44 52 48">
        <rect x="4" y="74" width="12" height="16" rx="4" fill="#c5c9ff" opacity=".5" />
        <rect x="22" y="64" width="12" height="26" rx="4" fill="#c5c9ff" opacity=".78" />
        <rect x="40" y="46" width="12" height="44" rx="4" fill="#c5c9ff" />
      </svg>
    </span>
  );
}
