import type { CSSProperties } from "react";
import { HANDLED, MORNING_SUMMARY, type StoryNotification } from "@/lib/story";
import { Notification } from "@/components/devices/Notification";
import { Icon } from "@/components/ui/Icon";
import { ToolLogo } from "@/components/ui/ToolLogo";

// Notification content for the story phone (home.js → tile(), hlBd(), setDone(), summary).

/** The app tile: brand colour + icon or mono tool logo (home.js tile()). */
export function tileOf(n: StoryNotification) {
  const icon = n.tile.icon ? <Icon name={n.tile.icon} /> : n.tile.logo ? <ToolLogo name={n.tile.logo} size={20} mono /> : null;
  return { icon, iconBg: n.tile.bg };
}

/** The body with the highlighted phrase wrapped in <mark> (home.js hlBd()). */
export function markBody(bd: string, hl?: string) {
  if (!hl) return bd;
  const i = bd.indexOf(hl);
  if (i < 0) return bd;
  return (
    <>
      {bd.slice(0, i)}
      <mark>{hl}</mark>
      {bd.slice(i + hl.length)}
    </>
  );
}

/** A story notification, open (app tile, body with highlight) or handled (mark tile, green). */
export function StoryNote({ n, hl, done = false, ...rest }: { n: StoryNotification; hl?: string; done?: boolean } & Pick<Parameters<typeof Notification>[0], "className" | "style" | "ref">) {
  return done ? (
    <Notification mark app={HANDLED.app} ago={HANDLED.ago} title={n.tt} body={n.done} {...rest} />
  ) : (
    <Notification {...tileOf(n)} app={n.app} ago={n.ago} title={n.tt} body={markBody(n.bd, hl)} {...rest} />
  );
}

/** The 7:30 "Nothing needs you" summary (four-line body). */
export function MorningNote({ className, style }: { className?: string; style?: CSSProperties }) {
  return <Notification mark app={MORNING_SUMMARY.app} ago={MORNING_SUMMARY.ago} title={MORNING_SUMMARY.tt} body={MORNING_SUMMARY.bd} className={className} style={style} />;
}
