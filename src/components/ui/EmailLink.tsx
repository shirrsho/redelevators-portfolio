"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { EVENTS, track } from "@/lib/analytics";
import { EMAIL } from "@/lib/site";

/**
 * mailto: link that also copies the address (fallback for visitors without a mail app).
 * Tracks "Email click" (attribute) and "Email copied". Styled as `.link` by default.
 */
export function EmailLink({
  location,
  className = "link",
  style,
  children,
}: {
  /** Where the link sits (footer, contact, mobile…), sent with the events. */
  location: string;
  className?: string;
  style?: CSSProperties;
  /** Defaults to the address itself. */
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const onClick = async () => {
    // Doesn't block the mailto: navigation.
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      track(EVENTS.emailCopied, { location });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable: mailto: still fires.
    }
  };

  // The "copied" note sits inside the link (absolutely positioned), so the link keeps the
  // exact box the mockup gives it (.link inline-flex, or block inside the footer grid).
  return (
    <a
      href={`mailto:${EMAIL}`}
      className={className}
      style={{ position: "relative", ...style }}
      onClick={onClick}
      data-umami-event={EVENTS.emailClick}
      data-umami-event-location={location}
    >
      {children ?? EMAIL}
      <span role="status" aria-live="polite" className="email-copied" data-on={copied || undefined}>
        {copied ? "Copied to clipboard" : ""}
      </span>
    </a>
  );
}
