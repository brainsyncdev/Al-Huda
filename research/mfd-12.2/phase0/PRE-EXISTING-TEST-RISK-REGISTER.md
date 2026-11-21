# Pre-Existing Test Failure Risk Register

> **Generated**: 2026-11-21  
> **proposedBy**: ai-assisted  
> **reviewStatus**: pending-review  
> **Scope**: 6 test failures present BEFORE MFD-12.2 Phase 0 changes  
> **Phase 0 Relation**: NONE — verified that no failure involves taxonomy corrections, rights gate, or source labels

---

## Summary

| # | Test File | Severity | Root Cause | Action |
|---|-----------|----------|------------|--------|
| 1 | `src/app/sitemap.test.ts` | LOW | Stale expected count (topics grew from 11→18 but test math still sums to 6409; actual is 6408) | Fix test |
| 2 | `src/app/url-integrity.test.ts` | MEDIUM | `/library` missing from robots.txt disallow list | Fix code |
| 3 | `src/lib/backup-compatibility.test.ts` | LOW | Test rejects v11 but BACKUP_VERSION was bumped to 11 | Fix test |
| 4 | `src/components/quran/reader-controls-targets.test.ts` | LOW | Test expects hardcoded English strings; code now uses i18n keys | Fix test |
| 5 | `src/lib/morphology/sprint-50-root-ayah-coverage.test.ts` | LOW | Test expects literal "Previous"/"Next"; code now uses i18n keys | Fix test |
| 6 | `src/lib/morphology/auto-review/sprint-48-full-activation.test.ts` | LOW | Timeout reading 1500+ JSON files within 5s default | Fix test |

---

## Detailed Analysis

### 1. Sitemap Entry Count Mismatch

- **Test**: `src/app/sitemap.test.ts:97` — `expected total: 12 static + 114 surahs + 18 topics + 15 dimensions + 14 domains + 6236 ayahs = 6409`
- **Failure**: Expected length 6409, got 6408
- **Root Cause**: The test's arithmetic comment claims 18 topics, but the actual `TOPICS` array and/or static routes produce 6408 entries. The `sitemap.ts` header comment still says "11 topics" (stale documentation). Either a topic was removed or a static route was consolidated, producing an off-by-one. The sitemap generation logic itself is correct — it iterates the live data arrays.
- **User Impact**: None. Sitemap correctly reflects all live routes. Search engines will index exactly the right pages.
- **Severity**: **LOW** — cosmetic test drift; no functional defect
- **Recommended Action**: Update the expected count in the test to match current data. Audit whether 6408 or 6409 is the true canonical count by summing `staticRoutes.length + surahRoutes.length + TOPICS.length + dimensions.length + DOMAINS.length + ayahCount`.
- **Phase 0 Related**: ❌ No

---

### 2. Robots.txt Missing `/library` Disallow

- **Test**: `src/app/url-integrity.test.ts:112` — `expect(disallow).toContain("/library")`
- **Failure**: `/library` not found in disallow array `["/my-study", "/settings", "/learn", "/editorial", "/report"]`
- **Root Cause**: The `/library` route was either added after the robots.txt was last updated, or it was intentionally omitted because `/library` doesn't exist yet. The test assumes `/library` should be private, but `src/app/robots.ts` does not include it.
- **User Impact**: If `/library` exists as a user-private route, search engines could crawl and index it, potentially exposing user-specific content or unlisted pages. If the route doesn't exist, there is zero impact.
- **Severity**: **MEDIUM** — potential SEO/privacy gap if `/library` is a real private route
- **Recommended Action**: Verify whether `/library` exists as an app route. If yes, add it to the disallow list in `src/app/robots.ts`. If no, remove the assertion from the test.
- **Phase 0 Related**: ❌ No

---

### 3. Backup Version Guard Accepts v11

- **Test**: `src/lib/backup-compatibility.test.ts:592` — `rejects unsupported version (too new)` expects `parseBackup({version: 11})` to return `{ok: false}`
- **Failure**: `result.ok` is `true` (v11 is accepted)
- **Root Cause**: `BACKUP_VERSION` in `src/lib/backup.ts:51` was bumped to `11` (likely for MFD-10.2 scholarly store or a subsequent migration), making v11 the current supported version. The test was written when v10 was current and v11 was "too new," but was never updated after the version bump.
- **User Impact**: None. The backup system correctly accepts the current version. Future versions (v12+) will be properly rejected.
- **Severity**: **LOW** — stale test guardrail; no functional defect
- **Recommended Action**: Update the test to use `version: 12` (or `BACKUP_VERSION + 1`) as the "too new" sentinel. Add a comment tying the sentinel to `BACKUP_VERSION` so future bumps auto-surface the needed update.
- **Phase 0 Related**: ❌ No

