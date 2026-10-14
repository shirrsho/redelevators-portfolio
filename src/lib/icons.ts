// Line icon set (24px grid, 1.6px stroke), ported unchanged from redesign-mockups/r3/icons.js.
// Render with <Icon name="…" /> (src/components/ui/Icon.tsx). Inner SVG markup, trusted and static.
export const ICONS = {
  message: "<path d=\"M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z\"/><path d=\"M8 10h8M8 13h5\"/>",
  assistant: "<path d=\"M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z\"/><path d=\"M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z\"/>",
  direct: "<path d=\"M3 11l9-7 9 7\"/><path d=\"M5 10v10h14V10\"/><path d=\"M10 20v-5h4v5\"/>",
  content: "<path d=\"M6 3h9l4 4v14H6z\"/><path d=\"M15 3v4h4M9 12h7M9 15h7M9 18h4\"/>",
  social: "<path d=\"M3 10v4h3l7 4V6l-7 4z\"/><path d=\"M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11\"/>",
  camera: "<path d=\"M4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z\"/><circle cx=\"12\" cy=\"13\" r=\"3.6\"/>",
  website: "<rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 8.5h18M6.5 6.2h.01M9 6.2h.01\"/><path d=\"M7 12h6M7 15h10\"/>",
  funnel: "<path d=\"M3 4h18l-7 8v6l-4 2v-8z\"/>",
  calendar: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/><path d=\"M8 14h3v3H8z\"/>",
  clean: "<path d=\"M14 4l6 6-8.5 8.5a2 2 0 0 1-2.8 0L5.5 15.3a2 2 0 0 1 0-2.8z\"/><path d=\"M4 20h7\"/>",
  price: "<path d=\"M3 17l5-5 4 3 7-8\"/><path d=\"M15 7h4v4\"/>",
  review: "<path d=\"M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.9z\"/>",
  payment: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3 10h18M7 15h4\"/>",
  key: "<circle cx=\"8\" cy=\"15\" r=\"4\"/><path d=\"M11 12l9-9M17 6l2 2M15 8l2 2\"/>",
  mail: "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3 7l9 6 9-6\"/>",
  check: "<path d=\"M5 12.5l4.5 4.5L19 7.5\"/>",
  alert: "<path d=\"M12 4l9 16H3z\"/><path d=\"M12 10v4M12 17h.01\"/>",
  moon: "<path d=\"M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z\"/>",
  sun: "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/>",
  audit: "<circle cx=\"11\" cy=\"11\" r=\"6.5\"/><path d=\"M20 20l-4.3-4.3M8.5 11h5M11 8.5v5\"/>",
  design: "<path d=\"M4 20l4-1 11-11-3-3L5 16z\"/><path d=\"M14 6l3 3\"/>",
  build: "<rect x=\"3\" y=\"13\" width=\"8\" height=\"8\" rx=\"1\"/><rect x=\"13\" y=\"13\" width=\"8\" height=\"8\" rx=\"1\"/><rect x=\"8\" y=\"3\" width=\"8\" height=\"8\" rx=\"1\"/>",
  run: "<path d=\"M20 12a8 8 0 1 1-2.3-5.6\"/><path d=\"M20 4v4h-4\"/>",
  guest: "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21a8 8 0 0 1 16 0\"/>",
  bolt: "<path d=\"M13 2L4 14h7l-1 8 9-12h-7z\"/>",
  lock: "<rect x=\"4\" y=\"10\" width=\"16\" height=\"11\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3\"/>",
  arrow: "<path d=\"M4 12h15M14 6l6 6-6 6\"/>",
  clock: "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M12 7.5V12l3 2\"/>",
} as const;

export type IconName = keyof typeof ICONS;
