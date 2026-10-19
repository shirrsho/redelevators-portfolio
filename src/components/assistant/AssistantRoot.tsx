"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ASSISTANT_ON } from "./config";
import { Mark, ReaIcon } from "./icons";
import { PanelBoundary } from "./PanelBoundary";
import { close, getState, hydrate, open, useAssistant } from "./store";

// Mounted once in src/app/layout.tsx when the assistant is on. Renders the phone ask bar, the "/"
// shortcut and, from the first open, the panel (its code loads on demand, so it costs nothing until then).
// The /ask page renders its own inline panel instead.

const Panel = dynamic(() => import("./Panel"), { ssr: false });

export function AssistantRoot() {
  const path = usePathname();
  const isOpen = useAssistant((s) => s.open);
  const [mounted, setMounted] = useState(false);
  const askPage = path === "/ask";

  // Restore this tab's chat after mount. Desktop reopens a panel that was open; a phone sheet would
  // cover the page on every reload, so phones start closed.
  useEffect(() => {
    if (ASSISTANT_ON) hydrate({ reopen: !matchMedia("(max-width:700px)").matches });
  }, []);

  // Load the panel once it's first wanted, then keep it (closing only hides it).
  if (isOpen && !mounted) setMounted(true);

  // "/" opens the assistant anywhere (not while typing); Escape closes it.
  useEffect(() => {
    if (!ASSISTANT_ON) return;
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const typing = !!el && (/^(input|textarea|select)$/i.test(el.tagName) || el.isContentEditable);
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey && path !== "/ask") {
        e.preventDefault();
        open("shortcut");
      } else if (e.key === "Escape" && getState().open) {
        close();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [path]);

  if (!ASSISTANT_ON || askPage) return null;
  return (
    <>
      <Dock />
      {mounted ? (
        <PanelBoundary>
          <Panel />
        </PanelBoundary>
      ) : null}
    </>
  );
}

/**
 * Phones: the bottom ask bar (decided 18 Oct; the header stays logo · Book · menu). It appears once you're
 * past the first screen, hides while you scroll down and comes back when you scroll up.
 */
function Dock() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let lastY = scrollY;
    const on = () => {
      const y = scrollY;
      if (y < 320) setShow(false);
      else if (y < lastY - 6) setShow(true);
      else if (y > lastY + 6) setShow(false);
      lastY = y;
    };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return (
    <button type="button" className={`rea-dock${show ? " show" : ""}`} aria-label="Ask our AI assistant" tabIndex={show ? 0 : -1} onClick={() => open("dock")}>
      <Mark />
      <span className="rea-dock-t">Ask about prices, tools, setup…</span>
      <span className="rea-send-dot">
        <ReaIcon name="send" />
      </span>
    </button>
  );
}
