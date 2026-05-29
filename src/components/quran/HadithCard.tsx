"use client";

import { useState } from "react";
import { Heart, Share2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Hadith } from "@/types/quran";
import { ReferenceBar } from "./ReferenceBar";

interface HadithCardProps {
  hadith: Hadith;
  compact?: boolean;
  onSave?: (hadith: Hadith) => void;
  onShare?: (hadith: Hadith) => void;
  isSaved?: boolean;
}

export function HadithCard({
  hadith,
  compact = false,
  onSave,
  onShare,
  isSaved = false,
}: HadithCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isSavedState, setIsSavedState] = useState(isSaved);

  const handleSave = () => {
    setIsSavedState(!isSavedState);
    onSave?.(hadith);
  };

  const gradeColors = {
    sahih: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    hasan: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    daif: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    fabricated: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  if (compact) {
    return (
      <div className="bg-card rounded-lg border p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-sm text-muted-foreground">
              {hadith.collection} {hadith.hadithNumber}
            </span>
            <p className="text-sm mt-1">{hadith.englishText}</p>
          </div>
          <a
            href={hadith.refUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            sunnah.com ↗
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="p-4 border-b bg-secondary/30">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium">
            📗 {hadith.collection}
          </span>
          <span className="text-sm text-muted-foreground">
            No. {hadith.hadithNumber}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs border ${gradeColors[hadith.grade]}`}>
            {hadith.grade === "sahih" && "✅ Sahih"}
            {hadith.grade === "hasan" && "🟡 Hasan"}
            {hadith.grade === "daif" && "⚠️ Da'if"}
            {hadith.grade === "fabricated" && "❌ Fabricated"}
          </span>
        </div>
        {hadith.narrator && (
          <p className="text-sm text-muted-foreground mt-2">
            Narrator: {hadith.narrator}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {hadith.arabicText && (
          <p className="arabic-text text-xl text-center text-foreground" dir="rtl">
            {hadith.arabicText}
          </p>
        )}
        
        {hadith.urduText && (
          <p className="urdu-text text-base text-center text-foreground/90" dir="rtl">
            {hadith.urduText}
          </p>
        )}
        
        <p className="text-base text-center text-foreground/80 italic">
          "{hadith.englishText}"
        </p>

        {/* Expandable content */}
        {expanded && (
          <div className="pt-3 border-t space-y-2">
            {hadith.chain && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Chain of Narration:</p>
                <p className="text-sm text-muted-foreground">{hadith.chain}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            isSavedState
              ? "bg-primary/10 text-primary"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Heart className={`h-4 w-4 ${isSavedState ? "fill-current" : ""}`} />
          <span>{isSavedState ? "Saved" : "Save"}</span>
        </button>
        
        <button
          onClick={() => onShare?.(hadith)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
        
        <a
          href={hadith.refUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors mr-auto"
        >
          <ExternalLink className="h-4 w-4" />
          <span>sunnah.com</span>
        </a>
      </div>
    </div>
  );
}

export default HadithCard;