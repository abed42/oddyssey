import type { Signal } from "./types";

// Fresh signals the demo "detects" live, escalating buying intent. Each one is a
// strong, real-world trigger that the panel's lenses react to — so appending one
// and re-pricing visibly moves the odds. Ordered to escalate.
export const FRESH_SIGNALS: Signal[] = [
  {
    source: "x",
    claim:
      "VP Sales posted today: “we're ripping out our outbound stack this quarter”",
  },
  {
    source: "orange slice",
    claim:
      "3 buying-committee members visited pricing and booked a demo in the last 48h",
  },
  {
    source: "crunchbase",
    claim: "raised a fresh $75M round, announced this morning",
  },
];
