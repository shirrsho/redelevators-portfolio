import { Icon } from "@/components/ui/Icon";
import type { ServiceViz as VizKind } from "@/lib/services";

/**
 * The looping mini demo on a service card / row (CSS-only animations in sections.css: .m-chat,
 * .m-cal, .m-doc, .m-ad, .m-frames, .m-web, .m-fun). Mockup: site.js → VIZ (home.js has the same
 * set; its "spark" reply is the longer one, selected with `long`).
 * Server component. Decorative: the card's text carries the meaning.
 */
export function ServiceViz({ kind, long = false }: { kind: VizKind; long?: boolean }) {
  return (
    <div className="mv" aria-hidden="true">
      {kind === "chat" && (
        <div className="m-chat">
          <div className="bub in">Late check-in ok?</div>
          <div className="bub out">Of course! Code is 4821.</div>
          <div className="bub in">Perfect, thank you 🙏</div>
        </div>
      )}
      {kind === "spark" && (
        <div className="m-chat" style={{ width: "76%" }}>
          <div className="bub in">Can I bring my dog? 🐶</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
            <span className="m-spark" style={{ width: 18, height: 18 }}>
              <Icon name="assistant" />
            </span>
            <div className="bub out" style={{ animationDelay: "1.4s" }}>
              {long ? "Yes! Small dogs are welcome. Here’s the pet guide." : "Yes! Small dogs are welcome."}
            </div>
          </div>
        </div>
      )}
      {kind === "cal" && (
        <div className="m-cal">
          {Array.from({ length: 21 }, (_, i) => (
            <i key={i} style={{ animationDelay: `${((i * 137) % 21) * 0.12}s` }} />
          ))}
        </div>
      )}
      {kind === "doc" && (
        <div className="m-doc">
          <i />
          <i />
          <i />
          <i />
          <span className="chip handled">
            <i />
            Published
          </span>
        </div>
      )}
      {kind === "ad" && (
        <div className="m-ad">
          <div className="img" />
          <div className="cta">Book now</div>
        </div>
      )}
      {kind === "frames" && (
        <div className="m-frames">
          <i />
          <i />
          <i />
        </div>
      )}
      {kind === "web" && (
        <div className="m-web">
          <span className="h" />
          <span className="s" />
          <span className="b" />
          <svg className="cur" viewBox="0 0 10 14">
            <path d="M0 0v12l3-3 2 5 2-1-2-5h4z" fill="#fff" />
          </svg>
        </div>
      )}
      {kind === "fun" && (
        <div className="m-fun">
          <i />
          <i />
          <i />
          <i />
        </div>
      )}
    </div>
  );
}
