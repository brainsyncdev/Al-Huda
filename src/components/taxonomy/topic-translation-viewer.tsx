"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type {
  AyahText,
  TopicTranslationResult,
  TranslationSummary,
} from "@/lib/taxonomy/topic-translation-data";
import {
  getMappingTypeLabel,
  getMappingTypeDescription,
  getMappingTypeCategory,
} from "@/lib/taxonomy/mapping-type-labels";

interface TopicTranslationViewerProps {
  result: TopicTranslationResult;
  summary: TranslationSummary;
}

/**
 * Displays all mapped ayat for a topic, grouped by mapping type.
 * Shows Arabic text (RTL), English translation, transliteration, and metadata.
 */
export function TopicTranslationViewer({
  result,
  summary,
}: TopicTranslationViewerProps) {
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    () => {
      // Expand all types by default
      const initial: Record<string, boolean> = {};
      for (const type of Object.keys(result.mappingTypeDistribution)) {
        initial[type] = true;
      }
      return initial;
    }
  );

  const toggleType = (type: string) => {
    setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Group ayahs by mapping type
  const ayahsByType = result.ayahs.reduce<Record<string, AyahText[]>>(
    (acc, ayah) => {
      if (!acc[ayah.mappingType]) {
        acc[ayah.mappingType] = [];
      }
      acc[ayah.mappingType].push(ayah);
      return acc;
    },
    {}
  );

  const mappingTypeColors: Record<string, string> = {
    DIRECT_REFERENCE: "bg-blue-100 text-blue-800 border-blue-200",
    EXPLICIT_INSTRUCTION: "bg-emerald-100 text-emerald-800 border-emerald-200",
    PROPHETIC_NARRATIVE: "bg-purple-100 text-purple-800 border-purple-200",
    THEMATIC_REFERENCE: "bg-amber-100 text-amber-800 border-amber-200",
    GENERAL_QURANIC_PRINCIPLE: "bg-teal-100 text-teal-800 border-teal-200",
    TAFSIR_SUPPORTED: "bg-indigo-100 text-indigo-800 border-indigo-200",
    EDITORIAL_CROSS_REFERENCE: "bg-gray-100 text-gray-800 border-gray-200",
    CONTEMPORARY_APPLICATION: "bg-rose-100 text-rose-800 border-rose-200",
  };

  return (
    <div className="space-y-6">
      {/* Statistics Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Translation Coverage for {result.topicTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Ayat</p>
              <p className="text-2xl font-bold">{summary.totalAyahs}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unique Surahs</p>
              <p className="text-2xl font-bold">{summary.uniqueSurahs.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mapping Types</p>
              <p className="text-2xl font-bold">
                {Object.keys(summary.mappingTypes).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Coverage</p>
              <p className="text-2xl font-bold">
                {summary.hasDirectReferences ? "✓" : "—"} Direct
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Mapping Type Breakdown */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Mapping Type Distribution</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.mappingTypeDistribution).map(
                ([type, count]) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className={cn(
                      "px-3 py-1",
                      mappingTypeColors[type] || "bg-gray-100 text-gray-800"
                    )}
                  >
                    {getMappingTypeLabel(type)}: {count}
                  </Badge>
                )
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Surah List */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Referenced Surahs</p>
            <div className="flex flex-wrap gap-1.5">
              {summary.uniqueSurahs.map((surahNum) => (
                <Badge key={surahNum} variant="secondary" className="px-2 py-0.5">
                  Surah {surahNum}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ayah Groups by Mapping Type */}
      {Object.entries(ayahsByType).map(([type, ayahs]) => (
        <Collapsible
          key={type}
          open={expandedTypes[type]}
          onOpenChange={() => toggleType(type)}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedTypes[type] ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                    <CardTitle className="text-lg">
                      {getMappingTypeLabel(type)}
                    </CardTitle>
                    {getMappingTypeDescription(type) && (
                      <p className="text-xs text-muted-foreground italic mt-1">
                        {getMappingTypeDescription(type)}
                        {getMappingTypeCategory(type) === 'editorial' && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider font-medium not-italic">Editorial association</span>
                        )}
                      </p>
                    )}
                    <Badge variant="outline" className="ml-2">
                      {ayahs.length} {ayahs.length === 1 ? "ayah" : "ayat"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {ayahs.map((ayah, index) => (
                  <AyahCard key={`${ayah.surahNumber}:${ayah.ayahNumber}-${index}`} ayah={ayah} />
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}

interface AyahCardProps {
  ayah: AyahText;
}

function AyahCard({ ayah }: AyahCardProps) {
  const ref = `${ayah.surahNumber}:${ayah.ayahNumber}`;
  const href = `/ayah/${ayah.surahNumber}/${ayah.ayahNumber}`;

  return (
    <article className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
      {/* Header: Reference and Mapping Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {ref}
          </Badge>
          <span className="text-xs text-muted-foreground">Mapping ID:</span>
          <span className="text-xs font-mono text-muted-foreground">
            {ayah.mappingId}
          </span>
        </div>
        <a
          href={href}
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View full ayah ${ref}`}
        >
          View full ayah
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Arabic Text (RTL) */}
      <div className="rounded-lg bg-accent/30 p-4">
        <p
          lang="ar"
          dir="rtl"
          className="arabic-text text-2xl leading-loose text-right"
        >
          {ayah.arabicText}
        </p>
      </div>

      {/* English Translation */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">
          Translation (Saheeh International)
        </p>
        <p className="text-base leading-relaxed">{ayah.englishTranslation}</p>
      </div>

      {/* Transliteration */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">
          Transliteration
        </p>
        <p className="text-sm italic text-foreground/80">{ayah.transliteration}</p>
      </div>

      {/* Rationale */}
      <div className="rounded-lg border border-gold/25 bg-gold-soft/40 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground mb-1">
          Rationale
        </p>
        <p className="text-sm leading-relaxed">{ayah.rationale}</p>
      </div>
    </article>
  );
}
