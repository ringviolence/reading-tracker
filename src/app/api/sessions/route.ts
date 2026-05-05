import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getSeasonForDate } from '@/lib/seasons';
import { refreshSeasonProgress } from '@/lib/badges';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { bookId, endPage, date } = body;

    if (!bookId || endPage === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: bookId, endPage' },
        { status: 400 },
      );
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    if (book.userId !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    const endPageNum = parseInt(endPage, 10);
    if (endPageNum <= book.currentPage) {
      return NextResponse.json(
        { error: 'End page must be greater than current page' },
        { status: 400 },
      );
    }
    if (endPageNum > book.totalPages) {
      return NextResponse.json(
        { error: 'End page cannot exceed total pages' },
        { status: 400 },
      );
    }

    const pagesRead = endPageNum - book.currentPage;
    const bookCompleted = endPageNum >= book.totalPages;

    const dateStr = date || new Date().toISOString().split('T')[0];
    const sessionDate = new Date(`${dateStr}T00:00:00.000Z`);

    const session = await prisma.readingSession.create({
      data: {
        userId: user.id,
        bookId,
        date: sessionDate,
        startPage: book.currentPage,
        endPage: endPageNum,
        pagesRead,
      },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        currentPage: endPageNum,
        ...(bookCompleted ? { status: 'COMPLETED', completedAt: sessionDate } : {}),
      },
    });

    const seasonInfo = getSeasonForDate(sessionDate);
    let season = await prisma.season.findUnique({
      where: { year_name: { year: seasonInfo.year, name: seasonInfo.name } },
    });
    if (!season) {
      season = await prisma.season.create({
        data: {
          year: seasonInfo.year,
          name: seasonInfo.name,
          startDate: seasonInfo.startDate,
          endDate: seasonInfo.endDate,
        },
      });
    }

    const { newBadges, xp, level } = await refreshSeasonProgress(user.id, season);

    return NextResponse.json({
      session,
      pagesRead,
      bookCompleted,
      newBadges,
      seasonProgress: { xp, level },
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to log reading session' }, { status: 500 });
  }
}
