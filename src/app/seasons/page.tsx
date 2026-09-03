import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getSeasonForDate, seasonKey, type SeasonInfo } from '@/lib/seasons';
import { summarizeSeason, badgeHint, highestBadgesPerLine } from '@/lib/badges';
import { GENRE_LABELS, type Genre } from '@/types';
import SeasonFeed, { type SeasonCard } from './SeasonFeed';

type SessionRow = { date: Date; pagesRead: number };
type BookRow = {
  id: string;
  title: string;
  author: string;
  genre: string;
  language: string;
  totalPages: number;
  coverImage: string | null;
  completedAt: Date | null;
};

async function getSeasonCards(userId: string): Promise<SeasonCard[]> {
  const [sessions, completedBooks] = await Promise.all([
    prisma.readingSession.findMany({
      where: { userId },
      select: { date: true, pagesRead: true },
    }),
    prisma.book.findMany({
      where: { userId, status: 'COMPLETED', completedAt: { not: null } },
      select: {
        id: true,
        title: true,
        author: true,
        genre: true,
        language: true,
        totalPages: true,
        coverImage: true,
        completedAt: true,
      },
    }),
  ]);

  // Bucket all activity into the season it falls in.
  const buckets = new Map<
    string,
    { info: SeasonInfo; sessions: SessionRow[]; books: BookRow[] }
  >();

  const bucketFor = (date: Date) => {
    const info = getSeasonForDate(date);
    const key = seasonKey(info);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { info, sessions: [], books: [] };
      buckets.set(key, bucket);
    }
    return bucket;
  };

  for (const s of sessions) bucketFor(s.date).sessions.push(s);
  for (const b of completedBooks as BookRow[]) {
    if (b.completedAt) bucketFor(b.completedAt).books.push(b);
  }

  const TIER_RANK: Record<string, number> = { bronze: 0, silver: 1, gold: 2, diamond: 3 };

  const cards: (SeasonCard & { sortKey: number })[] = [];
  for (const { info, sessions: seasonSessions, books } of Array.from(buckets.values())) {
    const summary = summarizeSeason(seasonSessions, books);
    cards.push({
      key: seasonKey(info),
      name: info.name,
      label: info.label,
      xp: summary.xp,
      level: summary.level,
      pagesRead: summary.metrics.pagesRead,
      bestDay: summary.metrics.maxPagesInDay,
      // One chip per badge line (highest tier reached), best first.
      badges: highestBadgesPerLine(summary.earnedBadges)
        .sort((a, b) => TIER_RANK[b.tier] - TIER_RANK[a.tier])
        .map((b) => ({
          id: b.id,
          name: b.name,
          icon: b.icon,
          tier: b.tier,
          hint: badgeHint(b),
        })),
      books: books
        .slice()
        .sort((a, b) => (b.completedAt!.getTime() - a.completedAt!.getTime()))
        .map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          genre: GENRE_LABELS[b.genre as Genre] ?? b.genre,
          totalPages: b.totalPages,
          coverImage: b.coverImage,
        })),
      sortKey: info.startDate.getTime(),
    });
  }

  // Most recent season first.
  cards.sort((a, b) => b.sortKey - a.sortKey);
  return cards.map(({ sortKey, ...card }) => card);
}

export default async function SeasonsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const seasons = await getSeasonCards(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Seasons</h1>
        <p className="text-gray-500 mt-1">
          A recap of every reading season — books finished, badges earned, and XP.
        </p>
      </div>

      {seasons.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <p className="text-gray-500">
            No reading logged yet. Your seasons will appear here once you start
            logging sessions.
          </p>
        </div>
      ) : (
        <SeasonFeed seasons={seasons} />
      )}
    </div>
  );
}
