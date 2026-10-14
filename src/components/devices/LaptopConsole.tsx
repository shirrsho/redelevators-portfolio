import type { CSSProperties } from "react";
import { CHART, CONSOLE_NAV, TOOLS } from "@/lib/story";
import { Icon } from "@/components/ui/Icon";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { LaptopShell } from "./PhoneShell";

// The system's laptop in the homepage story: the "Your system" console with a sidebar (5 views,
// connected tools) and the five views (Inbox, Bookings, Pricing & ads, Turnovers, Summary).
// Port of home.html #laptopRig + home.js #conSide / #conMain; the views' copy and inline styles
// are unchanged. Presentational: the story toggles `.view.on`, `.nv.on`, `.tl.live` and draws
// the chart (`.draw`) itself. `allOn` renders every view's staged items visible (static story).

const mono10: CSSProperties = { fontSize: 10 };
const sub: CSSProperties = { color: "var(--sub)" };
const sub11: CSSProperties = { color: "var(--sub)", fontSize: 11 };
const chipSm: CSSProperties = { marginLeft: "auto", fontSize: 11, padding: "4px 9px" };

function Chart() {
  const { before: a, after: b } = CHART;
  const W = 420, H = 110, x = (i: number) => 10 + (i * (W - 20)) / 13, y = (v: number) => H - 10 - ((v - 95) / 70) * (H - 20);
  const p = (arr: readonly number[]) => arr.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 110 }} aria-hidden="true">
      <path d={p(a)} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" strokeDasharray="4 4" />
      <path
        className="draw"
        d={p(b)}
        fill="none"
        stroke="#FF2D3B"
        strokeWidth="2"
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: 1, transition: "stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1) .3s" }}
      />
      {[7, 8, 9].map((i) => (
        <rect key={i} x={x(i) - 12} y="4" width="24" height={H - 8} rx="4" fill="rgba(143,212,176,.08)" />
      ))}
    </svg>
  );
}

const INBOX: readonly (readonly [string, string])[] = [["Maria · Loft 2B", "now"], ["James · Garden Suite", "6m"], ["Airbnb · rate", "40m"]];
const TURNOVER: readonly (readonly [string, string, string, "guest" | "clean" | "key" | "check"])[] = [
  ["10:00", "Guest checks out", "Checkout reminder sent at 8:00", "guest"],
  ["11:00", "Rosa cleans", "Booked automatically · linen ordered", "clean"],
  ["11:02", "New door code 4821", "Sent to Rosa and tonight’s guest on WhatsApp", "key"],
  ["14:00", "Ready for 3pm arrival", "Photos checked · calendar updated", "check"],
];
const SUMMARY: readonly (readonly [string, string])[] = [["6", "guest messages answered"], ["1", "booking moved direct"], ["2", "quiet nights filled"], ["1", "turnover sorted"]];

