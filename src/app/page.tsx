import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateStreak, getTodayPages } from '@/lib/streaks';
import { calculateTotalPoints } from '@/lib/points';
import ProgressBar from '@/components/ProgressBar';
import StatsCard from '@/components/StatsCard';

async function getStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  const sessions = await prisma.readingSession.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  const books = await prisma.book.findMany({
    where: { userId },
  });

  const completedBooks = books.filter((b) => b.status === 'COMPLETED');
  const totalPagesRead = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const totalPoints = calculateTotalPoints(sessions);
  const sessionDates = sessions.map((s) => s.date);
  const currentStreak = calculateStreak(sessionDates);
  const todayPages = getTodayPages(sessions);

  const badges = await prisma.userBadge.findMany({
    where: { userId },
  });

  return {
    user,
    totalPagesRead,
    totalBooksCompleted: completedBooks.length,
    currentStreak,
    totalPoints,
    todayPages,
    badgeCount: badges.length,
    currentlyReading: books.filter((b) => b.status === 'READING').length,
  };
}

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const stats = await getStats(user.id);

  if (!stats) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/log"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Log Reading
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Progress</h2>
        <ProgressBar
          current={stats.todayPages}
          total={stats.user.readingGoal}
          label={`Daily Goal: ${stats.user.readingGoal} pages`}
          color="bg-green-500"
          size="lg"
        />
        {stats.todayPages >= stats.user.readingGoal && (
          <p className="text-green-600 mt-2 font-medium">Goal achieved! Great job!</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pages"
          value={stats.totalPagesRead.toLocaleString()}
          subtitle="pages read"
        />
        <StatsCard
          title="Books Completed"
          value={stats.totalBooksCompleted}
          subtitle={`${stats.currentlyReading} currently reading`}
        />
        <StatsCard
          title="Current Streak"
          value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`}
          subtitle="keep it going!"
        />
        <StatsCard
          title="Total Points"
          value={stats.totalPoints.toLocaleString()}
          subtitle={`${stats.badgeCount} badges earned`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/books/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            Add a Book
          </h3>
          <p className="text-gray-500 mt-1">Start tracking a new book</p>
        </Link>
        <Link
          href="/badges"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            View Badges
          </h3>
          <p className="text-gray-500 mt-1">
            {stats.badgeCount > 0
              ? `You've earned ${stats.badgeCount} badge${stats.badgeCount !== 1 ? 's' : ''}!`
              : 'Start reading to earn badges'}
          </p>
        </Link>
      </div>
    </div>
  );
}
