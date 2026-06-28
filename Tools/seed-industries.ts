// Populate the board with more companies, organized by industry. Tags existing
// curated companies, then model-enriches + prices new ones per industry (under
// Convex, the default board). No OS credits needed — buildMarket falls back to
// model enrichment.  bun Tools/seed-industries.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
  console.error("NEXT_PUBLIC_CONVEX_URL not set");
  process.exit(1);
}
const c = new ConvexHttpClient(url);
const SELLER = "convex";

// Tag the existing curated companies with their industry.
const EXISTING: Record<string, string> = {
  decagon: "AI",
  sierra: "AI",
  cognition: "AI",
  perplexity: "AI",
  suno: "AI",
  lovable: "AI",
  mercor: "AI",
  replit: "Dev Tools",
  dub: "Dev Tools",
  linear: "Dev Tools",
};

// New companies to add, by industry (recognizable; model-enriched).
const NEW: Record<string, string[]> = {
  Fintech: ["Ramp", "Brex", "Mercury", "Plaid", "Deel"],
  "Dev Tools": ["Vercel", "Retool", "Sentry", "Postman"],
  SaaS: ["Notion", "Figma", "Airtable", "Calendly"],
  Infra: ["Datadog", "Snowflake", "Databricks", "Confluent"],
  AI: ["Anthropic", "Glean", "Writer"],
};

console.log("\n▸ tagging existing companies…");
for (const [id, ind] of Object.entries(EXISTING)) {
  await c.mutation(api.deals.setIndustry, { dealId: id, industry: ind });
}

console.log("▸ building new companies by industry…\n");
let n = 0;
for (const [industry, names] of Object.entries(NEW)) {
  for (const name of names) {
    try {
      const r = await c.action(api.engine.buildMarket, { query: name, sellerId: SELLER });
      if (r?.dealId) {
        await c.mutation(api.deals.setIndustry, { dealId: r.dealId, industry });
        const d = await c.query(api.deals.getDeal, { dealId: r.dealId, sellerId: SELLER });
        console.log(`  ✓ [${industry}] ${r.name?.slice(0, 22).padEnd(23)} ${d?.consensus ?? "?"}% ${d?.action ?? ""}`);
        n++;
      } else {
        console.log(`  ✗ [${industry}] ${name} — build failed`);
      }
    } catch (e) {
      console.log(`  ✗ [${industry}] ${name}: ${(e as Error)?.message ?? e}`);
    }
  }
}
console.log(`\nseeded ${n} new companies across ${Object.keys(NEW).length} industries.\n`);
