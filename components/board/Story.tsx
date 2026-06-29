"use client";

import { useEffect, useState } from "react";
import { assembleDeal } from "@/lib/peitho/derive";
import { STORY_BEATS, STORY_PROSPECT } from "@/lib/peitho/story";
import { ACTION_DISPLAY, TIER_DISPLAY, actionLine } from "@/lib/peitho/display";

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

// The opening beat's "1%" odds bar — plain and static.
function PlainOddsBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div>
      <div className="flex h-9 overflow-hidden rounded-xl ring-1 ring-border">
        <div style={{ width: `${Math.max(value, 2)}%`, background: accent, transition: "width .6s ease, background .5s ease" }} />
        <div className="flex-1 bg-destructive/20" />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-muted-foreground">
        <span style={{ color: accent }}>Yes {value}%</span>
        <span>No {100 - value}%</span>
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
        className="mx-auto max-h-[300px] w-full rounded-lg object-contain"
      />
    </figure>
  );
}

export function Story({ onPivot }: { onPivot?: () => void }) {
  const [i, setI] = useState(0);
  const [pulse, setPulse] = useState<"up" | "down" | null>(null);
  const beat = STORY_BEATS[i];
  const last = i === STORY_BEATS.length - 1;

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
      if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
  const action = ACTION_DISPLAY[deal.action];
  const dirColor = pulse === "up" ? UP : DOWN;

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-5 sm:px-8">
      <div className="mb-4 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Cold open · priced like a live market
        </p>
        <h2 className="mt-1 font-heading text-xl font-semibold text-foreground">
          {STORY_PROSPECT.name}
        </h2>
      </div>

      {/* beat progress */}
      <div className="mb-4 flex items-center justify-center gap-2">
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

      {/* the card — same size for every beat, almost full-screen */}
      <div className="flex min-h-[70vh] w-full flex-col justify-center rounded-3xl border border-border/80 bg-gradient-to-b from-card to-card/40 px-6 py-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_18px_40px_-22px_rgba(0,0,0,0.8)] sm:px-12">
        <div className="flex flex-col items-center text-center">
          <p className="mx-auto max-w-3xl text-balance text-2xl leading-relaxed text-foreground sm:text-3xl">
            {beat.narration}
          </p>

          {/* the centerpiece — the odds gauge */}
          <div className="mt-8">
            <StorySpeedo value={deal.consensus} color={dirColor} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            spread <span className="tabular-nums">{deal.spread}</span> · {tier.blurb}
          </p>

          {/* proof: the 1% bar OR a screenshot */}
          {beat.media?.loadingBar && (
            <div className="mx-auto mt-7 w-full max-w-xl">
              <PlainOddsBar value={deal.consensus} accent={dirColor} />
            </div>
          )}
          {beat.media?.image && (
            <div className="mx-auto mt-7 w-full max-w-xl">
              <StoryImage key={beat.media.image} src={beat.media.image} alt={beat.media.alt ?? ""} />
            </div>
          )}

          {/* the action this beat implies */}
          <div className={`mx-auto mt-7 flex w-full max-w-xl items-center gap-3 rounded-xl px-4 py-3 ring-1 ${action.tone} ${action.ring}`}>
            <span className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide ${action.text}`}>
              {action.label}
            </span>
            <span className="text-left text-sm text-foreground">{actionLine(deal)}</span>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={() => go(i - 1)}
          disabled={i === 0}
          className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition hover:bg-muted disabled:opacity-40"
        >
          ← Back
        </button>
        {!last ? (
          <button
            onClick={() => go(i + 1)}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onPivot}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
          >
            Pivot to the board →
          </button>
        )}
        <button
          onClick={() => go(0)}
          className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted"
        >
          Restart
        </button>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Use ← → arrow keys to navigate
      </p>
    </div>
  );
}
