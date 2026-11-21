// MFD-12.4 WS2 Gap B: Cache-busting version token for audio rights invalidation.
//
// Extracted to its own module to avoid circular dependency between
// audio.ts and audio-rights.ts (both need this value).
//
// Default '1'. Increment on every rights withdrawal or status change that
// requires immediate cache invalidation. See WS2-AUDIO-WITHDRAWAL-RUNBOOK.md.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

/**
 * Cache-busting version token included in proxy URLs and ETags.
 * Bumping this value invalidates ALL cached audio responses,
 * ensuring withdrawn content cannot be served stale from browser/CDN caches.
 */
export const RIGHTS_CACHE_VERSION: string =
  process.env.RIGHTS_CACHE_VERSION ?? "1";
