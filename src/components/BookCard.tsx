'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProgressBar from './ProgressBar';
import { GENRE_LABELS, Genre } from '@/types';

interface BookCardProps {
  id: string;
  title: string;
  subtitle?: string | null;
  author: string;
  genre: string;
  currentPage: number;
  totalPages: number;
  status: string;
  coverImage?: string | null;
  isbn?: string | null;
}

export default function BookCard({
  id,
  title,
  subtitle,
  author,
  genre,
  currentPage,
  totalPages,
  status,
  coverImage,
  isbn,
}: BookCardProps) {
  const [imgError, setImgError] = useState(false);
  const isCompleted = status === 'COMPLETED';
  const genreLabel = GENRE_LABELS[genre as Genre] || genre;
  const coverSrc = coverImage || (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false` : null);

  return (
    <Link href={`/books/${id}`} className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {coverSrc && !imgError ? (
          <img
            src={coverSrc}
            alt={title}
            className="w-16 h-24 object-cover rounded"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-16 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{title[0]}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 truncate">{subtitle}</p>}
          <p className="text-sm text-gray-600 truncate">{author}</p>
          <p className="text-xs text-gray-400 mt-1">{genreLabel}</p>
          {isCompleted ? (
            <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
              Completed
            </span>
          ) : (
            <div className="mt-2">
              <ProgressBar
                current={currentPage}
                total={totalPages}
                size="sm"
                color="bg-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
