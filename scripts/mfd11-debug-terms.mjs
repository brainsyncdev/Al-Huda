// Debug helper: find exact Arabic substrings in corpus for term extraction
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "004-0076-0115.json");
const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

// Strip diacritics for fuzzy matching
function stripDiac(s) {
  return s.replace(/[\u064B-\u065F\u0670\u0671\u06D6-\u06ED]/g, "");
}

const searches = [
  [76, "taghut"], [79, "shaheed"], [81, "wakeel"], [82, "yatadabbar"],
  [85, "muqeet"], [85, "shafa"], [86, "haseeb"],
  [88, "munafiq"], [92, "aleem"], [92, "hakeem"], [92, "diyya"],
  [95, "mujahid"], [96, "ghafoor"], [96, "raheem"], [97, "mustad"],
  [98, "mustad"], [99, "afuww"], [99, "ghafoor"], [100, "ghafoor"], [100, "raheem"],
  [101, "taqsur"], [103, "kitab"], [103, "mawq"], [104, "aleem"], [104, "hakeem"],
  [106, "ghafoor"], [106, "raheem"], [107, "khawwan"], [107, "atheem"],
  [110, "ghafoor"], [110, "raheem"], [111, "aleem"], [111, "hakeem"],
  [112, "buhtan"], [114, "najwa"], [115, "yushaqiq"]
];

for (const [vid, pat] of searches) {
  const t = verses[vid];
  if (!t) { console.log("MISSING verse " + vid); continue; }
  const words = t.split(/\s+/);
  for (const w of words) {
    const norm = stripDiac(w).toLowerCase();
    if (norm.includes(pat.toLowerCase())) {
      console.log(`v${vid} [${pat}] => "${w}"`);
    }
  }
}
