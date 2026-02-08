import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const books = await prisma.book.findMany({
    where: {
      userId: user.id,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(books);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, author, genre, totalPages, isbn, coverImage } = body;

    if (!title || !author || !genre || !totalPages) {
      return NextResponse.json(
        { error: 'Missing required fields: title, author, genre, totalPages' },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        userId: user.id,
        title,
        author,
        genre,
        totalPages: parseInt(totalPages, 10),
        isbn: isbn || null,
        coverImage: coverImage || null,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}
