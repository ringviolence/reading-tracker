'use client';

import { useState } from 'react';

type Tier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface SeasonCard {
  key: string;
  name: 'spring' | 'summer' | 'autumn' | 'winter';
  label: string;
  xp: number;
  level: number;
  pagesRead: number;
  bestDay: number;
  badges: { id: string; name: string; icon: string; tier: Tier; hint: string }[];
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

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</p>
      <div className="mt-1 text-ink">{children}</div>
    </div>
  );
}

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
  return (
    <section
      data-season={season.name}
      className="rounded-xl border-2 border-forest bg-sage p-6 shadow-sm"
    >
      {/* Stat grid: 4-across, 2x2 on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Stat label="Season">
          <span className="text-lg font-bold capitalize">{season.label}</span>
        </Stat>
        <Stat label="Level">
          <span className="text-lg font-bold">Level {season.level}</span>
          <span className="text-ink/60 text-sm"> ({season.xp.toLocaleString()} XP)</span>
        </Stat>
        <Stat label="Pages read">
          <span className="text-lg font-bold">{season.pagesRead.toLocaleString()}</span>
        </Stat>
        <Stat label="Best single day">
          <span className="text-lg font-bold">{season.bestDay.toLocaleString()}</span>
          <span className="text-ink/60 text-sm"> pages</span>
        </Stat>
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
                {b.name} <span className="opacity-70">({b.hint})</span>
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
