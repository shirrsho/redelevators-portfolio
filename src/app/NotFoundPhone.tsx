"use client";

import { useEffect, useState } from "react";
import { Notification } from "@/components/devices/Notification";
import { LockIcons, PhoneClock, PhoneShell, PhoneStatus } from "@/components/devices/PhoneShell";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * The 404 lock screen: one gentle notification arrives 0.9s in ("This page checked out") and the
 * phone buzzes once. Reduced motion shows it already arrived. Mockup: 404.html.
 */
export function NotFoundPhone() {
  const reduced = useReducedMotion();
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setArrived(true), 900);
    return () => clearTimeout(id);
  }, [reduced]);

  const shown = arrived || reduced;

  return (
    <PhoneShell className={shown ? "buzz" : undefined}>
      <PhoneStatus time="2:14" />
      <PhoneClock date="Tuesday, October 14" time="4:04" />
      <div className="stack">
        <Notification
          mark
          app="Red Elevators"
          ago="now"
          title="This page checked out"
          body="Error 404 · the guest left no forwarding address. Head home →"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "none" : "translateY(-16px)",
            transition: "opacity .6s, transform .7s var(--ease)",
          }}
        />
      </div>
      <LockIcons />
    </PhoneShell>
  );
}
