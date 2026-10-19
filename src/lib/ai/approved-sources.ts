// FR-060 — the retrieval allowlist (AI-SAFETY pipeline step 2).
//
// "Approved, versioned source material" is derived, not declared: a source is
// retrievable only when it is actually vendored into the build
// (`method === "package"`). The two tafsir records in the catalog are
// `method: "link"` — outbound references with no bundled text — so no code can
// accidentally retrieve "from" a source we merely link to and never hold.
// Adding a package to the catalog therefore widens retrieval only when the
// package really ships content, which is the licence-provenance rule in
// docs/DATA-PROVENANCE.md applied mechanically.

import { SOURCES, type SourceRecord } from "@/lib/quran/sources";

export interface ApprovedSource {
  id: string;
  /** Version pinned in the catalog — an unversioned source cannot be approved. */
  version: string;
  attribution: string;
  license: string;
  licenseUrl: string | null;
  homepage: string;
}

function toApproved(record: SourceRecord): ApprovedSource {
  return {
    id: record.id,
    version: record.version,
    attribution: record.attribution,
    license: record.license,
    licenseUrl: record.licenseUrl ?? null,
    homepage: record.homepage,
  };
}

/**
 * Every vendored, version-pinned source in the build. Link-only records are
 * excluded by construction — see the header comment.
 */
export const APPROVED_SOURCES: ApprovedSource[] = SOURCES.filter(
  (record) => record.method === "package"
).map(toApproved);

const APPROVED_IDS: ReadonlySet<string> = new Set(
  APPROVED_SOURCES.map((source) => source.id)
);

/** FR-060: retrieval may not reference anything outside this set. */
export function isApprovedSource(id: string): boolean {
  return APPROVED_IDS.has(id);
}

export function getApprovedSource(id: string): ApprovedSource | undefined {
  return APPROVED_SOURCES.find((source) => source.id === id);
}

/** Canonical content package id, for citation assembly. */
export const CONTENT_PACKAGE_ID = "quran-json";
