"use client";

import { motion } from "motion/react";
import type { Deal } from "@/lib/peitho/types";
import { CompanyLogo } from "./CompanyLogo";

// A decorative hero: the companies orbit along a big circle whose center sits
// below the card, so only the top arc shows — a slow, continuous ring of logos
// (with their odds) drifting over the title, like the World Cup odds card.
const ITEMS = 24; // ring density (cycled from the available companies)
const RADIUS = 560; // px
const CENTER_Y = 580; // px below the card top → only the top cap is visible

export function OddsHero({ deals }: { deals: Deal[] }) {
  if (deals.length === 0) return null;
  const ring = Array.from({ length: ITEMS }, (_, i) => deals[i % deals.length]);

  return (
    <div className="relative mb-6 h-[280px] overflow-hidden rounded-2xl border border-border bg-card">
      {/* orbiting ring of companies */}
      <motion.div
        className="absolute left-1/2 h-0 w-0"
        style={{ top: CENTER_Y }}
        animate={{ rotate: 360 }}
        transition={{ duration: 70, ease: "linear", repeat: Infinity }}
      >
        {ring.map((d, i) => {
          const angle = (i / ITEMS) * 360;
          return (
            <div
              key={i}
              className="absolute left-0 top-0"
              style={{
                transform: `rotate(${angle}deg) translateY(-${RADIUS}px) translate(-50%, -50%)`,
              }}
            >
              <div className="flex flex-col items-center">
                <CompanyLogo
                  logo={d.logo}
                  initials={d.initials}
                  className="h-11 w-11 rounded-xl shadow-lg ring-1 ring-black/20"
                />
                <span className="mt-1 text-xs font-semibold text-muted-foreground">
                  {d.consensus}%
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* legibility wash under the title */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

      {/* title */}
      <div className="absolute bottom-6 left-7 z-10">
        <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Pipeline
          <br />
          Odds &amp; Predictions
        </h2>
      </div>
    </div>
  );
}
