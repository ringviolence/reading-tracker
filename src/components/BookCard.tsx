'use client';

import ProgressBar from './ProgressBar';
import { GENRE_LABELS, Genre } from '@/types';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  currentPage: number;
  totalPages: number;
  status: string;
  coverImage?: string | null;
}

export default function BookCard({
  title,
  author,
  genre,
  currentPage,
  totalPages,
  status,
  coverImage,
}: BookCardProps) {
  const isCompleted = status === 'COMPLETED';
  const genreLabel = GENRE_LABELS[genre as Genre] || genre;

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-16 h-24 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{title[0]}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
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
    </div>
  );
}
