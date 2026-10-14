import type { ReactNode, Ref } from "react";
import { LockIcons, PhoneClock, PhoneShell, PhoneStatus } from "./PhoneShell";

// The owner's phone in the homepage story: lock screen with status bar, date, big clock and the
// notification stack (home.html #phone). Built on the shared PhoneShell. The story positions the
// notifications (GAP 86, 3 visible, 2 on phones), buzzes the phone on arrival and switches it to
// day mode at 7:30; the refs let it do that without re-rendering.

export const STORY_DATE = "Tuesday, October 14";

export function PhoneMockup({
  time,
  className,
  children,
  phoneRef,
  stackRef,
  timeRef,
  statusTimeRef,
}: {
  /** Initial time ("2:14"). The story updates the text in place afterwards. */
  time: string;
  className?: string;
  /** Notifications (and the "n more" line) inside `.stack`. */
  children?: ReactNode;
  phoneRef?: Ref<HTMLDivElement>;
  stackRef?: Ref<HTMLDivElement>;
  timeRef?: Ref<HTMLSpanElement>;
  statusTimeRef?: Ref<HTMLSpanElement>;
}) {
  return (
    <PhoneShell ref={phoneRef} className={className} dayWallpaper>
      <PhoneStatus time={<span ref={statusTimeRef}>{time}</span>} />
      <PhoneClock date={STORY_DATE} time={<span ref={timeRef}>{time}</span>} />
      <div className="stack" ref={stackRef}>
        {children}
      </div>
      <LockIcons />
    </PhoneShell>
  );
}
