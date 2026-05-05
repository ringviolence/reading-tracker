import { prisma } from './db';
import { computeLevel } from './levels';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond';
export type BadgeLine =
  | 'pages_turned'
  | 'daily_devotion'
  | 'steady_hand'
  | 'polyglot'
  | 'genre_wanderer'
  | 'tome_tamer'
  | 'sprint_reader';

export interface BadgeDefinition {
  id: string;
  line: BadgeLine;
  tier: BadgeTier;
  icon: string;
  name: string;
  description: string;
  threshold: number;
  xpGranted: number;
}

export const TIER_XP: Record<BadgeTier, number> = {
  bronze: 100,
  silver: 250,
  gold: 600,
  diamond: 1500,
};

export const TIER_COLORS: Record<BadgeTier, { bg: string; border: string; text: string }> = {
  bronze: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700' },
  silver: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-600' },
  gold: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-700' },
  diamond: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-700' },
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Pages Turned — total pages read this season
  { id: 'pages_turned_bronze', line: 'pages_turned', tier: 'bronze', icon: '📖', name: 'Pages Turned', description: 'Read 250 pages this season', threshold: 250, xpGranted: TIER_XP.bronze },
  { id: 'pages_turned_silver', line: 'pages_turned', tier: 'silver', icon: '📖', name: 'Pages Turned', description: 'Read 750 pages this season', threshold: 750, xpGranted: TIER_XP.silver },
  { id: 'pages_turned_gold', line: 'pages_turned', tier: 'gold', icon: '📖', name: 'Pages Turned', description: 'Read 2,000 pages this season', threshold: 2000, xpGranted: TIER_XP.gold },
  { id: 'pages_turned_diamond', line: 'pages_turned', tier: 'diamond', icon: '📖', name: 'Pages Turned', description: 'Read 5,000 pages this season', threshold: 5000, xpGranted: TIER_XP.diamond },

  // Daily Devotion — longest consecutive-day streak this season
  { id: 'daily_devotion_bronze', line: 'daily_devotion', tier: 'bronze', icon: '🔥', name: 'Daily Devotion', description: '7-day reading streak this season', threshold: 7, xpGranted: TIER_XP.bronze },
  { id: 'daily_devotion_silver', line: 'daily_devotion', tier: 'silver', icon: '🔥', name: 'Daily Devotion', description: '21-day reading streak this season', threshold: 21, xpGranted: TIER_XP.silver },
  { id: 'daily_devotion_gold', line: 'daily_devotion', tier: 'gold', icon: '🔥', name: 'Daily Devotion', description: '45-day reading streak this season', threshold: 45, xpGranted: TIER_XP.gold },
  { id: 'daily_devotion_diamond', line: 'daily_devotion', tier: 'diamond', icon: '🔥', name: 'Daily Devotion', description: 'Perfect 90-day streak this season', threshold: 90, xpGranted: TIER_XP.diamond },

  // Steady Hand — distinct weeks with ≥1 reading day this season
  { id: 'steady_hand_bronze', line: 'steady_hand', tier: 'bronze', icon: '📅', name: 'Steady Hand', description: 'Read in 4 different weeks this season', threshold: 4, xpGranted: TIER_XP.bronze },
  { id: 'steady_hand_silver', line: 'steady_hand', tier: 'silver', icon: '📅', name: 'Steady Hand', description: 'Read in 8 different weeks this season', threshold: 8, xpGranted: TIER_XP.silver },
  { id: 'steady_hand_gold', line: 'steady_hand', tier: 'gold', icon: '📅', name: 'Steady Hand', description: 'Read in 11 different weeks this season', threshold: 11, xpGranted: TIER_XP.gold },
  { id: 'steady_hand_diamond', line: 'steady_hand', tier: 'diamond', icon: '📅', name: 'Steady Hand', description: 'Read in all 13 weeks this season', threshold: 13, xpGranted: TIER_XP.diamond },

  // Polyglot — distinct languages of books finished this season
  { id: 'polyglot_bronze', line: 'polyglot', tier: 'bronze', icon: '🌍', name: 'Polyglot', description: 'Finish books in 2 languages this season', threshold: 2, xpGranted: TIER_XP.bronze },
  { id: 'polyglot_silver', line: 'polyglot', tier: 'silver', icon: '🌍', name: 'Polyglot', description: 'Finish books in 3 languages this season', threshold: 3, xpGranted: TIER_XP.silver },
  { id: 'polyglot_gold', line: 'polyglot', tier: 'gold', icon: '🌍', name: 'Polyglot', description: 'Finish books in 4 languages this season', threshold: 4, xpGranted: TIER_XP.gold },
  { id: 'polyglot_diamond', line: 'polyglot', tier: 'diamond', icon: '🌍', name: 'Polyglot', description: 'Finish books in 5 languages this season', threshold: 5, xpGranted: TIER_XP.diamond },

  // Genre Wanderer — distinct genres of books finished this season
  { id: 'genre_wanderer_bronze', line: 'genre_wanderer', tier: 'bronze', icon: '🧭', name: 'Genre Wanderer', description: 'Finish books in 3 genres this season', threshold: 3, xpGranted: TIER_XP.bronze },
  { id: 'genre_wanderer_silver', line: 'genre_wanderer', tier: 'silver', icon: '🧭', name: 'Genre Wanderer', description: 'Finish books in 5 genres this season', threshold: 5, xpGranted: TIER_XP.silver },
  { id: 'genre_wanderer_gold', line: 'genre_wanderer', tier: 'gold', icon: '🧭', name: 'Genre Wanderer', description: 'Finish books in 8 genres this season', threshold: 8, xpGranted: TIER_XP.gold },
  { id: 'genre_wanderer_diamond', line: 'genre_wanderer', tier: 'diamond', icon: '🧭', name: 'Genre Wanderer', description: 'Finish books in 12 genres this season', threshold: 12, xpGranted: TIER_XP.diamond },

  // Tome Tamer — biggest single book finished this season (by page count)
  { id: 'tome_tamer_bronze', line: 'tome_tamer', tier: 'bronze', icon: '🏔️', name: 'Tome Tamer', description: 'Finish a 300+ page book this season', threshold: 300, xpGranted: TIER_XP.bronze },
  { id: 'tome_tamer_silver', line: 'tome_tamer', tier: 'silver', icon: '🏔️', name: 'Tome Tamer', description: 'Finish a 500+ page book this season', threshold: 500, xpGranted: TIER_XP.silver },
  { id: 'tome_tamer_gold', line: 'tome_tamer', tier: 'gold', icon: '🏔️', name: 'Tome Tamer', description: 'Finish a 750+ page book this season', threshold: 750, xpGranted: TIER_XP.gold },
  { id: 'tome_tamer_diamond', line: 'tome_tamer', tier: 'diamond', icon: '🏔️', name: 'Tome Tamer', description: 'Finish a 1,000+ page book this season', threshold: 1000, xpGranted: TIER_XP.diamond },

  // Sprint Reader — most pages read in a single day this season
  { id: 'sprint_reader_bronze', line: 'sprint_reader', tier: 'bronze', icon: '⚡', name: 'Sprint Reader', description: 'Read 50+ pages in a single day this season', threshold: 50, xpGranted: TIER_XP.bronze },
  { id: 'sprint_reader_silver', line: 'sprint_reader', tier: 'silver', icon: '⚡', name: 'Sprint Reader', description: 'Read 100+ pages in a single day this season', threshold: 100, xpGranted: TIER_XP.silver },
  { id: 'sprint_reader_gold', line: 'sprint_reader', tier: 'gold', icon: '⚡', name: 'Sprint Reader', description: 'Read 200+ pages in a single day this season', threshold: 200, xpGranted: TIER_XP.gold },
  { id: 'sprint_reader_diamond', line: 'sprint_reader', tier: 'diamond', icon: '⚡', name: 'Sprint Reader', description: 'Read 400+ pages in a single day this season', threshold: 400, xpGranted: TIER_XP.diamond },
];

