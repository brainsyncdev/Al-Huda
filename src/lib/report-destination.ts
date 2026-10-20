// Optional delivery destination for /report submissions (FR-066).
//
// This app has no server endpoint for feedback. When the operator sets
// NEXT_PUBLIC_REPORT_EMAIL at build time, the report page offers a real
// delivery action (mailto compose) so a prepared report can actually be
// sent. When it is unset — the default — the page keeps the honest
// "no destination configured" state rather than inventing an address.

/** Email address operators configure to receive reports, or null. */
export const REPORT_EMAIL =
  process.env.NEXT_PUBLIC_REPORT_EMAIL?.trim() || null;

/** True when a delivery destination has been configured for this build. */
export function canEmailReport(): boolean {
  return Boolean(REPORT_EMAIL);
}

/** Build a mailto: URL that opens a composed message with the report body. */
export function buildReportMailto(
  reportText: string,
  subject = "Al-Huda feedback / AI answer report"
): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", reportText);
  return `mailto:${REPORT_EMAIL}?${params.toString()}`;
}
