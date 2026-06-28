"use client";

import { motion } from "motion/react";
import { modelDisplay } from "@/lib/peitho/display";
import { ModelGlyph } from "@/lib/peitho/modelIcons";
import { EASE_OUT } from "@/lib/ease";
import { AnimatedNumber, fmtPct } from "@/components/AnimatedNumber";

// One model's row in the AI-consensus block — the bettor, their lobehub avatar,
// the model version it's running, price bar and price. The panel's top bet is
// shown at full opacity.
export function ModelBar({
  model,
  price,
  isMax,
}: {
  model: string;
  price: number | null;
  isMax: boolean;
}) {
  const { color, version } = modelDisplay(model);
  return (
    <div className="flex items-center gap-2">
      <ModelGlyph model={model} size={18} />
      <span
        className="w-[74px] shrink-0 truncate font-mono text-[10px] font-bold"
        style={{ color }}
        title={version}
      >
        {version}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        {price !== null && (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color, opacity: isMax ? 1 : 0.6 }}
            initial={{ width: "0%" }}
            animate={{ width: `${price}%` }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
          />
        )}
      </div>
      <span
        className="w-9 shrink-0 text-right font-mono text-[11px] font-bold tabular-nums"
        style={{ color: price !== null ? color : undefined }}
      >
        {price !== null ? <AnimatedNumber value={price} format={fmtPct} /> : "—"}
      </span>
    </div>
  );
}
