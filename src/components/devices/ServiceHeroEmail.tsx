import { ConBar, ScreenCard } from "@/components/devices/ScreenCard";
import { Icon } from "@/components/ui/Icon";
import { ToolLogo } from "@/components/ui/ToolLogo";

// Hero · Direct Booking Engine: a personal offer goes out, the guest books direct.
// Ported from service.html → HERO.email. The mockup's markup is static (`.view.on` + `.stg`
// stagger in CSS), so this is a server component.

const GROUPS = [["Summer 2025 guests", 38], ["Families", 22], ["Stayed twice", 11], ["Long weekends", 17]] as const;

export function ServiceHeroEmail() {
  return (
    <ScreenCard chip="Personal offer → direct booking">
      <div className="con" style={{ gridTemplateColumns: "150px 1fr" }}>
        <ConBar title="Direct bookings" status="Sending" />
        <div className="side">
          {GROUPS.map((g, i) => (
            <div key={g[0]} className={`nv${i === 0 ? " on" : ""}`}>
              <Icon name="guest" />
              {g[0]}
              <span style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10 }}>{g[1]}</span>
            </div>
          ))}
        </div>
        <div className="main">
          <div className="view on" style={{ display: "grid", gap: 10, alignContent: "start" }}>
            <div className="card stg s1">
              <div className="mono" style={{ fontSize: 10 }}>
                TO: JAMES R. · STAYED AUG 2025
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, margin: "8px 0 6px" }}>James, the Garden Suite misses you</div>
              <div style={{ color: "var(--sub)", lineHeight: 1.5 }}>Same flat, same garden. Book direct this time and save 10%, with early check-in included.</div>
              <div style={{ marginTop: 10, display: "inline-block", padding: "7px 12px", borderRadius: 8, background: "var(--red-btn)", color: "#fff", fontWeight: 600 }}>Book direct</div>
            </div>
            <div className="card stg s3" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ToolLogo name="Stripe" size={18} />
              <div>
                <b>James booked 4 nights direct</b>
                <div style={{ color: "var(--sub)", fontSize: 11 }}>Garden Suite · Nov 12–16 · no platform commission</div>
              </div>
              <span className="chip handled" style={{ marginLeft: "auto", fontSize: 11, padding: "4px 9px" }}>
                <i />
                Booked
              </span>
            </div>
          </div>
        </div>
      </div>
    </ScreenCard>
  );
}
