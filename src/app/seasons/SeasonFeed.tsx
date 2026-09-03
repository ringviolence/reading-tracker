'use client';

import { useState } from 'react';
import { getLevelProgress } from '@/lib/levels';

type Tier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface SeasonCard {
  key: string;
  name: 'spring' | 'summer' | 'autumn' | 'winter';
  label: string;
  xp: number;
  level: number;
  badges: { id: string; name: string; icon: string; tier: Tier }[];
  books: {
    id: string;
    title: string;
    author: string;
    genre: string;
    totalPages: number;
    coverImage: string | null;
  }[];
}

const TIER_CHIP: Record<Tier, string> = {
  bronze: 'bg-amber-100 text-amber-700 border-amber-300',
  silver: 'bg-gray-100 text-gray-600 border-gray-300',
  gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  diamond: 'bg-purple-100 text-purple-700 border-purple-300',
};

const PAGE_SIZE = 4;

export default function SeasonFeed({ seasons }: { seasons: SeasonCard[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = seasons.slice(0, visible);

  return (
    <div className="space-y-6">
      {shown.map((season) => (
        <SeasonCardView key={season.key} season={season} />
      ))}

      {visible < seasons.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-6 py-2 bg-forest text-white rounded-lg hover:bg-forest-dark transition-colors text-sm font-medium"
          >
            Load more ({seasons.length - visible} more)
          </button>
        </div>
      )}
    </div>
  );
}

function SeasonCardView({ season }: { season: SeasonCard }) {
  const progress = getLevelProgress(season.xp);

  return (
    <section
      data-season={season.name}
      className="rounded-xl border-2 border-forest bg-sage p-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-ink capitalize">{season.label}</h2>
          <p className="text-sm text-ink/60">Level {season.level}</p>
        </div>
        <span className="text-xl font-bold text-forest whitespace-nowrap">
          {season.xp.toLocaleString()} XP
        </span>
      </div>

      {/* XP bar */}
      <div className="mb-5">
        <div className="w-full bg-white/50 rounded-full h-2">
          <div
            className="bg-forest h-2 rounded-full transition-all"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <p className="text-xs text-ink/50 mt-1">
          {progress.xpIntoLevel} / {progress.xpForThisLevel} XP to level {progress.level + 1}
        </p>
      </div>

      {/* Badges */}
      {season.badges.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">
            Badges earned ({season.badges.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {season.badges.map((b) => (
              <span
                key={b.id}
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${TIER_CHIP[b.tier]}`}
                title={`${b.tier} · ${b.name}`}
              >
                <span>{b.icon}</span>
                {b.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Books */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50 mb-2">
          Books finished ({season.books.length})
        </p>
        {season.books.length === 0 ? (
          <p className="text-sm text-ink/50">No books finished this season.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {season.books.map((book) => (
              <li
                key={book.id}
                className="flex gap-3 items-center bg-white/60 rounded-lg p-2"
              >
                {book.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.coverImage}
                    alt=""
                    className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-14 rounded bg-forest/15 flex items-center justify-center flex-shrink-0 text-lg">
                    📖
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{book.title}</p>
                  <p className="text-xs text-ink/60 truncate">{book.author}</p>
                  <p className="text-xs text-ink/40">
                    {book.genre} · {book.totalPages.toLocaleString()} pages
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
