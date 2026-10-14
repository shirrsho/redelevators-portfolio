// The Systems hero's live control room. Ported unchanged from redesign-mockups/r3/systems.html (CR).
// Index-aligned with SERVICES. Numbers are illustrative and labelled so in the UI.
// Counters start from these values and tick after mount (never during render: hydration).

/** [start value, label, ticks (1 = this counter goes up every 2.6s, 0 = static), feed line]. */
export type ControlRoomRow = readonly [value: number | string, label: string, ticks: 0 | 1, feed: string];

export const CR: readonly ControlRoomRow[] = [
  [23,"replies today",1,"Maria asked about early check-in → answered in 4s"],
  [9,"answered tonight",1,"Parking question at 11:40pm → answered, late checkout sold"],
  [2,"direct this week",1,"Sofia booked 3 nights direct → $0 commission"],
  [3,"guides this month",0,"Spring guide published at 9:00"],
  ["$19","per booking",0,"Budget moved to “Midweek escape”"],
  [14,"formats ready",1,"Spring set approved in one tap"],
  [0,"double bookings",0,"Oct 18–20 blocked on your site"],
  [126,"bookings tracked",1,"Leak found at the payment step"],
];

/** Interval between ticks, in ms. */
export const CR_TICK_MS = 2600;
