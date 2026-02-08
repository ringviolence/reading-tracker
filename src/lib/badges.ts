import { BadgeDefinition, BadgeCategory, BadgeTier, UserStats } from '@/types';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Pages Read
  { id: 'pages_read_bronze_1', category: 'pages_read', tier: 'bronze', level: 1, threshold: 100, name: 'Page Turner I', description: 'Read 100 pages' },
  { id: 'pages_read_bronze_2', category: 'pages_read', tier: 'bronze', level: 2, threshold: 250, name: 'Page Turner II', description: 'Read 250 pages' },
  { id: 'pages_read_bronze_3', category: 'pages_read', tier: 'bronze', level: 3, threshold: 500, name: 'Page Turner III', description: 'Read 500 pages' },
  { id: 'pages_read_silver_1', category: 'pages_read', tier: 'silver', level: 1, threshold: 1000, name: 'Avid Reader I', description: 'Read 1,000 pages' },
  { id: 'pages_read_silver_2', category: 'pages_read', tier: 'silver', level: 2, threshold: 2000, name: 'Avid Reader II', description: 'Read 2,000 pages' },
  { id: 'pages_read_silver_3', category: 'pages_read', tier: 'silver', level: 3, threshold: 3000, name: 'Avid Reader III', description: 'Read 3,000 pages' },
  { id: 'pages_read_gold_1', category: 'pages_read', tier: 'gold', level: 1, threshold: 5000, name: 'Bookworm I', description: 'Read 5,000 pages' },
  { id: 'pages_read_gold_2', category: 'pages_read', tier: 'gold', level: 2, threshold: 8000, name: 'Bookworm II', description: 'Read 8,000 pages' },
  { id: 'pages_read_gold_3', category: 'pages_read', tier: 'gold', level: 3, threshold: 12000, name: 'Bookworm III', description: 'Read 12,000 pages' },
  { id: 'pages_read_platinum_1', category: 'pages_read', tier: 'platinum', level: 1, threshold: 15000, name: 'Legend I', description: 'Read 15,000 pages' },
  { id: 'pages_read_platinum_2', category: 'pages_read', tier: 'platinum', level: 2, threshold: 20000, name: 'Legend II', description: 'Read 20,000 pages' },

  // Books Completed
  { id: 'books_completed_bronze_1', category: 'books_completed', tier: 'bronze', level: 1, threshold: 1, name: 'First Finish', description: 'Complete 1 book' },
  { id: 'books_completed_bronze_2', category: 'books_completed', tier: 'bronze', level: 2, threshold: 3, name: 'Getting Started', description: 'Complete 3 books' },
  { id: 'books_completed_bronze_3', category: 'books_completed', tier: 'bronze', level: 3, threshold: 5, name: 'Building Momentum', description: 'Complete 5 books' },
  { id: 'books_completed_silver_1', category: 'books_completed', tier: 'silver', level: 1, threshold: 10, name: 'Double Digits', description: 'Complete 10 books' },
  { id: 'books_completed_silver_2', category: 'books_completed', tier: 'silver', level: 2, threshold: 15, name: 'Bookshelf Builder', description: 'Complete 15 books' },
  { id: 'books_completed_silver_3', category: 'books_completed', tier: 'silver', level: 3, threshold: 20, name: 'Serious Reader', description: 'Complete 20 books' },
  { id: 'books_completed_gold_1', category: 'books_completed', tier: 'gold', level: 1, threshold: 25, name: 'Quarter Century', description: 'Complete 25 books' },
  { id: 'books_completed_gold_2', category: 'books_completed', tier: 'gold', level: 2, threshold: 30, name: 'Library Builder', description: 'Complete 30 books' },
  { id: 'books_completed_gold_3', category: 'books_completed', tier: 'gold', level: 3, threshold: 40, name: 'Voracious Reader', description: 'Complete 40 books' },
  { id: 'books_completed_platinum_1', category: 'books_completed', tier: 'platinum', level: 1, threshold: 50, name: 'Half Century', description: 'Complete 50 books' },

  // Consistency (Streak)
  { id: 'consistency_bronze_1', category: 'consistency', tier: 'bronze', level: 1, threshold: 3, name: 'Three-Peat', description: '3-day reading streak' },
  { id: 'consistency_bronze_2', category: 'consistency', tier: 'bronze', level: 2, threshold: 7, name: 'Week Warrior', description: '7-day reading streak' },
  { id: 'consistency_bronze_3', category: 'consistency', tier: 'bronze', level: 3, threshold: 14, name: 'Fortnight Focus', description: '14-day reading streak' },
  { id: 'consistency_silver_1', category: 'consistency', tier: 'silver', level: 1, threshold: 21, name: 'Three Weeks Strong', description: '21-day reading streak' },
  { id: 'consistency_silver_2', category: 'consistency', tier: 'silver', level: 2, threshold: 30, name: 'Monthly Master', description: '30-day reading streak' },
  { id: 'consistency_silver_3', category: 'consistency', tier: 'silver', level: 3, threshold: 45, name: 'Six Week Streak', description: '45-day reading streak' },
  { id: 'consistency_gold_1', category: 'consistency', tier: 'gold', level: 1, threshold: 60, name: 'Two Month Trek', description: '60-day reading streak' },
  { id: 'consistency_gold_2', category: 'consistency', tier: 'gold', level: 2, threshold: 75, name: 'Quarterly Quest', description: '75-day reading streak' },
  { id: 'consistency_gold_3', category: 'consistency', tier: 'gold', level: 3, threshold: 90, name: 'Three Month Miracle', description: '90-day reading streak' },
  { id: 'consistency_platinum_1', category: 'consistency', tier: 'platinum', level: 1, threshold: 100, name: 'Century Club', description: '100-day reading streak' },

  // Genre Diversity
  { id: 'genre_diversity_bronze_1', category: 'genre_diversity', tier: 'bronze', level: 1, threshold: 2, name: 'Curious Mind', description: 'Complete books in 2 genres' },
  { id: 'genre_diversity_bronze_2', category: 'genre_diversity', tier: 'bronze', level: 2, threshold: 3, name: 'Varied Tastes', description: 'Complete books in 3 genres' },
  { id: 'genre_diversity_bronze_3', category: 'genre_diversity', tier: 'bronze', level: 3, threshold: 5, name: 'Genre Explorer', description: 'Complete books in 5 genres' },
  { id: 'genre_diversity_silver_1', category: 'genre_diversity', tier: 'silver', level: 1, threshold: 7, name: 'Wide Reader', description: 'Complete books in 7 genres' },
  { id: 'genre_diversity_silver_2', category: 'genre_diversity', tier: 'silver', level: 2, threshold: 10, name: 'Literary Adventurer', description: 'Complete books in 10 genres' },
  { id: 'genre_diversity_silver_3', category: 'genre_diversity', tier: 'silver', level: 3, threshold: 12, name: 'Eclectic Reader', description: 'Complete books in 12 genres' },
  { id: 'genre_diversity_gold_1', category: 'genre_diversity', tier: 'gold', level: 1, threshold: 15, name: 'Genre Connoisseur', description: 'Complete books in 15 genres' },
  { id: 'genre_diversity_gold_2', category: 'genre_diversity', tier: 'gold', level: 2, threshold: 18, name: 'Literary Polymath', description: 'Complete books in 18 genres' },
  { id: 'genre_diversity_gold_3', category: 'genre_diversity', tier: 'gold', level: 3, threshold: 20, name: 'Genre Master', description: 'Complete books in 20 genres' },
  { id: 'genre_diversity_platinum_1', category: 'genre_diversity', tier: 'platinum', level: 1, threshold: 23, name: 'Universal Reader', description: 'Complete books in all 23 genres' },

  // Fiction Mastery
  { id: 'fiction_mastery_bronze_1', category: 'fiction_mastery', tier: 'bronze', level: 1, threshold: 1, name: 'Fiction Finder', description: 'Complete 1 fiction book' },
  { id: 'fiction_mastery_bronze_2', category: 'fiction_mastery', tier: 'bronze', level: 2, threshold: 3, name: 'Story Seeker', description: 'Complete 3 fiction books' },
  { id: 'fiction_mastery_bronze_3', category: 'fiction_mastery', tier: 'bronze', level: 3, threshold: 5, name: 'Tale Collector', description: 'Complete 5 fiction books' },
  { id: 'fiction_mastery_silver_1', category: 'fiction_mastery', tier: 'silver', level: 1, threshold: 8, name: 'Fiction Fan', description: 'Complete 8 fiction books' },
  { id: 'fiction_mastery_silver_2', category: 'fiction_mastery', tier: 'silver', level: 2, threshold: 12, name: 'Story Lover', description: 'Complete 12 fiction books' },
  { id: 'fiction_mastery_silver_3', category: 'fiction_mastery', tier: 'silver', level: 3, threshold: 15, name: 'Narrative Navigator', description: 'Complete 15 fiction books' },
  { id: 'fiction_mastery_gold_1', category: 'fiction_mastery', tier: 'gold', level: 1, threshold: 20, name: 'Fiction Aficionado', description: 'Complete 20 fiction books' },
  { id: 'fiction_mastery_gold_2', category: 'fiction_mastery', tier: 'gold', level: 2, threshold: 25, name: 'Story Sage', description: 'Complete 25 fiction books' },
  { id: 'fiction_mastery_gold_3', category: 'fiction_mastery', tier: 'gold', level: 3, threshold: 30, name: 'Fiction Maestro', description: 'Complete 30 fiction books' },
  { id: 'fiction_mastery_platinum_1', category: 'fiction_mastery', tier: 'platinum', level: 1, threshold: 40, name: 'Fiction Legend', description: 'Complete 40 fiction books' },

  // Non-Fiction Mastery
  { id: 'nonfiction_mastery_bronze_1', category: 'nonfiction_mastery', tier: 'bronze', level: 1, threshold: 1, name: 'Fact Finder', description: 'Complete 1 non-fiction book' },
  { id: 'nonfiction_mastery_bronze_2', category: 'nonfiction_mastery', tier: 'bronze', level: 2, threshold: 3, name: 'Knowledge Seeker', description: 'Complete 3 non-fiction books' },
  { id: 'nonfiction_mastery_bronze_3', category: 'nonfiction_mastery', tier: 'bronze', level: 3, threshold: 5, name: 'Truth Hunter', description: 'Complete 5 non-fiction books' },
  { id: 'nonfiction_mastery_silver_1', category: 'nonfiction_mastery', tier: 'silver', level: 1, threshold: 8, name: 'Non-Fiction Fan', description: 'Complete 8 non-fiction books' },
  { id: 'nonfiction_mastery_silver_2', category: 'nonfiction_mastery', tier: 'silver', level: 2, threshold: 12, name: 'Knowledge Lover', description: 'Complete 12 non-fiction books' },
  { id: 'nonfiction_mastery_silver_3', category: 'nonfiction_mastery', tier: 'silver', level: 3, threshold: 15, name: 'Wisdom Seeker', description: 'Complete 15 non-fiction books' },
  { id: 'nonfiction_mastery_gold_1', category: 'nonfiction_mastery', tier: 'gold', level: 1, threshold: 20, name: 'Non-Fiction Aficionado', description: 'Complete 20 non-fiction books' },
  { id: 'nonfiction_mastery_gold_2', category: 'nonfiction_mastery', tier: 'gold', level: 2, threshold: 25, name: 'Knowledge Sage', description: 'Complete 25 non-fiction books' },
  { id: 'nonfiction_mastery_gold_3', category: 'nonfiction_mastery', tier: 'gold', level: 3, threshold: 30, name: 'Non-Fiction Maestro', description: 'Complete 30 non-fiction books' },
  { id: 'nonfiction_mastery_platinum_1', category: 'nonfiction_mastery', tier: 'platinum', level: 1, threshold: 40, name: 'Non-Fiction Legend', description: 'Complete 40 non-fiction books' },

  // Other Mastery
  { id: 'other_mastery_bronze_1', category: 'other_mastery', tier: 'bronze', level: 1, threshold: 1, name: 'Alternative Reader', description: 'Complete 1 other genre book' },
  { id: 'other_mastery_bronze_2', category: 'other_mastery', tier: 'bronze', level: 2, threshold: 2, name: 'Format Explorer', description: 'Complete 2 other genre books' },
  { id: 'other_mastery_bronze_3', category: 'other_mastery', tier: 'bronze', level: 3, threshold: 3, name: 'Diverse Reader', description: 'Complete 3 other genre books' },
  { id: 'other_mastery_silver_1', category: 'other_mastery', tier: 'silver', level: 1, threshold: 5, name: 'Other Genre Fan', description: 'Complete 5 other genre books' },
  { id: 'other_mastery_silver_2', category: 'other_mastery', tier: 'silver', level: 2, threshold: 8, name: 'Unconventional Reader', description: 'Complete 8 other genre books' },
  { id: 'other_mastery_silver_3', category: 'other_mastery', tier: 'silver', level: 3, threshold: 10, name: 'Unique Tastes', description: 'Complete 10 other genre books' },
  { id: 'other_mastery_gold_1', category: 'other_mastery', tier: 'gold', level: 1, threshold: 15, name: 'Other Genre Aficionado', description: 'Complete 15 other genre books' },
  { id: 'other_mastery_gold_2', category: 'other_mastery', tier: 'gold', level: 2, threshold: 20, name: 'Alternative Sage', description: 'Complete 20 other genre books' },
  { id: 'other_mastery_gold_3', category: 'other_mastery', tier: 'gold', level: 3, threshold: 25, name: 'Other Genre Maestro', description: 'Complete 25 other genre books' },
  { id: 'other_mastery_platinum_1', category: 'other_mastery', tier: 'platinum', level: 1, threshold: 30, name: 'Other Genre Legend', description: 'Complete 30 other genre books' },
];

