import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateStreak } from '@/lib/streaks';
import { calculateTotalPoints } from '@/lib/points';
import ProgressBar from '@/components/ProgressBar';
import StatsCard from '@/components/StatsCard';
import BookCard from '@/components/BookCard';

async function getStats(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const sessions = await prisma.readingSession.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  const books = await prisma.book.findMany({ where: { userId } });
  const completedBooks = books.filter((b) => b.status === 'COMPLETED');
  const currentlyReadingBooks = books.filter((b) => b.status === 'READING');

  const totalPagesRead = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
  const totalPoints = calculateTotalPoints(sessions);
  const currentStreak = calculateStreak(sessions.map((s) => s.date));

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyPages = sessions
    .filter((s) => new Date(s.date) >= startOfMonth)
    .reduce((sum, s) => sum + s.pagesRead, 0);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthlyGoal = user.readingGoal * daysInMonth;
  const monthName = now.toLocaleString('en-US', { month: 'long' });

  const badges = await prisma.userBadge.findMany({ where: { userId } });

  return {
    user,
    totalPagesRead,
    totalBooksCompleted: completedBooks.length,
    currentStreak,
    totalPoints,
    monthlyPages,
    monthlyGoal,
    monthName,
    badgeCount: badges.length,
    currentlyReadingBooks,
  };
}

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const stats = await getStats(user.id);
  if (!stats) redirect('/login');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/log"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          Log Reading
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{stats.monthName}</h2>
        <ProgressBar
          current={stats.monthlyPages}
          total={stats.monthlyGoal}
          label={`${stats.monthlyGoal} pages this month (${stats.user.readingGoal}/day)`}
          color="bg-green-500"
          size="lg"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pages"
          value={stats.totalPagesRead.toLocaleString()}
          subtitle="all time"
        />
        <StatsCard
          title="Completed"
          value={stats.totalBooksCompleted}
          subtitle="books"
        />
        <StatsCard
          title="Streak"
          value={stats.currentStreak}
          subtitle={`day${stats.currentStreak !== 1 ? 's' : ''}`}
        />
        <StatsCard
          title="Points"
          value={stats.totalPoints.toLocaleString()}
          subtitle={`${stats.badgeCount} badge${stats.badgeCount !== 1 ? 's' : ''}`}
        />
      </div>

      {stats.currentlyReadingBooks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Currently Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.currentlyReadingBooks.map((book) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/books/new"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
            Add a Book
          </h3>
          <p className="text-gray-500 mt-1">Start tracking a new book</p>
        </Link>
        <Link
          href="/badges"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow group"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
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
