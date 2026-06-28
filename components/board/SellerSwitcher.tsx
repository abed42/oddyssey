"use client";

import { useState } from "react";
import { SELLER_ACCOUNTS } from "@/lib/peitho/sellers";
import { useActiveSeller } from "./SellerContext";
import { CompanyLogo } from "./CompanyLogo";

// The account dropdown — "who am I selling as." Switching re-frames the whole
// board: every prospect re-prices from that seller's ICP.
export function SellerSwitcher() {
  const { sellerId, setSellerId, seller } = useActiveSeller();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full px-2 py-1 text-base font-bold tracking-tight text-foreground transition hover:bg-muted"
      >
        <CompanyLogo logo={seller.logo} initials={seller.name.slice(0, 2)} className="h-5 w-5 rounded" />
        {seller.name}
        <span className="text-sm text-muted-foreground">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            {SELLER_ACCOUNTS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSellerId(s.id);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition hover:bg-muted ${
                  s.id === sellerId ? "bg-muted/60" : ""
                }`}
              >
                <CompanyLogo logo={s.logo} initials={s.name.slice(0, 2)} className="mt-0.5 h-7 w-7 rounded-md text-[10px]" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {s.name}
                    {s.id === sellerId && <span className="text-[10px] text-primary">● active</span>}
                  </div>
                  <div className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                    {s.sells}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
