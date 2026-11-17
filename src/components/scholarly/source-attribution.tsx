"use client";

// MFD-10.2 — Source Attribution Component
//
// Renders full provenance for a SourceRecord or EvidenceRecord.
// All provenance is visible text, never hidden in tooltips.
// External links open in new tab with rel="noopener noreferrer".

import type { EvidenceRecord } from "@/lib/scholarly/types";
import { getSource, sourceLanguageLabel, sourceVersionLabel } from "@/lib/quran/sources";
import { EVIDENCE_STATUS_LABELS } from "@/lib/scholarly/evidence";

interface SourceAttributionProps {
  /** Either a sourceId string or a full EvidenceRecord. */
  sourceId?: string;
  record?: EvidenceRecord;
  className?: string;
}

export function SourceAttribution({
  sourceId,
  record,
  className,
}: SourceAttributionProps) {
  const resolvedId = record?.sourceId ?? sourceId;
  const source = resolvedId ? getSource(resolvedId) : undefined;

  if (!source && !record) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">Source information unavailable.</p>
      </div>
    );
  }

  const title = record?.sourceTitle ?? source?.attribution ?? "Unknown source";
  const author = record?.sourceAuthor ?? source?.attribution ?? "";
  const publisher = source?.publisher ?? "";
  const version = source ? sourceVersionLabel(source) : record?.edition ?? "";
  const language = source
    ? sourceLanguageLabel(source.language)
    : record?.language ?? "unspecified";
  const license = source?.license ?? "";
  const licenseUrl = source?.licenseUrl;
  const homepage = source?.homepage ?? "";
  const available = source?.available !== false;
  const status = record?.status;

  // Determine reference level
  const isHomepageOnly =
    record != null &&
    !record.volumePage &&
    (!record.sourceUrl || record.sourceUrl === homepage);
  const referenceLevelText = record
    ? isHomepageOnly
      ? "Publisher homepage only — not an ayah-level reference"
      : "Ayah-level reference provided"
    : "No specific reference attached";

  return (
    <div className={className}>
      <dl className="space-y-1.5 text-sm">
        <div>
          <dt className="inline font-semibold text-foreground">Title: </dt>
          <dd className="inline text-foreground">{title}</dd>
        </div>

        {author && (
          <div>
            <dt className="inline font-semibold text-foreground">Author/Institution: </dt>
            <dd className="inline text-foreground">{author}</dd>
          </div>
        )}

        {publisher && (
          <div>
            <dt className="inline font-semibold text-foreground">Publisher: </dt>
            <dd className="inline text-foreground">{publisher}</dd>
          </div>
        )}

        {version && (
          <div>
            <dt className="inline font-semibold text-foreground">Edition/Version: </dt>
            <dd className="inline text-foreground">{version}</dd>
          </div>
        )}

        <div>
          <dt className="inline font-semibold text-foreground">Language: </dt>
          <dd className="inline text-foreground">{language}</dd>
        </div>

        {license && (
          <div>
            <dt className="inline font-semibold text-foreground">License: </dt>
            <dd className="inline text-foreground">
              {licenseUrl ? (
                <a
                  href={licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  {license}
                </a>
              ) : (
                license
              )}
            </dd>
          </div>
        )}

        <div>
          <dt className="inline font-semibold text-foreground">Availability: </dt>
          <dd className="inline text-foreground">
            {available ? "Available" : "Currently unavailable"}
          </dd>
        </div>

        {status && (
          <div>
            <dt className="inline font-semibold text-foreground">Evidence status: </dt>
            <dd className="inline text-foreground">
              {EVIDENCE_STATUS_LABELS[status]}
            </dd>
          </div>
        )}

        <div>
          <dt className="inline font-semibold text-foreground">Reference level: </dt>
          <dd className="inline text-foreground">{referenceLevelText}</dd>
        </div>

        {homepage && (
          <div>
            <dt className="inline font-semibold text-foreground">Homepage: </dt>
            <dd className="inline">
              <a
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80"
              >
                {homepage}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
