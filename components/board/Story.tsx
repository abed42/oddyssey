"use client";

import { useEffect, useState } from "react";
import { assembleDeal } from "@/lib/peitho/derive";
import { STORY_BEATS, STORY_PROSPECT } from "@/lib/peitho/story";
import { ALL_MODELS } from "@/lib/peitho/config";
import { ACTION_DISPLAY, TIER_DISPLAY, actionLine } from "@/lib/peitho/display";
import { ModelBets } from "./ModelBets";
import { OddsChart } from "./OddsChart";

// A big speedometer arc — the SAME shape as the ticker's MiniSpeedo, scaled up,
// with a smooth dash-fill so the odds visibly climb as you advance the story.
function StorySpeedo({ value, accent }: { value: number; accent: string }) {
  const w = 210;
  const h = 122;
  const r = 92;
  const cx = w / 2;
  const cy = h - 16;
  const sw = 13;
  const pt = (v: number) => {
    const a = Math.PI * (1 - Math.max(0, Math.min(100, v)) / 100);
    return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
  };
  const a0 = pt(0);
  const a1 = pt(100);
  const full = `M ${a0.x.toFixed(1)} ${a0.y.toFixed(1)} A ${r} ${r} 0 0 1 ${a1.x.toFixed(1)} ${a1.y.toFixed(1)}`;
  const L = Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <path d={full} fill="none" stroke="currentColor" className="text-muted-foreground/15" strokeWidth={sw} strokeLinecap="round" />
        <path
          d={full}
          fill="none"
          stroke={accent}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - v / 100)}
          style={{ transition: "stroke-dashoffset .7s cubic-bezier(.22,1,.36,1), stroke .4s ease" }}
        />
      </svg>
      <div className="absolute inset-x-0 flex flex-col items-center" style={{ bottom: 6 }}>
        <span className="font-heading text-5xl font-bold leading-none tabular-nums" style={{ color: accent }}>
          {value}
          <span className="align-top text-2xl">%</span>
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          consensus
        </span>
      </div>
    </div>
  );
}

// The opening beat's "1%" bar — a sliver of odds under a sweeping loading shimmer.
function LoadingOddsBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div>
      <div className="relative h-10 overflow-hidden rounded-xl bg-destructive/15 ring-1 ring-border">
        <div
          className="h-full rounded-l-xl transition-all duration-700"
          style={{ width: `${Math.max(value, 1.5)}%`, background: accent }}
        />
        <div className="story-shimmer pointer-events-none absolute inset-0" />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-muted-foreground">
        <span style={{ color: accent }}>Yes {value}%</span>
        <span className="animate-pulse uppercase tracking-wider">consensus forming…</span>
        <span>No {100 - value}%</span>
      </div>
    </div>
  );
}

export function Story({ onPivot }: { onPivot?: () => void }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const beat = STORY_BEATS[i];
  const last = i === STORY_BEATS.length - 1;

  const go = (n: number) => {
    const t = Math.max(0, Math.min(STORY_BEATS.length - 1, n));
    if (t === i) return;
    setDir(t > i ? 1 : -1);
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

  // Real per-beat trajectories: each model's price across the beats so far.
  const series = ALL_MODELS.map((m) => ({
    model: m,
    points: STORY_BEATS.slice(0, i + 1).map(
      (bt) => bt.bets.find((b) => b.model === m)?.price ?? 0,
    ),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <style>{`
        @keyframes storyInR { from { opacity:0; transform: translateX(34px) } to { opacity:1; transform:none } }
        @keyframes storyInL { from { opacity:0; transform: translateX(-34px) } to { opacity:1; transform:none } }
        @keyframes storyShimmer { from { transform: translateX(-120%) } to { transform: translateX(220%) } }
        .story-shimmer { background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%); animation: storyShimmer 1.6s ease-in-out infinite; }
      `}</style>

      <div className="mb-5 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Cold open · priced like a live market
        </p>
        <h2 className="mt-1 font-heading text-xl font-semibold text-foreground">
          {STORY_PROSPECT.name}
        </h2>
      </div>

      {/* beat progress */}
      <div className="mb-5 flex items-center justify-center gap-2">
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

      <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-card to-card/40 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_18px_40px_-22px_rgba(0,0,0,0.8)]">
        <div
          key={i}
          style={{ animation: `${dir > 0 ? "storyInR" : "storyInL"} .4s cubic-bezier(.22,1,.36,1)` }}
        >
          {/* headline + speedometer */}
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                Beat {i + 1} · {beat.title}
              </div>
              <p className="mt-2 text-lg leading-relaxed text-foreground">{beat.narration}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                spread <span className="tabular-nums">{deal.spread}</span> · {tier.blurb}
              </p>
            </div>
            <StorySpeedo value={deal.consensus} accent={tier.accent} />
          </div>

          {/* media: 1% loading bar OR an email screenshot */}
          {beat.media?.loadingBar && (
            <div className="mt-5">
              <LoadingOddsBar value={deal.consensus} accent={tier.accent} />
            </div>
          )}
          {beat.media?.image && (
            <figure className="mt-5 overflow-hidden rounded-xl border border-border bg-background/60 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={beat.media.image}
                alt={beat.media.alt ?? ""}
                className="mx-auto max-h-[240px] w-full rounded-lg object-contain"
              />
            </figure>
          )}

          {/* the four lenses */}
          <div className="mt-5">
            <ModelBets bets={deal.bets} />
          </div>

          {/* the rising-odds trajectory */}
          <div className="mt-5">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Odds across the story — four lenses, live
            </div>
            <OddsChart series={series} consensus={deal.consensus} />
          </div>

          {/* the action this beat implies */}
          <div className={`mt-4 flex items-center gap-3 rounded-xl px-4 py-3 ring-1 ${action.tone} ${action.ring}`}>
            <span className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide ${action.text}`}>
              {action.label}
            </span>
            <span className="text-sm text-foreground">{actionLine(deal)}</span>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
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
