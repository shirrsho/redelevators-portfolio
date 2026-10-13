"use client";

import { useEffect, useState } from "react";

/**
 * The sticky "On this page" list. The current section is the last heading whose top has passed
 * 160px from the viewport top (privacy.html). Links are plain anchors, so it works without JS.
 */
export function PrivacyToc({ sections }: { sections: readonly (readonly [id: string, title: string])[] }) {
  const [cur, setCur] = useState(sections[0][0]);

  useEffect(() => {
    const update = () => {
      let now = sections[0][0];
      for (const [id] of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 160) now = id;
      }
      setCur(now);
    };
    const first = requestAnimationFrame(update);
    addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      removeEventListener("scroll", update);
    };
  }, [sections]);

  return (
    <nav className="toc" aria-label="On this page">
      <span className="mono">ON THIS PAGE</span>
      {sections.map(([id, title]) => (
        <a key={id} href={`#${id}`} className={cur === id ? "on" : undefined} aria-current={cur === id ? "location" : undefined}>
          {title}
        </a>
      ))}
    </nav>
  );
}
