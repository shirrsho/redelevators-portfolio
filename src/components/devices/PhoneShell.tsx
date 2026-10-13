import type { CSSProperties, ReactNode, Ref } from "react";

// Shared device frames (Stage 1, frozen): used by Track A (404, assistant demo, service heroes),
// Track C (alive phone) and Track D (story phone). Port of site.js → phoneShell() and the lock
// screen pieces in home.html / 404.html. Styles: src/styles/devices.css (.phone …).

/**
 * The 300×620 phone frame with wallpaper, island, home bar and glare; `children` go on the
 * screen between the wallpaper and the home bar. Extra states via className: "day" (morning
 * wallpaper + dark text), "buzz" (one shake, add it again to re-run), "focus", "alive"…
 */
export function PhoneShell({
  children,
  className,
  style,
  dayWallpaper = false,
  ref,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Include the morning wallpaper layer (shown when the phone has class "day"). */
  dayWallpaper?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className={`phone${className ? ` ${className}` : ""}`} style={style}>
      <div className="frame" />
      <span className="side" />
      <span className="side l" />
      <div className="screen">
        <div className="wall" />
        {dayWallpaper ? <div className="wall-day" /> : null}
        <div className="island" />
        {children}
        <div className="homebar" />
        <div className="glare" />
      </div>
    </div>
  );
}

/** Lock-screen status bar: time left, battery right. */
export function PhoneStatus({ time }: { time: ReactNode }) {
  return (
    <div className="status">
      <span>{time}</span>
      <span>
        <span className="batt" />
      </span>
    </div>
  );
}

/** Lock-screen date and big clock. */
export function PhoneClock({ date, time }: { date: ReactNode; time: ReactNode }) {
  return (
    <div className="clock">
      <div className="date">{date}</div>
      <div className="time">{time}</div>
    </div>
  );
}

/** The two round torch/camera buttons at the bottom of the lock screen. */
export function LockIcons() {
  return (
    <div className="lockicons">
      <b />
      <b />
    </div>
  );
}

/**
 * Laptop frame (760×500): lid with camera, screen, base. Under 900px inside a split hero it
 * becomes a real-size "screen card" (sections.css). Port of site.js → laptopShell().
 */
export function LaptopShell({ children, className, style, ref }: { children?: ReactNode; className?: string; style?: CSSProperties; ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={`laptop${className ? ` ${className}` : ""}`} style={style}>
      <div className="lid">
        <span className="cam" />
        <div className="lcd">{children}</div>
      </div>
      <div className="base" />
    </div>
  );
}