export function LaptopConsole({ allOn = false, view }: { allOn?: boolean; view?: number }) {
  const on = (i: number) => (allOn && view === i ? " on" : "");
  return (
    <LaptopShell>
      <div className="con">
        <div className="bar">
          <div className="dots">
            <i />
            <i />
            <i />
          </div>
          <b>Your system</b>
          <span className="mono">run by Red Elevators</span>
          <span className="ok">
            <i />
            All running
          </span>
        </div>
        <div className="side">
          {CONSOLE_NAV.map(([icon, label], i) => (
            <div key={label} className={`nv${on(i)}`} data-i={i}>
              <Icon name={icon} />
              {label}
            </div>
          ))}
          <div className="lbl">CONNECTED</div>
          {TOOLS.map((t) => (
            <div key={t} className={`tl${allOn ? " live" : ""}`} data-t={t}>
              <ToolLogo name={t} size={12} />
              {t}
              <i />
            </div>
          ))}
        </div>
        <div className="main">
          <div className={`view${on(0)}`} data-v="0">
            <h5>
              Inbox <span>3 conversations · all answered</span>
            </h5>
            <div style={{ display: "grid", gridTemplateColumns: "150px minmax(0,1fr)", gap: 10, height: 330 }}>
              <div style={{ display: "grid", gap: 6, alignContent: "start" }}>
                {INBOX.map((c, i) => (
                  <div key={c[0]} className={`card stg s${i + 1}`} style={{ padding: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 11.5 }}>{c[0]}</div>
                    <div style={{ color: "var(--green)", fontSize: 10.5, marginTop: 2 }}>✓ answered · {c[1]}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="mono" style={mono10}>
                  AIRBNB · MARIA · LOFT 2B
                </div>
                <div className="bub in stg s1">Hi! We just arrived. What’s the wifi password? 🙂</div>
                <div className="typing stg s2">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="bub out stg s3">
                  Welcome, Maria! Wifi is <b>LoftGuest</b> / sunny-balcony-42. Your house guide (parking, bins, best coffee) is here: re.guide/loft2b
                  <small>Your assistant · in your tone</small>
                </div>
                <div className="chip handled stg s4" style={{ alignSelf: "flex-start", fontSize: 11, padding: "5px 9px", whiteSpace: "normal", borderRadius: 10 }}>
                  <i />
                  James: early check-in → 12:00 offered, cleaner confirmed
                </div>
              </div>
            </div>
          </div>

          <div className={`view${on(1)}`} data-v="1">
            <h5>
              Bookings <span>direct · this week</span>
            </h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="card stg s1">
                <div className="mono" style={mono10}>
                  RETURNING GUEST · EMAIL
                </div>
                <div style={{ fontWeight: 600, margin: "6px 0 4px" }}>“Book direct next time, skip the fees”</div>
                <div style={sub}>Sent to 38 past guests of Harbor Studio</div>
              </div>
              <div className="card stg s2">
                <div className="mono" style={mono10}>
                  HARBOR STUDIO
                </div>
                <div style={{ fontWeight: 600, margin: "6px 0 4px" }}>Oct 18–20 · 2 nights</div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--sub)" }}>
                  <span>Total</span>
                  <span style={{ color: "var(--ink)" }}>$340</span>
                </div>
              </div>
              <div className="card stg s3" style={{ gridColumn: "1/3", display: "flex", alignItems: "center", gap: 10 }}>
                <ToolLogo name="Stripe" size={18} />
                <div>
                  <div style={{ fontWeight: 600 }}>Paid · booked direct</div>
                  <div style={sub11}>Calendars blocked on Airbnb and Booking.com</div>
                </div>
                <span className="chip handled" style={chipSm}>
                  <i />
                  Confirmed
                </span>
              </div>
              <div className="card stg s4" style={{ gridColumn: "1/3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={sub}>Platform commission on this stay</span>
                <span style={{ fontFamily: "var(--display)", fontSize: 28 }}>$0</span>
              </div>
            </div>
          </div>

          <div className={`view${on(2)}`} data-v="2">
            <h5>
              Pricing &amp; ads <span>Canal House · next 14 nights</span>
            </h5>
            <div className="card stg s1">
              <Chart />
              <div style={{ display: "flex", gap: 14, fontSize: 10.5, color: "var(--sub)", marginTop: 4 }}>
                <span>- - before</span>
                <span style={{ color: "#ff6b74" }}>— adjusted to demand</span>
                <span style={{ color: "var(--green)" }}>▮ Tue–Thu campaign</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 10, marginTop: 10 }}>
              <div className="card stg s2" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <ToolLogo name="Meta" size={20} />
                <div>
                  <div style={{ fontWeight: 600 }}>Midweek escape · Tue–Thu</div>
                  <div style={sub11}>Instagram + Facebook · $12/day</div>
                </div>
                <span className="chip handled" style={chipSm}>
                  <i />
                  Live
                </span>
              </div>
              <div className="card stg s3">
                <div className="mono" style={mono10}>
                  GAP NIGHTS
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  {["Tue ✓", "Wed ✓", "Thu …"].map((d, i) => (
                    <span key={d} className="tag" style={i < 2 ? { color: "var(--green)", borderColor: "rgba(143,212,176,.35)" } : undefined}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`view${on(3)}`} data-v="3">
            <h5>
              Turnovers <span>today · Canal House</span>
            </h5>
            <div style={{ display: "grid", gap: 8 }}>
              {TURNOVER.map((r, i) => (
                <div key={r[0]} className={`card stg s${i + 1}`} style={{ display: "grid", gridTemplateColumns: "44px 26px 1fr auto", gap: 10, alignItems: "center" }}>
                  <span className="mono">{r[0]}</span>
                  <span style={{ color: "var(--green)" }}>
                    <Icon name={r[3]} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r[1]}</div>
                    <div style={sub11}>{r[2]}</div>
                  </div>
                  <span style={{ color: "var(--green)" }}>✓</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`view${on(4)}`} data-v="4">
            <h5>
              Overnight summary <span>02:14 → 07:30</span>
            </h5>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SUMMARY.map((r) => (
                <div key={r[1]} className="card">
                  <div style={{ fontFamily: "var(--display)", fontSize: 30 }}>{r[0]}</div>
                  <div style={sub}>{r[1]}</div>
                </div>
              ))}
              <div className="card" style={{ gridColumn: "1/3", color: "var(--green)" }}>
                ✓ Nothing needs the owner today
              </div>
            </div>
          </div>
        </div>
      </div>
    </LaptopShell>
  );
}
