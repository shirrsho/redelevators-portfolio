"use client";

import { useRef, useState } from "react";

export function EmailLink({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = async () => {
    // Don't block the mailto: navigation — this just adds a fallback so the
    // address is on the clipboard if the visitor has no mail handler set up.
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — mailto: still fires.
    }
  };

  return (
    <span className="relative inline-block">
      <a href={`mailto:${email}`} className={className} onClick={handleClick}>
        {email}
      </a>
      <span
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs text-white transition-all duration-200 ${
          copied ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        Copied to clipboard
      </span>
    </span>
  );
}
