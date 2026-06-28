# Oddyssey — demo runbook (5–7 min)

> Consensus prediction market for B2B purchase intent. Four frontier models price
> the same evidence under different lenses; the **disagreement is the signal**.
> Built on **Convex** (real-time, no polling), model fan-out via the **AI Gateway**,
> real company data via **Orange Slice**.

## Pre-flight (before you go up)
1. `npm run dev` is running; open **http://localhost:3000** in a real browser.
2. **Reset the demo state:** `bun Tools/reset-demo.ts` → hero (Decagon) is back at its tier-2 "before" state (Convex: **44% · personalize**).
3. Open two tabs: **`/ai-hackathon`** (cold open) and **`/`** (the board). Start on `/ai-hackathon`.
4. The board loads as **Convex** by default, **30 companies** across 5 industries, all priced for Convex / Cursor / Orange Slice. Real logos. Don't pre-click anything.
5. Two beats are **live** (~10–11s each): **Detect signal** and **Search-build**. That's narration time, not dead air — everything else is instant/cached.
6. *(Optional de-risk)* Pre-build one search company before you go up (e.g. type "Datadog" → let it land) so the finale is instant if you'd rather not wait live. The live build also works (~20s, model-enrichment fallback — never depends on OS credits).

---

## The arc

### 1 · Cold open — the hook (~90s) · tab `/ai-hackathon`
**Do:** Walk the 5 beats with `Next →`.
**Say:** "I almost didn't get into this hackathon. Found out late — then realized Orange Slice was running it, and I'd been on a call with their CEO a year ago. So I emailed Vihaar; he vouched, forwarded me to YC. They said they were full. I showed up in person anyway, reconnected — and here I am. **Every one of those moments shifted the odds.** That's a sales funnel. And that's exactly what Oddyssey prices — for every prospect in your pipeline."
> The story is deterministic — it can't stutter. The chart's four lines fan apart at beat 4 (the disagreement), resolve at beat 5.

### 2 · Pivot to the board · tab `/`
**Say:** "Every lead-scoring tool gives you a number. The score says 85 — now what? Oddyssey gives the **same evidence to a panel of models** — Claude, GPT, Gemini, Grok — each with a different analytical lens. When they agree, you're confident. **When they split, the disagreement tells you what to personalize.** And it's pricing from a specific seller's view — right now, **Convex.**"
**Do:** Gesture at the tiers (prioritize green / personalize amber / skip). Click an **industry tab** (e.g. **Fintech**) — "browse the pipeline by category, like a real market." Note the evidence is real — LinkedIn, Crunchbase, BuiltWith, news. Click **All** to return.

### 3 · The hero + detect — the mic-drop (~30s, ~11s live) · under Convex
**Do:** Click **"Will Decagon convert?"** → its **market page** opens (tier-2, **PERSONALIZE**, contested, ±41 spread). Point at the per-model votes — each cites the exact evidence it used.
**Say:** "Decagon — the models are **split**. This is a maybe. Watch what happens when a signal lands."
**Do:** In the right panel, click **📡 Detect new signal**. The odds + chart + verdict **skeleton out and re-price live** (~11s).
**Say:** "Their **VP of Engineering just posted they're evaluating a new platform this quarter.** The panel re-prices, live, on real-time Convex…" → **Decagon jumps to 84% · PRIORITIZE · panel agrees.** "The odds moved, the spread tightened from ±41 to ±20, and every model now cites that signal. **Personalize → prioritize**, in real time."

### 4 · The seller switch — the breadth wow (~20s)
**Do:** Click **← Back to the board**. Click **`Convex ▾`** next to the logo → pick **Cursor**.
**Say:** "Same companies — but now I'm selling **Cursor**, an AI code editor for every engineering team. Watch the board re-price from *Cursor's* ICP." → the board lights up green: Perplexity, Linear, Sierra, Dub, the dev-tools all → **PRIORITIZE.** "Convex is picky — greenfield app builders, so fintech and SaaS mostly skip. Cursor wants every eng team. **The same prospect is worth different amounts to different sellers** — and the panel knows why."

### 5 · Search-build — the finale (~30s, ~20s live)
**Do:** In the **Search any company** bar, type a company that's *not* on the board (e.g. **Datadog**, or take an audience suggestion) → Enter.
**Say:** "And it's not a fixed list. Name **any** company — Orange Slice pulls the data, the panel builds and prices a brand-new market, live…" → it routes to that company's **market page**, fully priced, with the per-model votes and the action.
**Say:** "From a name to a priced, sourced, actionable market in seconds. That's the whole pipeline — on demand."

### 6 · Land it / close (~20s)
**Say:** "It never shows a number without an action. Tier 1 — close these. Tier 2 — personalize around the contested signal. Tier 3 — skip. **Everything is sales** — a deal, a hire, getting into a hackathon. Oddyssey prices the one case businesses pay for: will this prospect buy. Built on **Convex** for real-time, a **panel of frontier models** doing the betting, on **real company data**."

---

## Q&A armor
- **"Isn't this just lead scoring?"** → Category's crowded; the *mechanic* isn't. Model-consensus where disagreement becomes the confidence signal and tells you *what* to personalize. No crowd-price tool shows inter-model spread.
- **"Is the disagreement real signal?"** → It's a triage/attention tool, not an oracle. Different lenses (later, different live tools) → the spread flags where evidence is ambiguous, and *what* is contested.
- **"Where does the data come from?"** → **Orange Slice** for live company enrichment — LinkedIn, Crunchbase, BuiltWith, PredictLeads news. When its credits are out, a model-enrichment fallback keeps the build working, so a demo never stalls.
- **"How is it real-time?"** → **Convex**. One reactive subscription; each model writes its bet as it lands and the board animates — zero polling.
- **"How do you know the odds are right?"** → Calibrated model opinions grounded in cited evidence, not a backtest. The value is the ranking + the spread, not a guarantee.
- **"Now what?"** → Every deal terminates in prioritize / personalize / skip. The tiers ARE the workflow.

## Reset between runs
`bun Tools/reset-demo.ts` (puts Decagon back to tier-2, Convex 44% personalize). Then refresh the board tab and switch the seller back to **Convex**. Remove any test market you search-built with `npx convex run deals:removeDeal '{"dealId":"<id>"}'`.

## If something breaks
- Board empty / wrong seller → refresh `/`, confirm the seller is **Convex**.
- Detect or search-build hangs >25s → it settles; skeletons mean it's working. Detect is idempotent (click again). The story tab (`/ai-hackathon`) is fully scripted and always works as a fallback.
- A logo shows initials instead of an image → harmless (logo.dev had no match); the rest render fine.
