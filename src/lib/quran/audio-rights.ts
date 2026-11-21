// MFD-12.4 WS2: Audio rights-compliance gate.
//
// Server-enforced default-deny gate for audio recitation delivery. Mirrors
// the pattern established by rights-gate.ts (Tanzil translations) but adds
// dual-rights tracking (distribution + performer) per WS-E-AUDIO-RIGHTS-POLICY.md.
//
// Controlled by AUDIO_RIGHTS_ENFORCEMENT env var. When "false" or unset the
// gate is transparent (returns false for every check), preserving backward
// compatibility until legal review completes.
//
// CLEARED_RECITERS env var (comma-separated reciter IDs) exempts specific
// reciters from gating when enforcement is enabled.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

import { getReciter, RECITERS } from "./audio";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DistributionRightsStatus =
  | "cleared"
  | "unverified"
  | "disputed"
  | "expired";

export type PerformerRightsStatus =
  | "authorized"
  | "unverified"
  | "disputed"
  | "waived"
  | "unknown";

export type ReciterRightsStatus =
  | "verified"
  | "under-review"
  | "unverified"
  | "restricted";

export interface PerformerIdentity {
  name: string;
  deathYearGregorian?: number;
  deathYearHijri?: number;
  authorizationChain?: string;
}

export interface ReciterRightsMetadata {
  reciterId: string;
  status: ReciterRightsStatus;
  distributionRightsStatus: DistributionRightsStatus;
  distributionRightsHolder?: string;
  distributionLicenseUrl?: string;
  performerRightsStatus: PerformerRightsStatus;
  performerIdentity: PerformerIdentity;
  moralRightsAcknowledged: boolean;
  territorialRestrictions?: string[];
  commercialUseAllowed: boolean;
  licenseType?: string;
  licenseUrl?: string;
  copyrightHolder?: string;
  notes?: string;
}

/**
 * Structured response payload for gated audio API requests.
 * Consumers should render an informational card rather than treating this as an error.
 */
export interface AudioGatedResponse {
  gated: true;
  reason: "rights-under-review";
  reciterId: string;
  externalUrl: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Per-reciter rights metadata registry
// ---------------------------------------------------------------------------

/**
 * Default rights state for all reciters. Both distribution and performer
 * rights are unverified until explicitly cleared through legal review.
 * Per WS-E §3 Policy Directive 2: "Until BOTH layers are verified, recitation
 * sources default to rightsStatus: 'rights-unverified' with audio playback gated."
 */
const RECITER_RIGHTS_REGISTRY: ReadonlyMap<string, ReciterRightsMetadata> =
  new Map(
    RECITERS.map((r) => {
      const meta: ReciterRightsMetadata = {
        reciterId: r.id,
        status: "under-review",
        distributionRightsStatus: "unverified",
        distributionRightsHolder: "Unknown — Islamic Network CDN does not publish explicit licenses",
        performerRightsStatus: "unknown",
        performerIdentity: {
          name: r.name,
        },
        moralRightsAcknowledged: false,
        commercialUseAllowed: false,
        notes:
          "Rights unverified. Neither distribution nor performer rights have been confirmed for this reciter.",
      };
      return [r.id, meta] as const;
    })
  );

// ---------------------------------------------------------------------------
// Environment controls
// ---------------------------------------------------------------------------

/**
 * Whether audio rights enforcement is active.
 *
 * Reads process.env.AUDIO_RIGHTS_ENFORCEMENT on every call. In Node.js/Next.js,
 * process.env is populated at startup and does NOT update during runtime.
 * Changing the env var after the server starts has NO EFFECT until restart.
 */
export function isAudioEnforcementEnabled(): boolean {
  return process.env.AUDIO_RIGHTS_ENFORCEMENT === "true";
}

/**
 * Parse the CLEARED_RECITERS env var into a Set of reciter IDs.
 * Returns an empty set when the variable is unset or empty.
 */
function getClearedReciters(): ReadonlySet<string> {
  const raw = process.env.CLEARED_RECITERS;
  if (!raw || raw.trim() === "") return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

// ---------------------------------------------------------------------------
// Gate logic
// ---------------------------------------------------------------------------

/**
 * Returns true when the given reciter ID should be blocked from audio delivery
 * because its rights have not been verified.
 *
 * When enforcement is disabled, nothing is gated (transparent pass-through).
 * When enforcement is enabled, all reciters default to gated unless they appear
 * in the CLEARED_RECITERS env var.
 */
export function isReciterGated(reciterId: string): boolean {
  if (!isAudioEnforcementEnabled()) return false;

  const cleared = getClearedReciters();
  if (cleared.has(reciterId)) return false;

  // Default-deny: unknown reciters are always gated when enforcement is on
  return true;
}

/**
 * Retrieve the full rights metadata for a reciter, or null if the reciter
 * is not in the catalog.
 */
export function getReciterRights(reciterId: string): ReciterRightsMetadata | null {
  return RECITER_RIGHTS_REGISTRY.get(reciterId) ?? null;
}

/**
 * Build a structured gated response for a reciter whose audio cannot be served.
 * Includes the external CDN URL so users can listen independently if they choose.
 */
export function buildAudioGatedResponse(
  reciterId: string,
  bitrate: number = 64,
  globalAyah: number = 1
): AudioGatedResponse {
  const reciter = getReciter(reciterId);
  const reciterName = reciter?.name ?? reciterId;
  return {
    gated: true,
    reason: "rights-under-review",
    reciterId,
    externalUrl: `https://cdn.islamic.network/quran/audio/${bitrate}/${reciterId}/${globalAyah}.mp3`,
    message: `Audio for ${reciterName} is temporarily unavailable while distribution rights are verified.`,
  };
}

/**
 * Filter an array of reciter IDs down to those safe for audio delivery.
 * Used by settings page and audio selectors to annotate gated reciters.
 */
export function filterGatedReciters(ids: readonly string[]): string[] {
  if (!isAudioEnforcementEnabled()) return [...ids];
  return ids.filter((id) => !isReciterGated(id));
}

/**
 * Check whether both distribution AND performer rights are verified for a reciter.
 * Per WS-E dual-rights policy, both must be cleared for full verification.
 */
export function isReciterFullyVerified(reciterId: string): boolean {
  const rights = getReciterRights(reciterId);
  if (!rights) return false;
  return (
    rights.distributionRightsStatus === "cleared" &&
    (rights.performerRightsStatus === "authorized" ||
      rights.performerRightsStatus === "waived")
  );
}
