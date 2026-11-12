/**
 * MFD-08 Phase 8: User-friendly mapping type labels and descriptions
 * 
 * These labels distinguish between different types of topic-ayah connections
 * and provide clear explanations of what each type means.
 */

export interface MappingTypeInfo {
  label: string;
  description: string;
  category: 'quranic' | 'editorial' | 'heuristic';
}

export const MAPPING_TYPE_INFO: Record<string, MappingTypeInfo> = {
  DIRECT_REFERENCE: {
    label: 'Direct Quranic reference',
    description: 'The verse explicitly mentions or directly addresses this topic',
    category: 'quranic',
  },
  EXPLICIT_INSTRUCTION: {
    label: 'Explicit Quranic instruction',
    description: 'The verse contains a clear command or prohibition related to this topic',
    category: 'quranic',
  },
  THEMATIC_REFERENCE: {
    label: 'Thematic connection',
    description: 'The verse relates to this topic through shared themes or concepts',
    category: 'quranic',
  },
  GENERAL_QURANIC_PRINCIPLE: {
    label: 'General Quranic principle',
    description: 'The verse illustrates a broader principle that encompasses this topic',
    category: 'quranic',
  },
  PROPHETIC_NARRATIVE: {
    label: 'Prophetic narrative',
    description: 'The verse recounts a story of a prophet that relates to this topic',
    category: 'quranic',
  },
  TAFSIR_SUPPORTED: {
    label: 'Tafsir-supported association',
    description: 'Classical scholars have connected this verse to this topic in their exegesis',
    category: 'editorial',
  },
  EDITORIAL_CROSS_REFERENCE: {
    label: 'Editorial cross-reference',
    description: 'Editors have linked this verse to the topic for study purposes',
    category: 'editorial',
  },
  CONTEMPORARY_APPLICATION: {
    label: 'Contemporary application',
    description: 'The verse is applied to modern contexts related to this topic',
    category: 'editorial',
  },
};

/**
 * Get user-friendly label for a mapping type
 */
export function getMappingTypeLabel(mappingType: string): string {
  return MAPPING_TYPE_INFO[mappingType]?.label ?? mappingType.replace(/_/g, ' ');
}

/**
 * Get description for a mapping type
 */
export function getMappingTypeDescription(mappingType: string): string {
  return MAPPING_TYPE_INFO[mappingType]?.description ?? '';
}

/**
 * Get category for a mapping type
 */
export function getMappingTypeCategory(mappingType: string): 'quranic' | 'editorial' | 'heuristic' {
  return MAPPING_TYPE_INFO[mappingType]?.category ?? 'editorial';
}

/**
 * Review status labels and styling
 */
export interface ReviewStatusInfo {
  label: string;
  className: string;
  icon?: string;
}

export const REVIEW_STATUS_INFO: Record<string, ReviewStatusInfo> = {
  'pending-scholarly-review': {
    label: 'Pending scholarly review',
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  },
  'scholarly-approved': {
    label: 'Scholarly approved',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  },
  'needs-revision': {
    label: 'Needs revision',
    className: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  },
  'draft': {
    label: 'Draft',
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
  },
};

/**
 * Get review status label and styling
 */
export function getReviewStatusInfo(status: string): ReviewStatusInfo {
  return REVIEW_STATUS_INFO[status] ?? {
    label: status.replace(/-/g, ' '),
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
  };
}
