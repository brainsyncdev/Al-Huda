"use client";

import { useEffect, useState } from "react";

/**
 * Copyright year that stays current on a statically generated site.
 *
 * A footer rendered at build time would otherwise freeze the year until the
 * next rebuild. The build-time value is passed in as `buildYear` and used as
 * the initial state, so hydration matches the server HTML exactly (no
 * mismatch warning, no layout shift) and the value is then corrected to the
 * visitor's actual year after mount.
 *
 * Deliberately scoped to this one node: the rest of the footer and the site
 * remain statically generated.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);

  useEffect(() => {
    const current = new Date().getFullYear();
    if (current !== buildYear) setYear(current);
  }, [buildYear]);

  return <>{year}</>;
}
