import type { CSSProperties, ReactNode, Ref } from "react";
import { LaptopShell } from "@/components/devices/PhoneShell";

/**
 * A laptop scene for a split hero, plus its floating caption chip. On wide screens it is the
 * 760×500 laptop (scaled by the hero's CSS); under 900px the shared rules in sections.css turn
 * it into a real-size "screen card": no stand or camera, the sidebar hidden, `.con/.ibx/.site`
 * in normal flow, the chip below it. Mockup: sections.css (900px block) + laptopShell().
 */
export function ScreenCard({
  children,
  chip,
  chipTone = "handled",
  chipSide = "l",
  chipStyle,
  ref,
}: {
  /** The screen content (`.con`, `.site`…). */
  children: ReactNode;
  /** Caption chip text. */
  chip: ReactNode;
  chipTone?: "handled" | "problem" | "brand";
  chipSide?: "l" | "r";
  chipStyle?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <>
      <LaptopShell ref={ref}>{children}</LaptopShell>
      <span className={`chip ${chipTone} hero-chip ${chipSide}`} style={chipStyle}>
        <i />
        {chip}
      </span>
    </>
  );
}

/** The window bar every `.con` screen starts with (dots, title, status on the right). */
export function ConBar({ title, status, plain }: { title: ReactNode; status: ReactNode; plain?: boolean }) {
  return (
    <div className="bar">
      <div className="dots">
        <i />
        <i />
        <i />
      </div>
      <b>{title}</b>
      {plain ? (
        <span className="mono">{status}</span>
      ) : (
        <span className="ok">
          <i />
          {status}
        </span>
      )}
    </div>
  );
}
