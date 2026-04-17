import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import BookDetailClient from './BookDetailClient';

async function getBook(id: string, userId: string) {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      sessions: {
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!book || book.userId !== userId) {
    return null;
  }

  return book;
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const book = await getBook(id, user.id);

  if (!book) {
    notFound();
  }

  return <BookDetailClient book={JSON.parse(JSON.stringify(book))} />;
}
