'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ALL_GENRES, GENRE_LABELS, Genre } from '@/types';

export default function NewBookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
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
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add book');
      }

      router.push('/books');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Book</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter book title"
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
            Subtitle (optional)
          </label>
          <input
            type="text"
            id="subtitle"
            name="subtitle"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter subtitle"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter author name"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a genre</option>
            <optgroup label="Fiction">
              {ALL_GENRES.slice(0, 8).map((genre) => (
                <option key={genre} value={genre}>
                  {GENRE_LABELS[genre as Genre]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Non-Fiction">
              {ALL_GENRES.slice(8, 19).map((genre) => (
                <option key={genre} value={genre}>
                  {GENRE_LABELS[genre as Genre]}
                </option>
              ))}
            </optgroup>
            <optgroup label="Other">
              {ALL_GENRES.slice(19).map((genre) => (
                <option key={genre} value={genre}>
                  {GENRE_LABELS[genre as Genre]}
                </option>
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
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter total pages"
          />
        </div>

        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
            ISBN (optional)
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter ISBN"
          />
        </div>

        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image URL (optional)
          </label>
          <input
            type="url"
            id="coverImage"
            name="coverImage"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter cover image URL"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Book'}
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
    </div>
  );
}
