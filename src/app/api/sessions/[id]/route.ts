import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const session = await prisma.readingSession.findUnique({ where: { id } });
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (session.userId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const updated = await prisma.readingSession.update({
      where: { id },
      data: { date: new Date(date) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const session = await prisma.readingSession.findUnique({ where: { id } });
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (session.userId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Check if this is the most recent session for the book
  const latestSession = await prisma.readingSession.findFirst({
    where: { bookId: session.bookId },
    orderBy: { endPage: 'desc' },
  });

  const isLatest = latestSession?.id === session.id;

  await prisma.readingSession.delete({ where: { id } });

  if (isLatest) {
    // Find the new latest session for this book
    const previousSession = await prisma.readingSession.findFirst({
      where: { bookId: session.bookId },
      orderBy: { endPage: 'desc' },
    });

    const newCurrentPage = previousSession ? previousSession.endPage : 0;

    const book = await prisma.book.findUnique({ where: { id: session.bookId } });

    await prisma.book.update({
      where: { id: session.bookId },
      data: {
        currentPage: newCurrentPage,
        // If the book was completed and we're rewinding, set back to READING
        ...(book?.status === 'COMPLETED'
          ? { status: 'READING', completedAt: null }
          : {}),
      },
    });
  }

  return NextResponse.json({ success: true });
}
