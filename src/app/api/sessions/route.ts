import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { calculateSessionPoints } from '@/lib/points';
import { checkNewBadges, getBadgeById } from '@/lib/badges';
import { calculateStreak } from '@/lib/streaks';
import { FICTION_GENRES, NON_FICTION_GENRES, OTHER_GENRES, Genre, UserStats } from '@/types';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookId, endPage } = body;

    if (!bookId || endPage === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: bookId, endPage' },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (book.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const endPageNum = parseInt(endPage, 10);
    if (endPageNum <= book.currentPage) {
      return NextResponse.json(
        { error: 'End page must be greater than current page' },
        { status: 400 }
      );
    }

    if (endPageNum > book.totalPages) {
      return NextResponse.json(
        { error: 'End page cannot exceed total pages' },
        { status: 400 }
      );
    }

    const pagesRead = endPageNum - book.currentPage;
    const bookCompleted = endPageNum >= book.totalPages;
    const pointsEarned = calculateSessionPoints(pagesRead, bookCompleted);

    const session = await prisma.readingSession.create({
      data: {
        userId: user.id,
        bookId,
        startPage: book.currentPage,
        endPage: endPageNum,
        pagesRead,
        pointsEarned,
      },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        currentPage: endPageNum,
        ...(bookCompleted
          ? { status: 'COMPLETED', completedAt: new Date() }
          : {}),
      },
    });

    const allSessions = await prisma.readingSession.findMany({
      where: { userId: user.id },
    });

    const allBooks = await prisma.book.findMany({
      where: { userId: user.id },
    });

    const completedBooks = allBooks.filter((b) => b.status === 'COMPLETED');
    const totalPagesRead = allSessions.reduce((sum, s) => sum + s.pagesRead, 0);
    const sessionDates = allSessions.map((s) => s.date);
    const currentStreak = calculateStreak(sessionDates);
    const uniqueGenres = new Set(completedBooks.map((b) => b.genre)).size;

    const stats: UserStats = {
      totalPagesRead,
      totalBooksCompleted: completedBooks.length,
      currentStreak,
      totalPoints: allSessions.reduce((sum, s) => sum + s.pointsEarned, 0),
      todayPages: 0,
      uniqueGenres,
      fictionBooksCompleted: completedBooks.filter((b) =>
        FICTION_GENRES.includes(b.genre as Genre)
      ).length,
      nonfictionBooksCompleted: completedBooks.filter((b) =>
        NON_FICTION_GENRES.includes(b.genre as Genre)
      ).length,
      otherBooksCompleted: completedBooks.filter((b) =>
        OTHER_GENRES.includes(b.genre as Genre)
      ).length,
    };

    const existingBadges = await prisma.userBadge.findMany({
      where: { userId: user.id },
    });
    const earnedBadgeIds = existingBadges.map((b) => b.badgeId);

    const newBadges = checkNewBadges(stats, earnedBadgeIds);

    if (newBadges.length > 0) {
      await prisma.userBadge.createMany({
        data: newBadges.map((badge) => ({
          userId: user.id,
          badgeId: badge.id,
        })),
      });
    }

    return NextResponse.json({
      session,
      pagesRead,
      pointsEarned,
      bookCompleted,
      newBadges: newBadges.map((b) => getBadgeById(b.id)),
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to log reading session' }, { status: 500 });
  }
}
