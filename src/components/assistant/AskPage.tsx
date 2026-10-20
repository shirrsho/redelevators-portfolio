"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Eyebrow } from "@/components/ui/Chip";
import { GUARANTEE_DAYS, GUARANTEE_DAYS_LONG } from "@/lib/pricing";
import { ReaIcon } from "./icons";
import { PanelBoundary } from "./PanelBoundary";
import { close, hydrate, open, setReferrer } from "./store";

const Panel = dynamic(() => import("./Panel"), { ssr: false, loading: () => <div className="rea-inline-wait" /> });

/** The /ask page body: intro on the left, the assistant inline on the right (stacked on phones). */
export function AskPage({ referrer, sender }: { referrer: string | null; sender: string | null }) {
  useEffect(() => {
    hydrate({ reopen: false });
    setReferrer(referrer);
    open(referrer ? `ask:${referrer}` : "ask");
    // The chat is inline here; leaving the page mustn't open it as a panel (a full sheet on phones) on the next one.
    return () => close();
  }, [referrer]);

  return (
    <div className="rea-askpage">
      <div className="rea-askpage-l">
        <Eyebrow>Ask Red Elevators</Eyebrow>
        <h1 className="d2">
          Ask anything about <em>your rentals</em>.
        </h1>
        <p className="lead">Prices, tools, timelines, what fits your setup. Answers come from what we’ve published, and a person is one tap away.</p>
        {sender ? (
          <div className="rea-sender">
            <span className="rea-avatar">{sender[0]}</span>
            <p>
              <b>{sender} from Red Elevators</b> sent you this link. Ask anything here; when you’re ready to talk, your chat goes with you.
            </p>
          </div>
        ) : null}
        <ul className="rea-promises">
          <li>
            <ReaIcon name="check" />
            Live in {GUARANTEE_DAYS} days ({GUARANTEE_DAYS_LONG} for websites and campaigns), or your first month is free
          </li>
          <li>
            <ReaIcon name="check" />
            Built in your own accounts. You own it all
          </li>
          <li>
            <ReaIcon name="check" />
            No lock-in: month to month (ads run 3 months minimum)
          </li>
        </ul>
      </div>
      <div className="rea-askpage-r">
        <PanelBoundary>
          <Panel inline />
        </PanelBoundary>
      </div>
    </div>
  );
}
