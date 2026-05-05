import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateStreak } from '@/lib/streaks';
import { getCurrentSeason } from '@/lib/seasons';
import { getLevelProgress } from '@/lib/levels';
import { computeSeasonMetrics, getNextBadge, TIER_COLORS } from '@/lib/badges';
import ProgressBar from '@/components/ProgressBar';
import StatsCard from '@/components/StatsCard';
import BookCard from '@/components/BookCard';

async function getDashboardData(userId: string) {
  const seasonInfo = getCurrentSeason();

  const [allSessions, books, season] = await Promise.all([
    prisma.readingSession.findMany({ where: { userId }, orderBy: { date: 'desc' } }),
    prisma.book.findMany({ where: { userId } }),
    prisma.season.findUnique({
      where: { year_name: { year: seasonInfo.year, name: seasonInfo.name } },
    }),
  ]);

  const completedBooks = books.filter((b) => b.status === 'COMPLETED');
  const currentlyReadingBooks = books.filter((b) => b.status === 'READING');
  const totalPagesRead = allSessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const currentStreak = calculateStreak(allSessions.map((s) => s.date));

  let seasonProgress = { xp: 0, level: 0 };
  let nextBadge = null;

  if (season) {
    const [sp, badgeAwards] = await Promise.all([
      prisma.seasonProgress.findUnique({
        where: { userId_seasonId: { userId, seasonId: season.id } },
      }),
      prisma.badgeAward.findMany({ where: { userId, seasonId: season.id } }),
    ]);

    if (sp) seasonProgress = { xp: sp.xp, level: sp.level };

    const seasonSessions = allSessions.filter(
      (s) => s.date >= season.startDate && s.date <= season.endDate,
    );
    const seasonCompletedBooks = completedBooks.filter(
      (b) => b.completedAt && b.completedAt >= season.startDate && b.completedAt <= season.endDate,
    );

    const metrics = computeSeasonMetrics(seasonSessions, seasonCompletedBooks);
    nextBadge = getNextBadge(
      badgeAwards.map((a) => a.badgeId),
      metrics,
    );
  }

  return {
    seasonInfo,
    seasonProgress,
    currentStreak,
    totalPagesRead,
    totalBooksCompleted: completedBooks.length,
    currentlyReadingBooks,
    nextBadge,
  };
}

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const data = await getDashboardData(user.id);
  const levelProgress = getLevelProgress(data.seasonProgress.xp);

  return (
    <div className="space-y-8">
      {/* Season header + XP bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">{data.seasonInfo.label}</h2>
            <p className="text-sm text-gray-500">Level {levelProgress.level}</p>
          </div>
          <span className="text-2xl font-bold text-forest">{data.seasonProgress.xp} XP</span>
        </div>
        <ProgressBar
          current={levelProgress.xpIntoLevel}
          total={levelProgress.xpForThisLevel}
          label={`${levelProgress.xpIntoLevel} / ${levelProgress.xpForThisLevel} XP to level ${levelProgress.level + 1}`}
          color="bg-forest"
          size="lg"
        />
      </div>

      {/* Currently Reading */}
      {data.currentlyReadingBooks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-ink">Currently Reading</h2>
            <Link
              href="/log"
              className="px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-dark transition-colors text-sm font-medium"
            >
              Log Reading
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.currentlyReadingBooks.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                subtitle={book.subtitle}
                author={book.author}
                genre={book.genre}
                currentPage={book.currentPage}
                totalPages={book.totalPages}
                status={book.status}
                coverImage={book.coverImage}
                isbn={book.isbn}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Pages" value={data.totalPagesRead.toLocaleString()} subtitle="all time" />
        <StatsCard title="Completed" value={data.totalBooksCompleted} subtitle="books" />
        <StatsCard
          title="Streak"
          value={data.currentStreak}
          subtitle={`day${data.currentStreak !== 1 ? 's' : ''}`}
        />
        <StatsCard title="Season Level" value={data.seasonProgress.level} subtitle={data.seasonInfo.label} />
      </div>

      {/* Next badge */}
      {data.nextBadge && (() => {
        const { badge, currentValue, progress } = data.nextBadge;
        const colors = TIER_COLORS[badge.tier];
        const pct = Math.min(100, Math.round(progress * 100));
        return (
          <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${colors.border}`}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Next Badge</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{badge.icon}</span>
              <span className={`font-semibold text-sm capitalize ${colors.text}`}>{badge.tier}</span>
              <span className="font-semibold text-ink">{badge.name}</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">{badge.description}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`${colors.border.replace('border-', 'bg-')} h-2 rounded-full transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {currentValue} / {badge.threshold}
              </span>
            </div>
          </div>
        );
      })()}

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/books/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-semibold text-ink group-hover:text-forest">Add a Book</h3>
          <p className="text-gray-500 mt-1">Start tracking a new book</p>
        </Link>
        <Link
          href="/badges"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-semibold text-ink group-hover:text-forest">View Badges</h3>
          <p className="text-gray-500 mt-1">See your {data.seasonInfo.label} progress</p>
        </Link>
      </div>
    </div>
  );
}
