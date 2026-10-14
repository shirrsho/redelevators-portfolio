import { PAGE_BG } from "@/lib/site";

/**
 * Sets the page's base colour (--bg, which <html> paints under the Aurora fields). Each mockup
 * page fixes it in a :root rule; render this once per page. Rendered in place (not hoisted) so
 * it goes away when the page does. The homepage paints <html>'s background colour over it
 * itself and must clear that inline value on unmount.
 */
export function PageBg({ tone }: { tone: keyof typeof PAGE_BG }) {
  return <style>{`:root{--bg:${PAGE_BG[tone]}}`}</style>;
}
