# Feasibility: "Warm-path" connection signal

> **The idea:** surface something like *"42 people from Cursor are connected with
> people at [prospect] on LinkedIn"* as a high-value "signal detected" — a
> warm-intro leverage point that moves the odds.

## TL;DR

- **The literal version is NOT feasible.** The individual LinkedIn social graph
  (who-is-connected-to-whom *across two companies*) is gated by LinkedIn and not
  exposed by Orange Slice or any compliant public source. You cannot count
  person↔person connection edges between seller and prospect.
- **But the same "warm path" value IS feasible** via three proxies Orange Slice
  *does* expose — and the strongest one (alumni overlap) is arguably a *better*
  signal than raw connections, because shared employment = a real relationship,
  not just a LinkedIn accept.

## What Orange Slice actually exposes (checked against the SDK docs)

| Capability | What it returns | Gives us person↔person edges? |
|---|---|---|
| `company.getEmployeesFromLinkedin` | Employee list w/ `lp_public_profile_url`, `lp_title`, `lp_headline`, **`lp_connections` (a COUNT)** | ❌ count only, not *who* |
| `person.linkedin.enrich({extended:true})` | A person's **`experience[]`** = full work history | ❌ but enables alumni overlap (below) |
| `predictLeads.companyConnections` | **Company-level** business ties: `partner / vendor / integration / investor / parent …` (web-scraped from partner/integration pages) | ❌ company graph, not people |
| `predictLeads.discoverConnectionInvestors` | Portfolio companies of VCs/accelerators | ❌ but enables shared-investor overlap |
| `predictLeads.companySimilarCompanies` | Lookalike companies | ❌ ecosystem mapping only |

**Conclusion:** no path to literal mutual-connection counts. `lp_connections` is a
person's *total* connection count, not the edges; `companyConnections` is
business relationships between *companies*, not people.

## The feasible proxies (ranked by signal value)

### A. Alumni / talent-flow overlap — **strongest, ship this as the headline**
> *"7 people at [prospect] previously worked at [seller]."*

A shared employer is a real, warm, reachable intro path — stronger than a cold
LinkedIn connection. **Feasible** two ways:

1. **Efficient (preferred, ~1 call):** `person.linkedin.search` with
   current-company = prospect **and** past-company = seller — IF the search
   supports a past-company filter. ⚠️ **Verify** this filter exists; the search
   docs warn against `UNION ALL` over multiple companies, so confirm the single
   past-company predicate is supported before relying on it.
2. **Brute force (works today, expensive):** `getEmployeesFromLinkedin(prospect)`
   → for each, `person.linkedin.enrich({extended:true})` → scan `experience[]`
   for the seller. **Cost:** N enrich calls per prospect (credits + latency) —
   fine for a single hero on stage, too slow for a whole board.

### B. Company business-connection overlap — **cheap, 1 call, demo-ready**
> *"[prospect] already integrates with / partners with [seller's ecosystem]."*

`companyConnections(prospect)` → filter categories (`integration`, `partner`,
`vendor`, `investor`) and check whether the seller (or a seller-adjacent company)
appears. One call, no per-person cost. Great for the "signal detected" beat.

### C. Shared investors — **cheap, warm via the cap table**
> *"[prospect] shares 2 investors with [seller]."*

Investor-category connections / portfolio overlap. A shared VC is a classic warm
intro. One call each side, intersect.

### D. Champion reachability — **weak, skip for now**
`lp_connections` on key decision-makers (highly-connected champions are easier to
mobilize). Marginal; not worth surfacing.

## Recommended build (post-hackathon)

- **MVP signal-detected moment:** B + C (each 1 call, no per-person cost) →
  surface *"already integrates with X"* / *"shares 2 investors"*. Cheap and real.
- **Headline upgrade:** A (alumni overlap) once the single-search past-company
  filter is verified. *"7 ex-[seller] now at [prospect]"* is the killer line.
- **How it feeds the panel:** add these as `Signal` rows
  (`source: "orange slice"`, `claim: "7 people at X are ex-Cursor"`) merged into
  the Dossier **before** `priceDeal`. No engine/derive/board change — same seam
  enrichment already uses. The models then weigh it through their lenses (Claude:
  warm-path lowers acquisition risk; GPT: an intro accelerates timing).

## Honest caveats

- These are **proxies**, not the literal graph — label them truthfully in the UI
  ("ex-[seller]", "shared investor", "integration") rather than implying
  LinkedIn mutual connections.
- A's brute-force path is **per-prospect expensive** — gate it behind a "deep
  scan" action on a single deal, not the board sweep.
- None of this validates the core mechanic (does inter-model spread predict
  conversion). It's a richer *input*, not proof of the product.