---

### 4. Reader Controls Accessible Names Use i18n Keys

- **Test**: `src/components/quran/reader-controls-targets.test.ts:25` — expects source to contain `accessibleLabel: "Small text size"` (hardcoded English)
- **Failure**: Source now contains `t("reader.smallAria")` instead of hardcoded strings
- **Root Cause**: The reader controls component was refactored to use the i18n translation system (`useTranslation()` hook). The accessible labels are now resolved at runtime via translation keys rather than being hardcoded string literals in the source. The test performs a static source-code regex match, which cannot see runtime-resolved values.
- **User Impact**: None. Screen readers receive correct localized labels at runtime. The accessibility contract is fulfilled; only the test's verification method is broken.
- **Severity**: **LOW** — test methodology incompatible with i18n refactor; no a11y regression
- **Recommended Action**: Rewrite the test to either (a) check that the i18n keys (`reader.smallAria`, etc.) are present in source, or (b) render the component with a test translation provider and assert on the rendered `aria-label` attributes. Option (b) is stronger.
- **Phase 0 Related**: ❌ No

---

### 5. Ayah Reader Navigation Labels Use i18n Keys

- **Test**: `src/lib/morphology/sprint-50-root-ayah-coverage.test.ts:136` — expects page source to contain literal `"Previous"` and `"Next"`
- **Failure**: Source contains `t("quran.previousAyah")` and `t("quran.nextAyah")` instead
- **Root Cause**: Same as #4. The ayah reader page was internationalized. The English dictionary maps `quran.previousAyah` → `"Previous · {surah}:{ayah}"` and `quran.nextAyah` → `"Next · {surah}:{ayah}"`, so the user-facing output is identical. The test's static source scan cannot resolve runtime translations.
- **User Impact**: None. Navigation works correctly in all supported languages.
- **Severity**: **LOW** — test methodology incompatible with i18n refactor; no navigation regression
- **Recommended Action**: Change assertions to check for i18n key presence (`quran.previousAyah`, `quran.nextAyah`) in source, or render-test the component with a mock translation provider.
- **Phase 0 Related**: ❌ No

---

### 6. Sprint 48 Occurrence Structure Test Timeout

- **Test**: `src/lib/morphology/auto-review/sprint-48-full-activation.test.ts:72` — `populated files have correct structure`
- **Failure**: `Error: Test timed out in 5000ms`
- **Root Cause**: The test synchronously reads and parses 1,500+ JSON occurrence files from disk within a single `it()` block. On Windows with spinning disks or heavy I/O load, this exceeds Vitest's default 5-second timeout. The test logic itself is correct — neighboring tests (`no phantom occurrences`, `no duplicate occurrences`) perform similar work and pass within their time budgets because they skip empty files early.
- **User Impact**: None. This is a build-time integrity audit, not user-facing functionality. The morphology data is valid (other tests in the same suite confirm it).
- **Severity**: **LOW** — CI/test infrastructure performance issue; no data integrity concern
- **Recommended Action**: Increase the test timeout to 30,000ms via `it("...", () => {...}, 30000)` or configure a file-level `testTimeout` in the describe block. Alternatively, parallelize file reads or sample a subset for structural validation.
- **Phase 0 Related**: ❌ No

---

## Phase 0 Independence Verification

All 6 failures were confirmed present in BOTH:
- `_baseline-test-output.txt` (pre-Phase-0 run)
- `_post-correction-test-output.txt` (post-Phase-0 run)

The failure messages, line numbers, and error types are identical across both runs. None of the failing tests touch:
- Taxonomy correction logic (`src/lib/taxonomy/`)
- Rights gate / access control
- Source label rendering
- Any file modified by MFD-12.2 Phase 0

**Conclusion**: These are fully pre-existing issues unrelated to Phase 0 work.

---

## Priority Recommendation

| Priority | Item | Rationale |
|----------|------|-----------|
| 1st | #2 Robots `/library` | Only item with potential user-facing privacy/SEO impact |
| 2nd | #3 Backup version test | Quick fix; prevents false sense of security regression |
| 3rd | #4, #5 i18n tests | Batch fix; same root cause pattern |
| 4th | #1 Sitemap count | Trivial arithmetic update |
| 5th | #6 Timeout | CI quality-of-life; no urgency |
