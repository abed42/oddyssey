"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useActiveSeller } from "./SellerContext";

// The live signal-detection moment: re-enrich the company through Orange Slice,
// detect a genuinely-new signal, append it, re-price — the board's odds move on
// real, just-detected evidence (with a curated fallback so it never stutters).
export function DetectSignal({ dealId }: { dealId: string }) {
  const detectSignal = useAction(api.engine.detectSignal);
  const { sellerId } = useActiveSeller();
  const [busy, setBusy] = useState(false);
  const [dry, setDry] = useState(false);

  async function detect() {
    if (busy || dry) return;
    setBusy(true);
    try {
      const res = await detectSignal({ dealId, sellerId });
      if (!res.detected || res.detected.length === 0) setDry(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={detect}
      disabled={busy || dry}
      className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-50"
    >
      {busy ? (
        <>
          <span className="h-2 w-2 animate-ping rounded-full bg-amber-400" />
          Detecting + re-pricing…
        </>
      ) : dry ? (
        "No new signal"
      ) : (
        <>📡 Detect new signal</>
      )}
    </button>
  );
}
