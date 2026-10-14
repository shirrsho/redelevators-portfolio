"use client";

import { useEffect, useRef, useState } from "react";
import { ASSISTANT, ASSISTANT_RULES } from "@/lib/assistant";
import { Notification } from "@/components/devices/Notification";
import { PhoneShell } from "@/components/devices/PhoneShell";
import { Eyebrow } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";

type Msg = { id: number; kind: "in" | "out" | "typing"; text?: string; html?: string };
type Source = { text: string; amber: boolean };

/** A chat row that fades up one frame after it mounts (the greeting is already shown). */
function Row({ m, shown = false }: { m: Msg; shown?: boolean }) {
  const [show, setShow] = useState(shown);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (m.kind === "typing") {
    return (
      <div className={`typing${show ? " show" : ""}`}>
        <i />
        <i />
        <i />
      </div>
    );
  }
  const cls = `bub ${m.kind}${show ? " show" : ""}`;
  return m.html ? <div className={cls} dangerouslySetInnerHTML={{ __html: m.html }} /> : <div className={cls}>{m.text}</div>;
}

/**
 * "Try it yourself": scripted answers to typed text or chips, from one example rental's house
 * guide. Refunds, complaints and anything not in the guide are handed to the owner. No live AI.
 * Mockup: site.js → mountTry, sections.css .try / .tphone / .handoff. Copy and rules:
 * src/lib/assistant.ts. Lives in the two messaging service pages.
 */
export function AssistantDemo() {
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, kind: "out", text: ASSISTANT.greeting }]);
  const [src, setSrc] = useState<Source>({ text: ASSISTANT.source, amber: false });
  const [handoff, setHandoff] = useState(false);
  const [draft, setDraft] = useState("");
  const next = useRef(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const push = (m: Omit<Msg, "id">) => {
    const id = next.current++;
    setMsgs((cur) => [...cur, { ...m, id }].slice(-ASSISTANT.maxMessages));
    return id;
  };

  const ask = (q: string) => {
    if (!q.trim()) return;
    push({ kind: "in", text: q });
    const typing = push({ kind: "typing" });
    timers.current.push(
      setTimeout(() => {
        setMsgs((cur) => cur.filter((m) => m.id !== typing));
        const rule = ASSISTANT_RULES.find((r) => r[0].test(q));
        if (rule && rule[1] === null) {
          push({ kind: "out", text: ASSISTANT.handover.reply });
          setSrc({ text: ASSISTANT.handover.source, amber: true });
          setHandoff(true);
          timers.current.push(setTimeout(() => setHandoff(false), ASSISTANT.handoffMs));
        } else if (rule) {
          push({ kind: "out", html: rule[1] as string });
          setSrc({ text: `Answered from: ${rule[2]}`, amber: false });
        } else {
          push({ kind: "out", text: ASSISTANT.unknown.reply });
          setSrc({ text: ASSISTANT.unknown.source, amber: true });
        }
      }, ASSISTANT.replyMs),
    );
  };

  return (
    <div className="try rv">
      <div className="tcopy">
        <Eyebrow>{ASSISTANT.eyebrow}</Eyebrow>
        <h2 className="d2" style={{ marginTop: 18 }}>
          {ASSISTANT.title}
        </h2>
        <p className="lead" style={{ marginTop: 14 }}>
          {ASSISTANT.lead}
        </p>
        <div className="sugg">
          {ASSISTANT.suggestions.map((q) => (
            <button key={q} type="button" onClick={() => ask(q)}>
              {q}
            </button>
          ))}
        </div>
        <p className="mono src" style={{ marginTop: 18, ...(src.amber ? { color: "var(--amber)" } : null) }} aria-live="polite">
          {src.text}
        </p>
      </div>
      <div className="tphone">
        <PhoneShell>
          <div className="chatui">
            <div className="ch-h">
              <span className="av" style={{ background: "#E51E2B" }}>
                <Icon name="assistant" style={{ width: 18, height: 18 }} />
              </span>
              <div>
                <b>{ASSISTANT.name}</b>
                <span>{ASSISTANT.status}</span>
              </div>
            </div>
            <div className="ch-b tb" role="log" aria-label="Demo chat">
              {msgs.map((m) => (
                <Row key={m.id} m={m} shown={m.id === 0} />
              ))}
            </div>
            <form
              className="ch-f tin"
              onSubmit={(e) => {
                e.preventDefault();
                ask(draft);
                setDraft("");
              }}
            >
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={ASSISTANT.placeholder} autoComplete="off" aria-label="Type a guest question" />
              <button type="submit" aria-label="Send">
                <Icon name="arrow" />
              </button>
            </form>
          </div>
        </PhoneShell>
        <div className={`handoff${handoff ? " show" : ""}`} aria-hidden={!handoff}>
          <Notification mark app={ASSISTANT.handover.card.app} ago={ASSISTANT.handover.card.ago} title={ASSISTANT.handover.card.tt} body={ASSISTANT.handover.card.bd} />
        </div>
      </div>
    </div>
  );
}
