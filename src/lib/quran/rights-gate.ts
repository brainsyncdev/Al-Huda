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
// MFD-12.3 WS4 Gap 6 — OPERATIONAL CONSTRAINT: Runtime Toggle Limitation
// -----------------------------------------------------------------------
// isRightsEnforcementEnabled() reads process.env.TANZIL_RIGHTS_ENFORCEMENT on
// every call. However, in Node.js/Next.js, process.env is populated at startup
// and does NOT update during runtime. Changing the env var after the server
// starts has NO EFFECT until the process is restarted. This means:
//   - Enabling enforcement mid-deployment requires a server restart.
//   - Disabling enforcement urgently also requires a restart.
//   - If legal review clears an edition, the server must be redeployed.
// A database-backed or config-file flag would allow true runtime toggling,
// but that is out of scope for MFD-12.3. For now, plan deployments around
// legal review milestones.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

/** Translation IDs that are genuinely bundled in quran-json and carry CC-BY-4.0. */
const BUNDLED_EDITIONS: ReadonlySet<string> = new Set([
  "en.sahih",
  "en.transliteration",
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

// ---------------------------------------------------------------------------
// MFD-12.3 WS3: Transparent Fallback Resolution
// ---------------------------------------------------------------------------

/**
 * Ordered list of bundled, rights-cleared editions suitable as universal
 * fallbacks when a user's preferred translation is gated.
 *
 * Priority:
 * 1. en.sahih — widely accepted English translation, bundled CC-BY-4.0
 * 2. en.transliteration — romanized Arabic, useful when no translation available
 */
const FALLBACK_CHAIN: readonly string[] = [
  "en.sahih",
  "en.transliteration",
];

/**
 * Resolve a permitted fallback edition when the requested one is gated.
 *
 * @param requestedId The edition the user originally requested
 * @returns The first available fallback ID from FALLBACK_CHAIN, or null if
 *          no suitable fallback exists (should never happen with current chain)
 *
 * When enforcement is disabled, returns null (no fallback needed).
 * When the requested edition is not gated, returns null (no fallback needed).
 */
export function resolveFallbackEdition(requestedId: string): string | null {
  if (!isEditionGated(requestedId)) return null;

  // Find first non-gated edition in the fallback chain
  for (const candidate of FALLBACK_CHAIN) {
    if (!isEditionGated(candidate)) {
      return candidate;
    }
  }

  // No fallback available — caller should show 'unavailable' state
  return null;
}

/**
 * Structured response payload when a gated edition is transparently replaced
 * with a fallback. The client uses the metadata headers to display accurate
 * attribution while preserving the user's saved preference.
 */
export interface GatedFallbackResponse {
  /** The fallback edition actually served */
  actualEditionId: string;
  /** The edition the user originally requested (still gated) */
  requestedEditionId: string;
  /** Human-readable reason for the substitution */
  fallbackReason: string;
}
