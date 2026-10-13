"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { ConBar, ScreenCard } from "@/components/devices/ScreenCard";
import { cueList, useSceneTimeline } from "@/components/devices/useSceneTimeline";
import { Icon } from "@/components/ui/Icon";
import { ToolLogo } from "@/components/ui/ToolLogo";

// Hero · Guest Messaging & CRM: every channel lands in one inbox, and the guest profile fills
// itself in. Ported from service.html → HERO.chat (timings unchanged), 10s loop.

/** [channel, colour, guest · unit, message, status once answered] */
const MESSAGES = [
  ["Airbnb", "#FF5A5F", "Maria · Loft 2B", "Could we check in early?", "Answered · 4s"],
  ["Booking.com", "#003A9A", "Tom · Garden Suite", "Is there parking?", "Answered · 3s"],
  ["WhatsApp", "#25D366", "Rosa (cleaner)", "Linen for Loft 2B?", "Ordered"],
  ["mail", "#3a3a46", "James · direct", "Can I bring my dog?", "Answered · 5s"],
] as const;
const FIELDS = [["Stays", "3"], ["Prefers", "Early check-in"], ["Travels with", "Partner"], ["Last review", "★★★★★"], ["Next offer", "Book direct −10%"]] as const;

const IN_AT = (i: number) => 300 + i * 700;
const OK_AT = (i: number) => 3400 + i * 900;
const FIELD_AT = (i: number) => 3700 + i * 450;
const THREAD_AT = 3000;
const SENT_AT = 3400;
const CUES = cueList(...MESSAGES.map((_, i) => IN_AT(i)), ...MESSAGES.map((_, i) => OK_AT(i)), ...FIELDS.map((_, i) => FIELD_AT(i)), THREAD_AT, SENT_AT);

export function ServiceHeroInbox() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { threshold: 0.2 });
  const t = useSceneTimeline(CUES, 10000, active);

  return (
    <ScreenCard ref={ref} chip="Four channels, one inbox.">
      <div className="con" style={{ gridTemplateColumns: "1fr" }}>
        <ConBar title="One inbox" status="4 channels connected" />
        <div className="ibx">
          <div className="list">
            {MESSAGES.map((m, i) => {
              const ok = t >= OK_AT(i);
              return (
                <div key={m[2]} className={["m", t >= IN_AT(i) ? "in" : "", ok ? "ok" : "", i === 0 && t >= THREAD_AT ? "sel" : ""].filter(Boolean).join(" ")}>
                  <span className="ch" style={{ "--g": m[1] } as CSSProperties}>
                    {m[0] === "mail" ? <Icon name="mail" /> : <ToolLogo name={m[0]} size={14} mono />}
                  </span>
                  <div>
                    <b>{m[2]}</b>
                    <span>{m[3]}</span>
                  </div>
                  <em>{ok ? m[4] : "New"}</em>
                </div>
              );
            })}
            <div className={`thr${t >= THREAD_AT ? " on" : ""}${t >= SENT_AT ? " sent" : ""}`}>
              <span className="mono">AIRBNB · MARIA · LOFT 2B</span>
              <div className="b i">Could we check in early, around 11?</div>
              <div className="b o">Hi Maria! Your loft is ready from 12:00, so come at noon. Happy to hold your bags from 11 😊</div>
            </div>
            <div className="stat">
              <span>
                <b>23</b> answered today
              </span>
              <span>
                <b>4s</b> typical reply
              </span>
              <span>
                <b>1</b> sent to you
              </span>
            </div>
          </div>
          <div className="crm">
            <div className="mono" style={{ fontSize: 11 }}>
              GUEST PROFILE
            </div>
            <div className="who">
              <i>M</i>
              <div>
                <b style={{ fontSize: 13.5 }}>Maria Lopez</b>
                <div style={{ color: "var(--sub)" }}>Airbnb · Loft 2B</div>
              </div>
            </div>
            {FIELDS.map((f, i) => (
              <div key={f[0]} className={`f${t >= FIELD_AT(i) ? " on" : ""}`}>
                <span>{f[0]}</span>
                <b>{f[1]}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenCard>
  );
}
