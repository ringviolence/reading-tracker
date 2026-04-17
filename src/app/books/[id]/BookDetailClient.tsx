'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProgressBar from '@/components/ProgressBar';
import { ALL_GENRES, GENRE_LABELS, Genre } from '@/types';

interface ReadingSession {
  id: string;
  date: string;
  startPage: number;
  endPage: number;
  pagesRead: number;
  pointsEarned: number;
}

interface Book {
  id: string;
  title: string;
  subtitle?: string | null;
  author: string;
  genre: string;
  totalPages: number;
  currentPage: number;
  status: string;
  coverImage?: string | null;
  isbn?: string | null;
  createdAt: string;
  completedAt?: string | null;
  sessions: ReadingSession[];
}

export default function BookDetailClient({ book: initialBook }: { book: Book }) {
  const router = useRouter();
  const [book, setBook] = useState(initialBook);
  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState('');
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const genreLabel = GENRE_LABELS[book.genre as Genre] || book.genre;

  async function handleEditBook(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      subtitle: (formData.get('subtitle') as string) || undefined,
      author: formData.get('author') as string,
      genre: formData.get('genre') as string,
      totalPages: parseInt(formData.get('totalPages') as string, 10),
      isbn: (formData.get('isbn') as string) || undefined,
      coverImage: (formData.get('coverImage') as string) || undefined,
    };

    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update book');
      }

      const updated = await response.json();
      setBook({ ...book, ...updated });
      setImgError(false);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteBook() {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete book');
      }

      router.push('/books');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsDeleting(false);
    }
  }

  async function handleEditSessionDate(sessionId: string) {
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: editingDate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update session');
      }

      const updated = await response.json();
      setBook({
        ...book,
        sessions: book.sessions.map((s) =>
          s.id === sessionId ? { ...s, date: updated.date } : s
        ),
      });
      setEditingSessionId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  async function handleDeleteSession(sessionId: string) {
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete session');
      }

      const deletedSession = book.sessions.find((s) => s.id === sessionId);
      const remainingSessions = book.sessions.filter((s) => s.id !== sessionId);

      // Check if deleted session was the latest (highest endPage)
      const wasLatest =
        deletedSession &&
        !book.sessions.some(
          (s) => s.id !== sessionId && s.endPage > deletedSession.endPage
        );

      let newCurrentPage = book.currentPage;
      let newStatus = book.status;

      if (wasLatest) {
        const previousSession = remainingSessions.length > 0
          ? remainingSessions.reduce((prev, curr) =>
              curr.endPage > prev.endPage ? curr : prev
            )
          : null;
        newCurrentPage = previousSession ? previousSession.endPage : 0;
        if (book.status === 'COMPLETED') {
          newStatus = 'READING';
        }
      }

      setBook({
        ...book,
        sessions: remainingSessions,
        currentPage: newCurrentPage,
        status: newStatus,
        ...(newStatus === 'READING' ? { completedAt: null } : {}),
      });
      setDeletingSessionId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function toInputDate(dateStr: string) {
    return new Date(dateStr).toISOString().split('T')[0];
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/books"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Back to Books
      </Link>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Book Info Section */}
      <div className="bg-white rounded-lg shadow p-6">
        {isEditing ? (
          <form onSubmit={handleEditBook} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Book</h2>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={book.title}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                defaultValue={book.subtitle || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                required
                defaultValue={book.author}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                required
                defaultValue={book.genre}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <optgroup label="Fiction">
                  {ALL_GENRES.slice(0, 8).map((g) => (
                    <option key={g} value={g}>{GENRE_LABELS[g]}</option>
                  ))}
                </optgroup>
                <optgroup label="Non-Fiction">
                  {ALL_GENRES.slice(8, 19).map((g) => (
                    <option key={g} value={g}>{GENRE_LABELS[g]}</option>
                  ))}
                </optgroup>
                <optgroup label="Other">
                  {ALL_GENRES.slice(19).map((g) => (
                    <option key={g} value={g}>{GENRE_LABELS[g]}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label htmlFor="totalPages" className="block text-sm font-medium text-gray-700 mb-1">
                Total Pages *
              </label>
              <input
                type="number"
                id="totalPages"
                name="totalPages"
                required
                min={book.currentPage || 1}
                defaultValue={book.totalPages}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                defaultValue={book.isbn || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL (optional, overrides ISBN lookup)
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                defaultValue={book.coverImage || ''}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setError(null); }}
                className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                {(() => {
                  const coverSrc = book.coverImage || (book.isbn ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false` : null);
                  return coverSrc && !imgError ? (
                    <img
                      src={coverSrc}
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-20 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">{book.title[0]}</span>
                    </div>
                  );
                })()}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
                  {book.subtitle && (
                    <p className="text-gray-500">{book.subtitle}</p>
                  )}
                  <p className="text-gray-600 mt-1">by {book.author}</p>
                  <p className="text-sm text-gray-400 mt-1">{genreLabel}</p>
                  {book.isbn && (
                    <p className="text-xs text-gray-400 mt-1">ISBN: {book.isbn}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
            </div>
            <div className="mt-4">
              {book.status === 'COMPLETED' ? (
                <div className="flex items-center gap-3">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                    Completed
                  </span>
                  {book.completedAt && (
                    <span className="text-sm text-gray-400">
                      on {formatDate(book.completedAt)}
                    </span>
                  )}
                </div>
              ) : (
                <ProgressBar
                  current={book.currentPage}
                  total={book.totalPages}
                  label="Reading Progress"
                  color="bg-blue-500"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reading Sessions Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Reading Sessions ({book.sessions.length})
        </h2>
        {book.sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reading sessions logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-2 pr-4 font-medium text-gray-500">Pages</th>
                  <th className="text-right py-2 pr-4 font-medium text-gray-500">Read</th>
                  <th className="text-right py-2 pr-4 font-medium text-gray-500">Points</th>
                  <th className="text-right py-2 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {book.sessions.map((session) => (
                  <tr key={session.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      {editingSessionId === session.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={editingDate}
                            onChange={(e) => setEditingDate(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={() => handleEditSessionDate(session.id)}
                            className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingSessionId(null)}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingSessionId(session.id);
                            setEditingDate(toInputDate(session.date));
                          }}
                          className="text-gray-900 hover:text-blue-500 transition-colors"
                          title="Click to edit date"
                        >
                          {formatDate(session.date)}
                        </button>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {session.startPage} &rarr; {session.endPage}
                    </td>
                    <td className="py-3 pr-4 text-right text-gray-900">
                      {session.pagesRead}
                    </td>
                    <td className="py-3 pr-4 text-right text-gray-900">
                      {session.pointsEarned}
                    </td>
                    <td className="py-3 text-right">
                      {deletingSessionId === session.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-500">Delete?</span>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeletingSessionId(null)}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingSessionId(session.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete session"
                        >
                          &times;
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow p-6 border border-red-200">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Deleting this book will also remove all its reading sessions. This cannot be undone.
        </p>
        {showDeleteConfirm ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Are you sure?</span>
            <button
              onClick={handleDeleteBook}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete Book'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors"
          >
            Delete This Book
          </button>
        )}
      </div>
    </div>
  );
}
