import { NextResponse } from "next/server";
import { validateDataset } from "@/lib/quran/data";

// Diagnostic/admin endpoint (PRD data-validation gates). Runs the full
// structural scan once and memoizes the result for the server lifetime so
// repeated calls are cheap. Returns only counts and issue strings — no
// secrets, no verse content.
export const dynamic = "force-dynamic";

let cached: { ok: boolean; body: unknown } | null = null;

export async function GET() {
  if (!cached) {
    try {
      const report = validateDataset();
      cached = {
        ok: report.issues.length === 0,
        body: { success: report.issues.length === 0, ...report },
      };
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Validation failed",
        },
        { status: 500 }
      );
    }
  }
  return NextResponse.json(cached.body, { status: cached.ok ? 200 : 500 });
}
