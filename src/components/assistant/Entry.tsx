"use client";

import { usePathname } from "next/navigation";
import { ASSISTANT_ON } from "./config";
import { Mark, ReaIcon } from "./icons";
import { open, send, toggle, useAssistant } from "./store";

// The ways into the assistant (mockup screens 1–6). Each renders nothing while the assistant is off.

/** Desktop nav: "Ask" beside "Book a call", quieter than the red button. Hidden under 900px (CSS). */
export function NavAsk() {
  const isOpen = useAssistant((s) => s.open);
  const path = usePathname();
  if (!ASSISTANT_ON) return null;
  // On /ask the assistant is already on the page: the button just puts the cursor in it.
  const onClick = () => (path === "/ask" ? document.getElementById("rea-input-inline")?.focus() : toggle("nav"));
  return (
    <button type="button" className="rea-ask" aria-expanded={isOpen} aria-controls="rea-panel" aria-keyshortcuts="/" onClick={onClick}>
      <ReaIcon name="chat" />
      <span className="rea-lbl">Ask</span>
      <span className="rea-kbd" aria-hidden="true">
        /
      </span>
    </button>
  );
}

/** Phone menu: an "Ask our assistant" field above the links. `onPick` closes the menu first. */
export function MenuAsk({ onPick }: { onPick: () => void }) {
  if (!ASSISTANT_ON) return null;
  return (
    <button
      type="button"
      className="rea-menu-ask"
      onClick={() => {
        onPick();
        open("menu");
      }}
    >
      <Mark />
      <span>
        <b>Ask our assistant</b>
        <small>Prices, tools, setup. Instant answers.</small>
      </span>
      <ReaIcon name="arrow" />
    </button>
  );
}

/** Home ending: a third option beside WhatsApp and email, in the AI's indigo (never the booking red). */
export function HomeAsk() {
  if (!ASSISTANT_ON) return null;
  return (
    <button type="button" className="rea-entry-btn" onClick={() => open("home-ending")}>
      <ReaIcon name="chat" />
      Ask our assistant
    </button>
  );
}

/** Pricing (under the plan builder) and service pages (after the FAQ): a bar that looks like an input. */
export function AskBar({ title, sub, placeholder, starters, location }: { title: string; sub: string; placeholder: string; starters: readonly string[]; location: string }) {
  if (!ASSISTANT_ON) return null;
  return (
    <div className="rea-askbar rea-entry rv">
      <div className="rea-askbar-top">
        <Mark />
        <div>
          <h3>{title}</h3>
          <p>{sub}</p>
        </div>
      </div>
      <button type="button" className="rea-fake-input" onClick={() => open(location)}>
        <ReaIcon name="chat" />
        <span>{placeholder}</span>
        <span className="rea-send-dot">
          <ReaIcon name="send" />
        </span>
      </button>
      <div className="rea-starters">
        {starters.map((q) => (
          <button
            key={q}
            type="button"
            className="rea-chip"
            onClick={() => {
              open(location);
              void send(q);
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Contact: a third way to reach us, after WhatsApp and email. Classes come from the Contact page. */
export function ContactWay({ className, iconClassName }: { className: string; iconClassName: string }) {
  if (!ASSISTANT_ON) return null;
  return (
    <div className={`${className} rea-way rea-entry`}>
      <div className={`${iconClassName} rea-way-ico`}>
        <ReaIcon name="chat" />
      </div>
      <div>
        <h3>Our AI assistant</h3>
        <p>Instant answers, any hour. A person if you need one.</p>
      </div>
      <button type="button" className="rea-way-btn" onClick={() => open("contact")}>
        <ReaIcon name="chat" />
        Ask now
      </button>
    </div>
  );
}
