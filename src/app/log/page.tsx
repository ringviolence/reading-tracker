'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BadgeCelebration from '@/components/BadgeCelebration';
import { BadgeDefinition } from '@/types';

interface Book {
  id: string;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
}

export default function LogReadingPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [currentPage, setCurrentPage] = useState<number | ''>('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBadges, setNewBadges] = useState<BadgeDefinition[]>([]);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  useEffect(() => {
    async function fetchBooks() {
      const response = await fetch('/api/books?status=READING');
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else if (response.status === 401) {
        router.push('/login');
      }
      setIsLoading(false);
    }
    fetchBooks();
  }, [router]);

  const selectedBook = books.find((b) => b.id === selectedBookId);
  const pagesRead =
    selectedBook && currentPage !== '' ? Math.max(0, currentPage - selectedBook.currentPage) : 0;
  const willComplete = selectedBook && currentPage !== '' && currentPage >= selectedBook.totalPages;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBookId || currentPage === '') return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: selectedBookId,
          endPage: currentPage,
          date: date !== new Date().toISOString().split('T')[0] ? date : undefined,
        }),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to log reading');
      }

      const data = await response.json();

      if (data.newBadges && data.newBadges.length > 0) {
        setNewBadges(data.newBadges);
        setCurrentBadgeIndex(0);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBadgeClose() {
    if (currentBadgeIndex < newBadges.length - 1) {
      setCurrentBadgeIndex(currentBadgeIndex + 1);
    } else {
      setNewBadges([]);
      router.push('/');
      router.refresh();
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Log Reading Session</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Log Reading Session</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {books.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No books currently in progress.</p>
          <a href="/books/new" className="text-blue-500 hover:underline">
            Add a book to start tracking
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="book" className="block text-sm font-medium text-gray-700 mb-1">
              Select Book
            </label>
            <select
              id="book"
              value={selectedBookId}
              onChange={(e) => {
                setSelectedBookId(e.target.value);
                setCurrentPage('');
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a book...</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author} (page {book.currentPage}/{book.totalPages})
                </option>
              ))}
            </select>
          </div>

          {selectedBook && (
            <>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Current progress:{' '}
                  <span className="font-medium">
                    {selectedBook.currentPage} / {selectedBook.totalPages} pages
                  </span>
                </p>
              </div>

              <div>
                <label htmlFor="currentPage" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Page (after this session)
                </label>
                <input
                  type="number"
                  id="currentPage"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value ? parseInt(e.target.value, 10) : '')}
                  required
                  min={selectedBook.currentPage + 1}
                  max={selectedBook.totalPages}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter page (${selectedBook.currentPage + 1}-${selectedBook.totalPages})`}
                />
              </div>

              {pagesRead > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-700">
                    Pages read this session: <span className="font-bold">{pagesRead}</span>
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Points earned: {pagesRead}
                    {willComplete && ' + 50 (book completed!)'}
                  </p>
                  {willComplete && (
                    <p className="text-green-600 font-medium mt-2">
                      Congratulations! You will complete this book!
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !selectedBookId || currentPage === '' || pagesRead <= 0}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging...' : 'Log Reading'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {newBadges.length > 0 && currentBadgeIndex < newBadges.length && (
        <BadgeCelebration badge={newBadges[currentBadgeIndex]} onClose={handleBadgeClose} />
      )}
    </div>
  );
}
