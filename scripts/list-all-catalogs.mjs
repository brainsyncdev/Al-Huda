// Temporary script to list all taxonomy catalogs for review.
// Run: node scripts/list-all-catalogs.mjs
import { readFileSync } from "node:fs";

const SEP = "═".repeat(70);

// ─── 1. Curated Topics (18) ──────────────────────────────────────────────
console.log(SEP);
console.log("CURATED TOPICS (18) — src/lib/topics/data.ts");
console.log("These are the topics the 15 UI dimensions resolve against.");
console.log(SEP);

const topicsTs = readFileSync("./src/lib/topics/data.ts", "utf-8");
const topicRe = /slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"/g;
let m;
let i = 1;
const curatedSlugs = new Set();
while ((m = topicRe.exec(topicsTs)) !== null) {
  curatedSlugs.add(m[1]);
  console.log(`  ${String(i).padStart(2)}. ${m[1].padEnd(30)} — ${m[2]}`);
  i++;
}
console.log(`\nTotal: ${i - 1}`);

// ─── 2. 15 UI Dimensions ─────────────────────────────────────────────────
console.log("\n" + SEP);
console.log("15 UI DIMENSIONS — src/lib/explore/dimensions.ts");
console.log("Resolves topicSlugs against curated catalog (18), NOT taxonomy.");
console.log(SEP);

const dimsTs = readFileSync("./src/lib/explore/dimensions.ts", "utf-8");
// Extract each DIMENSIONS entry using a balanced-ish scan
const entryRe = /\{\s*number:\s*(\d+),\s*id:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?arabicTitle:\s*"([^"]+)",[\s\S]*?topicSlugs:\s*\[([\s\S]*?)\]/g;
let dm;
while ((dm = entryRe.exec(dimsTs)) !== null) {
  const [, num, id, title, arabic, slugsBlock] = dm;
  const slugs = [...slugsBlock.matchAll(/"([^"]+)"/g)].map(x => x[1]);
  const missing = slugs.filter(s => !curatedSlugs.has(s));
  const status = missing.length === 0
    ? "✓ all resolve"
    : `✗ MISSING: ${missing.join(", ")}`;
  console.log(`  ${num.padStart(2)}. ${id.padEnd(14)} ${arabic.padEnd(10)} ${title}`);
  console.log(`      ${slugs.length} topic(s): ${slugs.length ? slugs.join(", ") : "(none — intentional)"}`);
  console.log(`      ${status}`);
}

// ─── 3. Domains (20) ─────────────────────────────────────────────────────
console.log("\n" + SEP);
console.log("DOMAINS (20) — data/taxonomy/domains.json");
console.log("Scholarly subject areas; each groups multiple dimensions.");
console.log(SEP);

const domains = JSON.parse(readFileSync("./data/taxonomy/domains.json", "utf-8"));
console.log(`Total: ${domains.length}`);
domains.forEach((x, idx) => {
  const title = typeof x.title === "object" ? (x.title.en || "") : (x.title || "");
  const urdu = x.urduTitle || "";
  const dims = x.dimensionIds || [];
  console.log(`  ${String(idx + 1).padStart(2)}. ${x.id.padEnd(36)} ${title}`);
  console.log(`      ${urdu}`);
  console.log(`      → ${dims.length} dimensions`);
});

// ─── 4. Taxonomy Dimensions (103) ────────────────────────────────────────
console.log("\n" + SEP);
console.log("TAXONOMY DIMENSIONS (103) — data/taxonomy/dimensions.json");
console.log("Fine-grained scholarly categories; referenced by topics via parentDimensionId.");
console.log(SEP);

const taxDims = JSON.parse(readFileSync("./data/taxonomy/dimensions.json", "utf-8"));
console.log(`Total: ${taxDims.length}`);
console.log(`(listing first 25 by id)\n`);
taxDims.slice(0, 25).forEach((d, idx) => {
  const title = d.title?.en || d.title || "";
  console.log(`  ${String(idx + 1).padStart(2)}. ${d.id.padEnd(36)} ${title}`);
});
console.log(`  ... and ${taxDims.length - 25} more`);

// ─── 5. Taxonomy Topics (184) — all slugs ────────────────────────────────
console.log("\n" + SEP);
console.log("TAXONOMY TOPICS (184) — data/taxonomy/topics.json");
console.log("All topic slugs alphabetically with parentDimensionId.");
console.log(SEP);

const topics = JSON.parse(readFileSync("./data/taxonomy/topics.json", "utf-8"));
const sorted = [...topics].sort((a, b) =>
  (a.slug || a.id).localeCompare(b.slug || b.id)
);
sorted.forEach((t, idx) => {
  const s = t.slug || t.id;
  const title = t.title || "";
  const dim = t.parentDimensionId || "";
  console.log(`  ${String(idx + 1).padStart(3)}. ${s.padEnd(38)} ${title}`);
});
console.log(`\nTotal: ${topics.length}`);

// ─── 6. Summary ──────────────────────────────────────────────────────────
console.log("\n" + SEP);
console.log("SUMMARY");
console.log(SEP);
console.log(`  Curated topics (UI navigation):     ${curatedSlugs.size}`);
console.log(`  15 UI dimensions:                   15`);
console.log(`  Scholarly domains:                  ${domains.length}`);
console.log(`  Scholarly dimensions (fine-grained): ${taxDims.length}`);
console.log(`  Scholarly topics:                   ${topics.length}`);
console.log(`  Ayah-to-topic mappings:             ${JSON.parse(readFileSync("./data/taxonomy/topic-ayah-mappings.json", "utf-8")).length}`);
