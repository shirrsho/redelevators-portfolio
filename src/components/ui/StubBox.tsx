import type { CSSProperties, ReactNode } from "react";

/**
 * Placeholder render for a component another track hasn't built yet. Stage 1 scaffolding:
 * delete this file in Stage 3 once `grep -r "STUB:" src` is empty.
 */
export function StubBox({ name, track, minHeight = 160, note, style, children }: { name: string; track: "A" | "B" | "C" | "D"; minHeight?: number; note?: ReactNode; style?: CSSProperties; children?: ReactNode }) {
  return (
    <div
      data-stub={name}
      style={{
        minHeight,
        display: "grid",
        placeContent: "center",
        justifyItems: "center",
        gap: 8,
        padding: 20,
        textAlign: "center",
        border: "1.5px dashed var(--hair-2)",
        borderRadius: 20,
        background: "var(--surface)",
        color: "var(--dim)",
        ...style,
      }}
    >
      <span className="mono">
        &lt;{name} /&gt; · Track {track}
      </span>
      {note ? <span className="small">{note}</span> : null}
      {children}
    </div>
  );
}
