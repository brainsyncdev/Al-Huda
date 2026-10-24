// /explore/theme/[name] — thin redirect-only route.
//
// The project already has a canonical topic experience at /topics/[slug],
// carrying the full editorial selection, provenance, dimension reverse
// lookup, learning-path cross-references, and review-status display. This
// route exists only to honor the "theme" URL shape mentioned during
// discovery planning; it introduces no new content, no new topic logic,
// and no duplicate indexed page.
//
// A permanent redirect (HTTP 301) is used deliberately: it consolidates
// ranking signals onto the canonical /topics/[slug] URL and prevents the
// duplicate-indexed-route problem the PRD explicitly warns about (§6).

import { notFound, permanentRedirect } from "next/navigation";
import { getTopic, TOPICS } from "@/lib/topics/data";

interface Props {
  params: Promise<{ name: string }>;
}

/** Pre-render every canonical topic slug so the redirect resolves statically. */
export async function generateStaticParams() {
  return TOPICS.map((t) => ({ name: t.slug }));
}

export default async function ThemeRedirectPage({ params }: Props) {
  const { name } = await params;
  const topic = getTopic(name);

  if (!topic) {
    // Unknown theme slug: honest 404. We never synthesize a topic page for
    // an input that isn't in the canonical catalog — that would fabricate
    // editorial content and undermine the provenance model.
    notFound();
  }

  // Canonical destination is /topics/[slug]. The permanentRedirect() call
  // issues an HTTP 301 and terminates rendering; nothing below runs.
  permanentRedirect(`/topics/${topic.slug}`);
}
