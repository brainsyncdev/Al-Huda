// MFD-12.2 Phase 0 — Tanzil rights-compliance gate.
//
// Prevents the proxy route and server-side search from delivering text for
// editions whose rights status has not been verified. Bundled content
// (quran-json en.sahih, en.transliteration) is NOT gated because it ships
// under CC-BY-4.0 via the npm package.
//
// Controlled by TANZIL_RIGHTS_ENFORCEMENT env var. When "false" or unset the
// gate is transparent (returns false for every check), preserving backward
// compatibility until legal review completes.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

/** Translation IDs that are genuinely bundled in quran-json and carry CC-BY-4.0. */
const BUNDLED_EDITIONS: ReadonlySet<string> = new Set([
  "en.sahih",
  "en.transliteration",
]);

/** Tafsir editions served through the proxy that require rights clearance. */
const PROXY_TAFSIR_EDITIONS: ReadonlySet<string> = new Set([
  "ar.jalalayn",
  "ar.muyassar",
]);

export function isRightsEnforcementEnabled(): boolean {
  return process.env.TANZIL_RIGHTS_ENFORCEMENT === "true";
}

/**
 * Returns true when the given edition ID should be blocked from delivery
 * because its rights have not been verified.
 *
 * Bundled editions (en.sahih, en.transliteration) are never gated — they ship
 * under the quran-json CC-BY-4.0 licence and do not transit the Tanzil proxy.
 *
 * When enforcement is disabled, nothing is gated.
 */
export function isEditionGated(editionId: string): boolean {
  if (!isRightsEnforcementEnabled()) return false;
  if (BUNDLED_EDITIONS.has(editionId)) return false;
  // All non-bundled editions fetched via the Tanzil proxy are gated until
  // legal review clears them individually.
  return true;
}

/**
 * Structured response payload for gated API requests. Consumers should render
 * a link-out card rather than treating this as an error.
 */
export interface GatedResponse {
  gated: true;
  reason: "rights-under-review";
  editionId: string;
  externalUrl: string;
  message: string;
}

export function buildGatedResponse(editionId: string): GatedResponse {
  return {
    gated: true,
    reason: "rights-under-review",
    editionId,
    externalUrl: `https://tanzil.net/trans/${encodeURIComponent(editionId)}`,
    message:
      "This translation is available externally. Rights for this edition are under review.",
  };
}

/**
 * Filter an array of edition IDs down to those safe for server-side search.
 * Used by translation-search.ts and tafsir-search.ts.
 */
export function filterGatedEditions(ids: readonly string[]): string[] {
  if (!isRightsEnforcementEnabled()) return [...ids];
  return ids.filter((id) => !isEditionGated(id));
}
