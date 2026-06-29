"use client";

import { useEffect, useState } from "react";
import { assembleDeal } from "@/lib/peitho/derive";
import { STORY_BEATS, STORY_PROSPECT } from "@/lib/peitho/story";
import { TIER_DISPLAY } from "@/lib/peitho/display";

const UP = "#22c55e";
const DOWN = "#ef4444";

// A big speedometer arc — the ticker's MiniSpeedo shape, scaled up. The number
// counts up/down and the arc fills smoothly; both are tinted green when the odds
// rose and red when they fell.
function StorySpeedo({ value, color }: { value: number; color: string }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const from = shown;
    if (from === value) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 700);
      const e = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(from + (value - from) * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const w = 300;
  const h = 172;
  const r = 132;
  const cx = w / 2;
  const cy = h - 22;
  const sw = 17;
  const pt = (vv: number) => {
    const a = Math.PI * (1 - Math.max(0, Math.min(100, vv)) / 100);
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  };
  const a0 = pt(0);
  const a1 = pt(100);
  const full = `M ${a0.x.toFixed(1)} ${a0.y.toFixed(1)} A ${r} ${r} 0 0 1 ${a1.x.toFixed(1)} ${a1.y.toFixed(1)}`;
  const L = Math.PI * r;
  const v = Math.max(0, Math.min(100, shown));
  return (
    <div className="relative" style={{ width: w, height: h }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <path d={full} fill="none" stroke="currentColor" className="text-muted-foreground/15" strokeWidth={sw} strokeLinecap="round" />
        <path
          d={full}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - v / 100)}
          style={{ transition: "stroke .5s ease" }}
        />
      </svg>
      <div className="absolute inset-x-0 flex flex-col items-center" style={{ bottom: 10 }}>
        <span
          className="font-heading text-7xl font-bold leading-none tabular-nums"
          style={{ color, transition: "color .5s ease" }}
        >
          {shown}
          <span className="align-top text-3xl">%</span>
        </span>
        <span className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          consensus
        </span>
      </div>
    </div>
  );
}

// A story screenshot that renders nothing if the file isn't present yet.
function StoryImage({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  if (err) return null;
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-background/60 p-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setErr(true)}
        className="mx-auto max-h-[500px] w-auto rounded-lg object-contain"
      />
    </figure>
  );
}

export function Story({ onPivot }: { onPivot?: () => void }) {
  const [i, setI] = useState(0);
  const [pulse, setPulse] = useState<"up" | "down" | null>(null);
  const beat = STORY_BEATS[i];

  const consensusOf = (idx: number) => {
    const bs = STORY_BEATS[idx].bets;
    return Math.round(bs.reduce((s, b) => s + b.price, 0) / bs.length);
  };

  const go = (n: number) => {
    const t = Math.max(0, Math.min(STORY_BEATS.length - 1, n));
    if (t === i) return;
    setPulse(consensusOf(t) - consensusOf(i) >= 0 ? "up" : "down");
    setI(t);
  };

  // Arrow-key navigation — left/right step the carousel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (i >= STORY_BEATS.length - 1) onPivot?.();
        else go(i + 1);
      } else if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  // Derived with the SAME pure function the live engine uses.
  const deal = assembleDeal({
    id: "story",
    name: STORY_PROSPECT.name,
    initials: STORY_PROSPECT.initials,
    dossier: { summary: beat.narration, signals: [] },
    bets: beat.bets,
    status: "settled",
  });
  const tier = TIER_DISPLAY[deal.tier];
  const dirColor = pulse === "up" ? UP : DOWN;

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-4 pt-2 sm:px-8">
      {/* the card — FIXED height + fixed-height bands so nothing jumps between beats */}
      <div className="flex h-[90vh] min-h-[940px] w-full flex-col justify-start rounded-3xl border border-border/80 bg-gradient-to-b from-card to-card/40 px-6 pb-6 pt-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_18px_40px_-22px_rgba(0,0,0,0.8)] sm:px-12">
        <div className="flex flex-col items-center text-center">
          {/* signal badge — fixed slot so it never shifts the layout */}
          <div className="flex h-[30px] items-center justify-center">
            {beat.signal && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary ring-1 ring-primary/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Signal detected
              </span>
            )}
          </div>

          {/* narration — fixed band, vertically centered */}
          <div className="flex h-[108px] items-center justify-center">
            <p className="mx-auto max-w-2xl text-balance text-xl leading-snug text-foreground sm:text-2xl">
              {beat.narration}
            </p>
          </div>

          {/* the centerpiece — the odds gauge (always the same spot) */}
          <div className="mt-3">
            <StorySpeedo value={deal.consensus} color={dirColor} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            spread <span className="tabular-nums">{deal.spread}</span> · {tier.blurb}
          </p>

          {/* media — fixed reserved area; empty beats hold the same space */}
          <div className="mt-6 flex h-[520px] w-full max-w-4xl items-center justify-center">
            {beat.media?.image && (
              <StoryImage key={beat.media.image} src={beat.media.image} alt={beat.media.alt ?? ""} />
            )}
          </div>
        </div>
      </div>

      {/* beat progress — at the bottom */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {STORY_BEATS.map((b, idx) => (
          <button
            key={idx}
            onClick={() => go(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? "w-8 bg-primary" : idx < i ? "w-4 bg-muted-foreground" : "w-4 bg-muted"
            }`}
            title={b.title}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Use ← → arrow keys to navigate
      </p>
    </div>
  );
}
