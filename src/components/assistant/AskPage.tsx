"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Eyebrow } from "@/components/ui/Chip";
import { GUARANTEE_DAYS } from "@/lib/pricing";
import { ReaIcon } from "./icons";
import { hydrate, open, setReferrer } from "./store";

const Panel = dynamic(() => import("./Panel"), { ssr: false, loading: () => <div className="rea-inline-wait" /> });

/** The /ask page body: intro on the left, the assistant inline on the right (stacked on phones). */
export function AskPage({ referrer, sender }: { referrer: string | null; sender: string | null }) {
  useEffect(() => {
    hydrate({ reopen: false });
    setReferrer(referrer);
    open(referrer ? `ask:${referrer}` : "ask");
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
            Live in {GUARANTEE_DAYS} days, or your first month is free
          </li>
          <li>
            <ReaIcon name="check" />
            Built in your own accounts. You own it all
          </li>
          <li>
            <ReaIcon name="check" />
            No lock-in: month to month
          </li>
        </ul>
      </div>
      <div className="rea-askpage-r">
        <Panel inline />
      </div>
    </div>
  );
}
