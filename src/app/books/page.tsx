import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import BookCard from '@/components/BookCard';

async function getBooks(userId: string) {
  const books = await prisma.book.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return books;
}

export default async function BooksPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const books = await getBooks(user.id);
  const currentlyReading = books.filter((b) => b.status === 'READING');
  const completed = books.filter((b) => b.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
        <Link
          href="/books/new"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Add Book
        </Link>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Currently Reading ({currentlyReading.length})
        </h2>
        {currentlyReading.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p>No books in progress.</p>
            <Link href="/books/new" className="text-blue-500 hover:underline">
              Add your first book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentlyReading.map((book) => (
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
              />
            ))}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Completed ({completed.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((book) => (
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
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