export const BADGE_LINES: { id: BadgeLine; name: string; description: string; icon: string }[] = [
  { id: 'pages_turned', name: 'Pages Turned', description: 'Total pages read this season', icon: '📖' },
  { id: 'daily_devotion', name: 'Daily Devotion', description: 'Longest consecutive reading streak this season', icon: '🔥' },
  { id: 'steady_hand', name: 'Steady Hand', description: 'Weeks with at least one reading day this season', icon: '📅' },
  { id: 'polyglot', name: 'Polyglot', description: 'Languages of completed books this season', icon: '🌍' },
  { id: 'genre_wanderer', name: 'Genre Wanderer', description: 'Genres of completed books this season', icon: '🧭' },
  { id: 'tome_tamer', name: 'Tome Tamer', description: 'Biggest book completed this season (pages)', icon: '🏔️' },
  { id: 'sprint_reader', name: 'Sprint Reader', description: 'Most pages read in a single day this season', icon: '⚡' },
];

export interface SeasonMetrics {
  pagesRead: number;
  longestStreak: number;
  weeksActive: number;
  distinctLanguages: number;
  distinctGenres: number;
  biggestBook: number;
  maxPagesInDay: number;
}

export function getMetricValue(line: BadgeLine, metrics: SeasonMetrics): number {
  switch (line) {
    case 'pages_turned': return metrics.pagesRead;
    case 'daily_devotion': return metrics.longestStreak;
    case 'steady_hand': return metrics.weeksActive;
    case 'polyglot': return metrics.distinctLanguages;
    case 'genre_wanderer': return metrics.distinctGenres;
    case 'tome_tamer': return metrics.biggestBook;
    case 'sprint_reader': return metrics.maxPagesInDay;
  }
}

