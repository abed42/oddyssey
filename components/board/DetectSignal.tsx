"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FRESH_SIGNALS } from "@/lib/peitho/signals";
import { useActiveSeller } from "./SellerContext";

// The signal-detection moment: detect a fresh signal → append to the dossier →
// re-price the panel → the board's odds move live (via the Convex subscription).
export function DetectSignal({ dealId }: { dealId: string }) {
  const addSignal = useMutation(api.deals.addSignal);
  const priceDeal = useAction(api.engine.priceDeal);
  const { sellerId } = useActiveSeller();
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const done = i >= FRESH_SIGNALS.length;

  async function detect() {
    if (done || busy) return;
    setBusy(true);
    try {
      await addSignal({ dealId, signal: FRESH_SIGNALS[i] });
      setI((n) => n + 1);
      await priceDeal({ dealId, force: true, sellerId }); // re-price on the new evidence
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={detect}
      disabled={busy || done}
      className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
    >
      {busy ? (
        <>
          <span className="h-2 w-2 animate-ping rounded-full bg-amber-400" />
          Signal detected — panel re-pricing…
        </>
      ) : done ? (
        "All signals in"
      ) : (
        <>📡 Detect new signal</>
      )}
    </button>
  );
}
