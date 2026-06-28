# Panel voting rubric (v2) — calibrated, evidence-grounded, with examples

> Drop-in replacement guidance for `lib/peitho/prompt.ts`. Same `ModelBet` output
> (`price` 0-100, `confidence` 0-1, `rationale`, `signalsUsed`). Goal: make the
> four prices **calibrated and comparable** so that `spread` is real signal, not
> prompt noise. Every model gets the IDENTICAL dossier + seller context; only the
> lens differs.

---

## 1. Shared price scale (0-100) — anchor every model to this

`price` = **prioritization probability**: how worth pursuing this account is,
combining ICP fit + building readiness (NOT just "are they shopping right now").

| Band | Meaning | Typical evidence |
|---|---|---|
| **85-100** | Drop everything | Strong ICP fit **+ an active buying trigger** (in-market, evaluating vendors, budget freed) |
| **65-84** | Strong — work it now | Strong fit **+ momentum** (hiring eng, modern/real-time stack, fresh funding to build) — even with no explicit in-market trigger |
| **45-64** | Real but unproven | Decent fit, mixed/ambiguous momentum, or thin evidence |
| **35-44** | Marginal | Weak fit OR fit with active counter-signals |
| **<35** | Skip | Wrong segment, too large/legacy to switch, no building signals |

**Calibration rules (all models):**
- Don't be timidly conservative; don't anchor on round numbers (70, 50).
- Fit **plus** momentum is a real opportunity → 65-85, not 50.
- Reserve 85+ for fit **plus** a live trigger.
- **Honest disagreement is the product** — do NOT converge toward the others.

## 2. Confidence scale (0.0-1.0) — how well evidence supports YOUR price

| Confidence | When |
|---|---|
| **0.8-1.0** | Multiple concrete, recent, lens-relevant signals in the dossier |
| **0.5-0.7** | Some relevant evidence, but gaps or staleness |
| **0.2-0.4** | Thin dossier; pricing mostly on the summary |
| **0.0-0.1** | Essentially no evidence for your lens (price is a prior, say so) |

Confidence is about **evidence strength, not how high the price is.** A confident
*skip* is 0.9 confidence on a low price.

## 3. Per-lens criteria (what each model weights)

Each model still scores the SAME 0-100 prioritization question — the lens is
*which evidence dominates its read* and *what it's expert at spotting*.

### Claude — firmographic fit + strategic reasoning
- **Up:** ICP segment match, company size/stage fit, stack compatibility, a
  strategic reason the product is a fit, **warm path (ex-seller employees / shared
  investor lowers acquisition risk)**.
- **Down:** wrong segment, too large/legacy to switch, competitor/builds-it-themselves.
- Failure mode to avoid: over-weighting brand-name prestige over actual fit.

### GPT — timing / buying triggers
- **Up:** recent funding (budget), leadership change, evaluating-vendors signal,
  pricing-page visits, contract-renewal windows, **a warm intro that compresses
  the sales cycle**.
- **Down:** no trigger, just-raised-but-no-spend-yet, long-dormant account.
- Failure mode: treating any funding as a trigger — funding ≠ in-market.

### Gemini — growth signals
- **Up:** eng hiring (esp. relevant roles), headcount expansion, new products,
  geographic expansion, infra/real-time build-out.
- **Down:** flat/declining headcount, layoffs, no building activity.
- Failure mode: confusing size with growth — big ≠ growing.

### Grok — live market / social signal; skeptical by default
- **Up:** concrete recent news/launches, public commentary, momentum in the wild.
- **Down / explicit:** **if there's no live signal, say so and stay low-confidence.**
  Do not manufacture a read from nothing.
- Failure mode: hype-following; Grok's job is the skeptic.

## 4. Output contract (unchanged)
- `price`: 0-100 per §1.
- `confidence`: 0.0-1.0 per §2.
- `rationale`: ONE line naming your strongest **positive** and **negative**
  factor — e.g. `"Strong: fresh Series A + eng hiring; Weak: no real-time signal"`.
- `signalsUsed`: the EXACT dossier claim strings you leaned on. Cite real
  evidence; `[]` only if genuinely nothing applied.

---

## 5. Worked examples (dossier → 4 votes → consensus/spread/tier)

### Example A — Strong fit + trigger → **tight, high → Tier 1 (Prioritize)**
**Prospect:** mid-size dev-tools co; signals: *raised $40M Series B (2 mo ago)*,
*hiring 6 platform engineers*, *modern Next.js/real-time stack*, *evaluating
observability vendors*.

| Model | price | conf | rationale |
|---|---|---|---|
| Claude | 82 | 0.85 | Strong: textbook ICP + modern stack; Weak: none material |
| GPT | 86 | 0.8 | Strong: fresh Series B + active vendor eval; Weak: spend unproven |
| Gemini | 80 | 0.8 | Strong: 6 platform eng reqs = build mode; Weak: — |
| Grok | 74 | 0.5 | Strong: funding press; Weak: no other live chatter (skeptical) |

→ consensus **80** · spread **12 (tight)** · **Tier 1 — prioritize.**

### Example B — Poor fit → **tight, low → Tier 3 (Skip)**
**Prospect:** 12k-employee legacy insurer; signals: *no eng hiring*, *mainframe
stack*, *no funding/news*.

| Model | price | conf | rationale |
|---|---|---|---|
| Claude | 22 | 0.8 | Strong: none; Weak: wrong segment, too large/legacy to switch |
| GPT | 25 | 0.7 | Strong: none; Weak: no trigger, no in-market signal |
| Gemini | 20 | 0.8 | Strong: none; Weak: flat headcount, no build activity |
| Grok | 24 | 0.7 | Strong: none; Weak: zero live signal — skip |

→ consensus **23** · spread **5 (tight)** · **Tier 3 — skip.**

### Example C — Contested → **WIDE → Tier 2 (Personalize around the split)**
**Prospect:** fast-growing AI app co; signals: *raised $200M Series A*, *1,127
employees*, *builds its own app-generation platform*, *Software Development
industry*. (This is the Lovable-style case.)

| Model | price | conf | rationale |
|---|---|---|---|
| GPT | 73 | 0.6 | Strong: huge raise + product-speed culture; Weak: no real-time/TS hiring signal |
| Gemini | 78 | 0.6 | Strong: hyper-growth headcount; Weak: no explicit funding-use signal |
| Grok | 76 | 0.5 | Strong: AI-native + budget to build fast; Weak: 1k+ org = legacy inertia |
| Claude | 18 | 0.7 | Strong: stack/culture fit; **Weak: they BUILD their own backend — likely a competitor, not a buyer** |

→ consensus **61** · spread **60 (wide)** · **Tier 2 — personalize.**
**The split IS the output:** Claude flags "they build it themselves." That's
exactly what to address in outreach → *"Personalize around: are they buying or
building backend?"* This is the case where a **warm path signal** (ex-seller
employee inside) would be decisive — surface it to break the tie.

---

## 6. How the warm-path signal plugs in
Add as `Signal` rows before `priceDeal` (`source: "orange slice"`):
`"7 people at [prospect] previously worked at [seller]"`,
`"shares 2 investors with [seller]"`, `"already integrates with [ecosystem]"`.
Claude reads it as lowered acquisition risk; GPT as cycle-compression. In a
contested Tier-2 like Example C, a strong warm path is the tiebreaker that turns
"personalize" into "prioritize via the warm intro."