function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}

function longestConsecutiveStreak(sortedDayKeys: string[]): number {
  if (sortedDayKeys.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sortedDayKeys.length; i++) {
    const diff = Math.round(
      (new Date(sortedDayKeys[i] + 'T00:00:00Z').getTime() -
        new Date(sortedDayKeys[i - 1] + 'T00:00:00Z').getTime()) /
        86400000,
    );
    if (diff === 1) {
      longest = Math.max(longest, ++current);
    } else {
      current = 1;
    }
  }
  return longest;
}

export function computeSeasonMetrics(
  sessions: { date: Date; pagesRead: number }[],
  completedBooks: { language: string; genre: string; totalPages: number }[],
): SeasonMetrics {
  const dayTotals = new Map<string, number>();
  for (const s of sessions) {
    const key = s.date.toISOString().split('T')[0];
    dayTotals.set(key, (dayTotals.get(key) || 0) + s.pagesRead);
  }

  const sortedDays = Array.from(dayTotals.keys()).sort();

  return {
    pagesRead: sessions.reduce((sum, s) => sum + s.pagesRead, 0),
    longestStreak: longestConsecutiveStreak(sortedDays),
    weeksActive: new Set(sessions.map((s) => isoWeekKey(s.date))).size,
    distinctLanguages: new Set(completedBooks.map((b) => b.language)).size,
    distinctGenres: new Set(completedBooks.map((b) => b.genre)).size,
    biggestBook: completedBooks.reduce((max, b) => Math.max(max, b.totalPages), 0),
    maxPagesInDay: dayTotals.size > 0 ? Math.max(...Array.from(dayTotals.values())) : 0,
  };
}

export function getNextBadge(
  earnedBadgeIds: string[],
  metrics: SeasonMetrics,
): { badge: BadgeDefinition; currentValue: number; progress: number } | null {
  let best: { badge: BadgeDefinition; currentValue: number; progress: number } | null = null;
  for (const badge of BADGE_DEFINITIONS) {
    if (earnedBadgeIds.includes(badge.id)) continue;
    const currentValue = getMetricValue(badge.line, metrics);
    const progress = currentValue / badge.threshold;
    if (!best || progress > best.progress) {
      best = { badge, currentValue, progress };
    }
  }
  return best;
}

export function getBadgesByLine(line: BadgeLine): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter((b) => b.line === line);
}

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.id === id);
}

export async function refreshSeasonProgress(
  userId: string,
  season: { id: string; startDate: Date; endDate: Date },
): Promise<{ newBadges: BadgeDefinition[]; xp: number; level: number }> {
  const [sessions, completedBooks, existingAwards] = await Promise.all([
    prisma.readingSession.findMany({
      where: { userId, date: { gte: season.startDate, lte: season.endDate } },
    }),
    prisma.book.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: season.startDate, lte: season.endDate },
      },
    }),
    prisma.badgeAward.findMany({ where: { userId, seasonId: season.id } }),
  ]);

  const metrics = computeSeasonMetrics(sessions, completedBooks);
  const awardedIds = new Set(existingAwards.map((a) => a.badgeId));

  const newBadges: BadgeDefinition[] = [];
  for (const badge of BADGE_DEFINITIONS) {
    if (awardedIds.has(badge.id)) continue;
    if (getMetricValue(badge.line, metrics) >= badge.threshold) {
      newBadges.push(badge);
    }
  }

  if (newBadges.length > 0) {
    await prisma.badgeAward.createMany({
      data: newBadges.map((b) => ({
        userId,
        seasonId: season.id,
        badgeId: b.id,
        tier: b.tier,
        xpGranted: b.xpGranted,
      })),
    });
  }

  const badgeXp =
    existingAwards.reduce((sum, a) => sum + a.xpGranted, 0) +
    newBadges.reduce((sum, b) => sum + b.xpGranted, 0);
  const pageXp = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const completionXp = completedBooks.length * 50;
  const totalXp = pageXp + completionXp + badgeXp;
  const level = computeLevel(totalXp);

  await prisma.seasonProgress.upsert({
    where: { userId_seasonId: { userId, seasonId: season.id } },
    create: { userId, seasonId: season.id, xp: totalXp, level },
    update: { xp: totalXp, level },
  });

  return { newBadges, xp: totalXp, level };
}
