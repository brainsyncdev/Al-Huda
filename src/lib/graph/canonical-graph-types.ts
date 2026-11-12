// Type definitions for canonical graph enrichment
// This file contains ONLY types - no runtime code, no fs, no path imports.
// Safe to import from both server and client components.

export interface TopicQuranicEnrichment {
  topicId: string;
  ayahCount: number;
  uniqueSurahs: number[];
  mappingTypes: Record<string, number>;
  hasDirectReferences: boolean;
  hasExplicitInstructions: boolean;
  hasPropheticNarratives: boolean;
  hasThematicReferences: boolean;
  relatedRoots: string[];
  translationAvailable: boolean;
  tafsirAvailable: boolean;
}

export interface GraphEnrichmentData {
  topicEnrichments: Record<string, TopicQuranicEnrichment>;
  totalTopicsWithAyahMappings: number;
  totalTopicsWithoutMappings: number;
  totalUniqueAyatReferenced: number;
  totalUniqueRootsLinked: number;
}
