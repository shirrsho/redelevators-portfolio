import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowIcon } from "./Icon";

type Variant = "primary" | "quiet" | "wa";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  /** primary = the red booking action (one per view, magnetic); quiet = outline; wa = WhatsApp green (Contact only). */
  variant?: Variant;
  /** Trailing arrow (primary buttons in the mockup carry it). */
  arrow?: boolean;
  /** Umami event name (src/lib/analytics.ts → EVENTS) and its `location` property. */
  event?: string;
  location?: string;
  children: ReactNode;
};

const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

/**
 * `.btn` link. Internal paths use next/link; hashes, mailto: and external URLs use <a>
 * (external ones open in a new tab). Mockup: base.css .btn, themes.css (Aurora gradient).
 */
export function Button({ href, variant = "primary", arrow = false, event, location, className, children, ...rest }: Props) {
  const cls = `btn ${variant}${className ? ` ${className}` : ""}`;
  const track = event ? { "data-umami-event": event, ...(location ? { "data-umami-event-location": location } : {}) } : {};
  const body = (
    <>
      {children}
      {arrow && <ArrowIcon />}
    </>
  );
  if (isInternal(href)) {
    return (
      <Link href={href} className={cls} {...track} {...rest}>
        {body}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener" } : {})} {...track} {...rest}>
      {body}
    </a>
  );
}

/** Underlined text link (`.link`), e.g. "Skip the story →". */
export function TextLink({ href, className, children, event, location, ...rest }: Omit<Props, "variant" | "arrow">) {
  const cls = `link${className ? ` ${className}` : ""}`;
  const track = event ? { "data-umami-event": event, ...(location ? { "data-umami-event-location": location } : {}) } : {};
  return isInternal(href) ? (
    <Link href={href} className={cls} {...track} {...rest}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls} {...track} {...rest}>
      {children}
    </a>
  );
}