export const BADGE_CATEGORIES: { id: BadgeCategory; name: string; description: string }[] = [
  { id: 'pages_read', name: 'Pages Read', description: 'Total pages read across all books' },
  { id: 'books_completed', name: 'Books Completed', description: 'Total books finished' },
  { id: 'consistency', name: 'Consistency', description: 'Reading streak achievements' },
  { id: 'genre_diversity', name: 'Genre Diversity', description: 'Different genres explored' },
  { id: 'fiction_mastery', name: 'Fiction Mastery', description: 'Fiction books completed' },
  { id: 'nonfiction_mastery', name: 'Non-Fiction Mastery', description: 'Non-fiction books completed' },
  { id: 'other_mastery', name: 'Other Mastery', description: 'Poetry, comics, essays completed' },
];

export const TIER_COLORS: Record<BadgeTier, { bg: string; border: string; text: string }> = {
  bronze: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700' },
  silver: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700' },
  gold: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700' },
  platinum: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700' },
};

export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter((b) => b.category === category);
}

export function getBadgeById(badgeId: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.id === badgeId);
}

export function getStatValueForCategory(stats: UserStats, category: BadgeCategory): number {
  switch (category) {
    case 'pages_read':
      return stats.totalPagesRead;
    case 'books_completed':
      return stats.totalBooksCompleted;
    case 'consistency':
      return stats.currentStreak;
    case 'genre_diversity':
      return stats.uniqueGenres;
    case 'fiction_mastery':
      return stats.fictionBooksCompleted;
    case 'nonfiction_mastery':
      return stats.nonfictionBooksCompleted;
    case 'other_mastery':
      return stats.otherBooksCompleted;
  }
}

export function checkNewBadges(stats: UserStats, earnedBadgeIds: string[]): BadgeDefinition[] {
  const newBadges: BadgeDefinition[] = [];

  for (const badge of BADGE_DEFINITIONS) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    const value = getStatValueForCategory(stats, badge.category);
    if (value >= badge.threshold) {
      newBadges.push(badge);
    }
  }

  return newBadges;
}
