export type BookStatus = 'READING' | 'COMPLETED';

export type Genre =
  // Fiction (8)
  | 'LITERARY_FICTION'
  | 'CONTEMPORARY_FICTION'
  | 'HISTORICAL_FICTION'
  | 'SCIENCE_FICTION'
  | 'FANTASY'
  | 'MYSTERY_THRILLER'
  | 'ROMANCE'
  | 'HORROR'
  // Non-Fiction (11)
  | 'BIOGRAPHY_MEMOIR'
  | 'HISTORY'
  | 'SCIENCE_NATURE'
  | 'BUSINESS_ECONOMICS'
  | 'SELF_HELP'
  | 'PHILOSOPHY'
  | 'TRUE_CRIME'
  | 'HEALTH_FITNESS'
  | 'TRAVEL'
  | 'POLITICS_CURRENT_AFFAIRS'
  | 'TECHNOLOGY'
  // Other (4)
  | 'POETRY'
  | 'GRAPHIC_NOVELS_COMICS'
  | 'ESSAYS_COLLECTIONS'
  | 'REFERENCE_EDUCATIONAL';

export const GENRE_LABELS: Record<Genre, string> = {
  LITERARY_FICTION: 'Literary Fiction',
  CONTEMPORARY_FICTION: 'Contemporary Fiction',
  HISTORICAL_FICTION: 'Historical Fiction',
  SCIENCE_FICTION: 'Science Fiction',
  FANTASY: 'Fantasy',
  MYSTERY_THRILLER: 'Mystery & Thriller',
  ROMANCE: 'Romance',
  HORROR: 'Horror',
  BIOGRAPHY_MEMOIR: 'Biography & Memoir',
  HISTORY: 'History',
  SCIENCE_NATURE: 'Science & Nature',
  BUSINESS_ECONOMICS: 'Business & Economics',
  SELF_HELP: 'Self-Help',
  PHILOSOPHY: 'Philosophy',
  TRUE_CRIME: 'True Crime',
  HEALTH_FITNESS: 'Health & Fitness',
  TRAVEL: 'Travel',
  POLITICS_CURRENT_AFFAIRS: 'Politics & Current Affairs',
  TECHNOLOGY: 'Technology',
  POETRY: 'Poetry',
  GRAPHIC_NOVELS_COMICS: 'Graphic Novels & Comics',
  ESSAYS_COLLECTIONS: 'Essays & Collections',
  REFERENCE_EDUCATIONAL: 'Reference & Educational',
};

export const FICTION_GENRES: Genre[] = [
  'LITERARY_FICTION',
  'CONTEMPORARY_FICTION',
  'HISTORICAL_FICTION',
  'SCIENCE_FICTION',
  'FANTASY',
  'MYSTERY_THRILLER',
  'ROMANCE',
  'HORROR',
];

export const NON_FICTION_GENRES: Genre[] = [
  'BIOGRAPHY_MEMOIR',
  'HISTORY',
  'SCIENCE_NATURE',
  'BUSINESS_ECONOMICS',
  'SELF_HELP',
  'PHILOSOPHY',
  'TRUE_CRIME',
  'HEALTH_FITNESS',
  'TRAVEL',
  'POLITICS_CURRENT_AFFAIRS',
  'TECHNOLOGY',
];

export const OTHER_GENRES: Genre[] = [
  'POETRY',
  'GRAPHIC_NOVELS_COMICS',
  'ESSAYS_COLLECTIONS',
  'REFERENCE_EDUCATIONAL',
];

export const ALL_GENRES: Genre[] = [...FICTION_GENRES, ...NON_FICTION_GENRES, ...OTHER_GENRES];

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type BadgeCategory =
  | 'pages_read'
  | 'books_completed'
  | 'consistency'
  | 'genre_diversity'
  | 'fiction_mastery'
  | 'nonfiction_mastery'
  | 'other_mastery';

export interface BadgeDefinition {
  id: string;
  category: BadgeCategory;
  tier: BadgeTier;
  level: number;
  threshold: number;
  name: string;
  description: string;
}

export interface UserStats {
  totalPagesRead: number;
  totalBooksCompleted: number;
  currentStreak: number;
  totalPoints: number;
  todayPages: number;
  uniqueGenres: number;
  fictionBooksCompleted: number;
  nonfictionBooksCompleted: number;
  otherBooksCompleted: number;
}
