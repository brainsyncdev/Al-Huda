// Types for personal reflections on Quran study (Sprint 53).
//
// Reflections are private notes attached to specific ayahs, topics, or journey
// stages. They live entirely in localStorage with no server copy, following the
// same local-first contract as bookmarks, notes, and revision plans.

export type ReflectionTargetType = "ayah" | "topic" | "journey-stage";

export interface Reflection {
  id: string;
  targetType: ReflectionTargetType;
  targetRef: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReflectionsState {
  version: 1;
  reflections: Reflection[];
}
