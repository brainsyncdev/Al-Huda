"use client";

import { ExternalLink } from "lucide-react";

interface ReferenceBarProps {
  type: "ayah" | "hadith";
  surahNumber?: number;
  ayahNumber?: number;
  surahName?: string;
  revelationType?: "meccan" | "medinan";
  juz?: number;
  page?: number;
  collection?: string;
  hadithNumber?: number;
  grade?: "sahih" | "hasan" | "daif" | "fabricated";
  narrator?: string;
  externalUrl: string;
  tafsirLinks?: Array<{ scholar: string; url: string }>;
  compact?: boolean;
}

export function ReferenceBar({
  type,
  surahNumber,
  ayahNumber,
  surahName,
  revelationType,
  juz,
  page,
  collection,
  hadithNumber,
  grade,
  narrator,
  externalUrl,
  tafsirLinks = [],
  compact = false,
}: ReferenceBarProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {type === "ayah" ? (
          <span className="font-medium">
            {surahName} {surahNumber}:{ayahNumber}
          </span>
        ) : (
          <span className="font-medium">
            {collection} {hadithNumber}
          </span>
        )}
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          quran.com <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card/50 p-3 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {type === "ayah" ? (
            <>
              <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium">
                📖 {surahName}
              </span>
              <span className="text-muted-foreground">
                Ayah {ayahNumber}
              </span>
              {juz && (
                <span className="text-muted-foreground">• Juz {juz}</span>
              )}
              {page && (
                <span className="text-muted-foreground">• Page {page}</span>
              )}
              {revelationType && (
                <span className="px-2 py-0.5 rounded bg-secondary/50 text-xs text-muted-foreground">
                  {revelationType === "meccan" ? "Makkah" : "Madinah"}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium">
                📗 {collection}
              </span>
              <span className="text-muted-foreground">
                Hadith {hadithNumber}
              </span>
              {grade && <GradeBadge grade={grade} />}
              {narrator && (
                <span className="text-muted-foreground">
                  • Narrator: {narrator}
                </span>
              )}
            </>
          )}
        </div>
        
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
        >
          {type === "ayah" ? "quran.com ↗" : "sunnah.com ↗"}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {type === "ayah" && tafsirLinks.length > 0 && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-xs text-muted-foreground">📚 Tafsir:</span>
          <div className="flex items-center gap-2">
            {tafsirLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                {link.scholar}
                {index < tafsirLinks.length - 1 && " • "}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
        <span>✅</span>
        <span>Verified source</span>
      </div>
    </div>
  );
}

function GradeBadge({ grade }: { grade: "sahih" | "hasan" | "daif" | "fabricated" }) {
  const styles = {
    sahih: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    hasan: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    daif: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    fabricated: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const labels = {
    sahih: "✅ Sahih",
    hasan: "🟡 Hasan",
    daif: "⚠️ Da'if",
    fabricated: "❌ Fabricated",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${styles[grade]}`}>
      {labels[grade]}
    </span>
  );
}

export default ReferenceBar;