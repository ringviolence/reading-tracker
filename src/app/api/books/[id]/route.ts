import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      sessions: {
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  if (book.userId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  return NextResponse.json(book);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  if (book.userId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, subtitle, author, genre, totalPages, isbn, coverImage } = body;

    if (!title || !author || !genre || !totalPages) {
      return NextResponse.json(
        { error: 'Missing required fields: title, author, genre, totalPages' },
        { status: 400 }
      );
    }

    const totalPagesNum = parseInt(totalPages, 10);
    if (totalPagesNum < book.currentPage) {
      return NextResponse.json(
        { error: 'Total pages cannot be less than current reading progress' },
        { status: 400 }
      );
    }

    const updated = await prisma.book.update({
      where: { id },
      data: {
        title,
        subtitle: subtitle || null,
        author,
        genre,
        totalPages: totalPagesNum,
        isbn: isbn || null,
        coverImage: coverImage || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
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

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  if (book.userId !== user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await prisma.book.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
