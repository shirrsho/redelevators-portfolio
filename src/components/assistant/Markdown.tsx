"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";

// Replies are Markdown (WIDGET.md rule 3). This renders a small, safe subset straight to React elements:
// paragraphs, line breaks, **bold**, *italic*, bullet and numbered lists, [links](…), bare URLs and emails.
// Nothing is ever injected as HTML, so whatever the model writes is shown as text.

const SITE_HOSTS = new Set(["redelevators.com", "www.redelevators.com"]);

export type LinkTarget = { kind: "booking" } | { kind: "internal"; href: string } | { kind: "external"; href: string } | { kind: "mail"; href: string } | null;

/** Where a link in a reply goes. Booking links open the calendar in the chat; site links stay on the site. */
export function linkTarget(raw: string): LinkTarget {
  const href = raw.trim();
  if (/^mailto:/i.test(href)) return { kind: "mail", href };
  let url: URL;
  try {
    url = new URL(href, "https://redelevators.com");
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (SITE_HOSTS.has(url.hostname)) {
    // "//evil.com" as a path would be a protocol-relative link off the site: collapse leading slashes.
    const path = url.pathname.replace(/^\/+/, "/");
    if (path.replace(/\/$/, "") === "/contact") return { kind: "booking" };
    return { kind: "internal", href: path + url.search + url.hash };
  }
  return { kind: "external", href: url.href };
}

type Props = { text: string; onBooking: () => void; onNavigate?: () => void };

export function Markdown({ text, onBooking, onNavigate }: Props) {
  const blocks = text.replace(/\r/g, "").trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const bullet = /^\s*[-*•]\s+/;
        const numbered = /^\s*\d+[.)]\s+/;
        if (lines.every((l) => bullet.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(bullet, ""), onBooking, onNavigate)}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => numbered.test(l))) {
          return (
            <ol key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(numbered, ""), onBooking, onNavigate)}</li>
              ))}
            </ol>
          );
        }
        // A heading line ("## Setup") is shown as a bold line: replies are short, headings are rare.
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 ? <br /> : null}
                {/^#{1,6}\s+/.test(l) ? <b>{inline(l.replace(/^#{1,6}\s+/, ""), onBooking, onNavigate)}</b> : inline(l, onBooking, onNavigate)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

// **bold** · [text](url) · bare URL · email · *italic* / _italic_
const INLINE =
  /\*\*([^*]+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>()]*[^\s<>().,;:!?'"*])|((?:mailto:)?[\w.+-]+@[\w-]+(?:\.[\w-]+)*\.[a-z]{2,})|(?<![\w*])\*(?!\s)([^*\n]+?)\*(?![\w*])|(?<![\w_])_(?!\s)([^_\n]+?)_(?![\w_])/gi;

function inline(s: string, onBooking: () => void, onNavigate?: () => void): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of s.matchAll(INLINE)) {
    if (m.index! > last) out.push(s.slice(last, m.index));
    const [whole, bold, label, href, bare, email, em1, em2] = m;
    if (bold !== undefined) out.push(<b key={k++}>{inline(bold, onBooking, onNavigate)}</b>);
    else if (label !== undefined) out.push(<RLink key={k++} href={href} onBooking={onBooking} onNavigate={onNavigate}>{label}</RLink>);
    else if (bare !== undefined) out.push(<RLink key={k++} href={bare} onBooking={onBooking} onNavigate={onNavigate}>{prettyUrl(bare)}</RLink>);
    else if (email !== undefined) {
      const addr = email.replace(/^mailto:/i, "");
      out.push(<RLink key={k++} href={`mailto:${addr}`} onBooking={onBooking}>{addr}</RLink>);
    } else if ((em1 ?? em2) !== undefined) out.push(<em key={k++}>{em1 ?? em2}</em>);
    else out.push(whole);
    last = m.index! + whole.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** "https://redelevators.com/contact" → "redelevators.com/contact". */
const prettyUrl = (u: string) => u.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

function RLink({ href, children, onBooking, onNavigate }: { href: string; children: ReactNode; onBooking: () => void; onNavigate?: () => void }) {
  const t = linkTarget(href);
  if (!t) return <>{children}</>;
  if (t.kind === "booking")
    return (
      <button type="button" className="rea-link" onClick={onBooking}>
        {children}
      </button>
    );
  if (t.kind === "internal")
    return (
      <Link href={t.href} className="rea-link" onClick={onNavigate}>
        {children}
      </Link>
    );
  return (
    <a href={t.href} className="rea-link" {...(t.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}
