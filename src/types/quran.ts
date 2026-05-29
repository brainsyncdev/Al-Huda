export interface Surah {
  id: number;
  nameArabic: string;
  nameUrdu: string;
  transliteration: string;
  meaningUrdu: string;
  meaningEnglish: string;
  revelationType: 'meccan' | 'medinan';
  totalVerses: number;
  juzStart: number;
  orderRevealed: number;
}

export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  arabicText: string;
  arabicClean: string;
  juz: number;
  page: number;
  rub?: number;
  hizb?: number;
  sajda: boolean;
  globalIndex: number;
}

export interface Translation {
  id: number;
  ayahId: number;
  language: string;
  translator: string;
  translation: string;
  sourceVerified: boolean;
  scholarApproved: boolean;
}

export interface TafsirEntry {
  id: number;
  ayahId: number;
  scholar: string;
  workName: string;
  language: string;
  level: 'simple' | 'intermediate' | 'deep' | 'classical';
  content: string;
  contentUrdu?: string;
  sourceRef: string;
  refUrl: string;
  scholarApproved: boolean;
}

export interface RootWord {
  id: number;
  rootArabic: string;
  rootMeaningUrdu: string;
  rootMeaningEnglish: string;
  quranFrequency: number;
  difficultyLevel: number;
}

export interface Hadith {
  id: number;
  collection: string;
  collectionSlug: string;
  bookNumber: number;
  hadithNumber: number;
  arabicText?: string;
  urduText?: string;
  englishText: string;
  grade: 'sahih' | 'hasan' | 'daif' | 'fabricated';
  chain?: string;
  narrator?: string;
  refUrl: string;
}

export interface AyahWithTranslation extends Ayah {
  translation: Translation;
  tafsir?: TafsirEntry;
}

export interface Story {
  id: number;
  prophetNameUr: string;
  prophetNameAr: string;
  titleUr: string;
  totalEpisodes: number;
  ageRange: string;
  difficulty: number;
  mainLessonUr: string;
  primaryTheme?: string;
  coverImage?: string;
}

export interface StoryEpisode {
  id: number;
  storyId: number;
  episodeNumber: number;
  titleUr: string;
  contentUr: string;
  durationSeconds: number;
  rootWordsFeatured: number[];
  ayaatFeatured: number[];
  audioUrl?: string;
  illustrationUrl?: string;
}

export interface Theme {
  id: number;
  nameUrdu: string;
  nameEnglish: string;
  nameArabic: string;
  descriptionUrdu?: string;
  icon: string;
  totalAyaat: number;
}

export interface Dimension {
  id: number;
  nameUrdu: string;
  nameEnglish: string;
  nameArabic: string;
  descriptionUrdu?: string;
  icon: string;
}

export type UserMode = 'noor' | 'fahm' | 'explore';

export type DepthLevel = 'simple' | 'intermediate' | 'deep' | 'scholar';

export interface UserProfile {
  mode: UserMode;
  language: string;
  arabicLevel: 'none' | 'beginner' | 'intermediate' | 'advanced';
  depthPreference: DepthLevel;
  profession?: string;
  lifeSituations: string[];
  goals: string[];
}