import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { BADGE_CATEGORIES, getBadgesByCategory, getStatValueForCategory } from '@/lib/badges';
import { calculateStreak } from '@/lib/streaks';
import BadgeCategory from '@/components/BadgeCategory';
import { FICTION_GENRES, NON_FICTION_GENRES, OTHER_GENRES, UserStats, Genre } from '@/types';

async function getBadgeData(userId: string) {
  const badges = await prisma.userBadge.findMany({
    where: { userId },
  });

  const sessions = await prisma.readingSession.findMany({
    where: { userId },
  });

  const books = await prisma.book.findMany({
    where: { userId },
  });

  const completedBooks = books.filter((b) => b.status === 'COMPLETED');
  const totalPagesRead = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const sessionDates = sessions.map((s) => s.date);
  const currentStreak = calculateStreak(sessionDates);

  const uniqueGenres = new Set(completedBooks.map((b) => b.genre)).size;

  const fictionBooksCompleted = completedBooks.filter((b) =>
    FICTION_GENRES.includes(b.genre as Genre)
  ).length;
  const nonfictionBooksCompleted = completedBooks.filter((b) =>
    NON_FICTION_GENRES.includes(b.genre as Genre)
  ).length;
  const otherBooksCompleted = completedBooks.filter((b) =>
    OTHER_GENRES.includes(b.genre as Genre)
  ).length;

  const stats: UserStats = {
    totalPagesRead,
    totalBooksCompleted: completedBooks.length,
    currentStreak,
    totalPoints: 0,
    todayPages: 0,
    uniqueGenres,
    fictionBooksCompleted,
    nonfictionBooksCompleted,
    otherBooksCompleted,
  };

  return {
    earnedBadgeIds: badges.map((b) => b.badgeId),
    stats,
  };
}

export default async function BadgesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const { earnedBadgeIds, stats } = await getBadgeData(user.id);
  const totalEarned = earnedBadgeIds.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Badges</h1>
        <p className="text-gray-500 mt-1">
          You&apos;ve earned {totalEarned} badge{totalEarned !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-6">
        {BADGE_CATEGORIES.map((category) => (
          <BadgeCategory
            key={category.id}
            name={category.name}
            description={category.description}
            badges={getBadgesByCategory(category.id)}
            earnedBadgeIds={earnedBadgeIds}
            currentValue={getStatValueForCategory(stats, category.id)}
          />
        ))}
      </div>
    </div>
  );
}
