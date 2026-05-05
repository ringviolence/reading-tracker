import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getCurrentSeason } from '@/lib/seasons';
import { getLevelProgress } from '@/lib/levels';
import {
  BADGE_LINES,
  getBadgesByLine,
  computeSeasonMetrics,
  getMetricValue,
  TIER_COLORS,
} from '@/lib/badges';
import type { BadgeLine } from '@/lib/badges';
import ProgressBar from '@/components/ProgressBar';

async function getBadgeData(userId: string) {
  const seasonInfo = getCurrentSeason();

  const [season, allSessions, books] = await Promise.all([
    prisma.season.findUnique({
      where: { year_name: { year: seasonInfo.year, name: seasonInfo.name } },
    }),
    prisma.readingSession.findMany({ where: { userId } }),
    prisma.book.findMany({ where: { userId } }),
  ]);

  if (!season) {
    return { seasonInfo, seasonProgress: { xp: 0, level: 0 }, earnedBadgeIds: [] as string[], metrics: null };
  }

  const [sp, badgeAwards] = await Promise.all([
    prisma.seasonProgress.findUnique({
      where: { userId_seasonId: { userId, seasonId: season.id } },
    }),
    prisma.badgeAward.findMany({ where: { userId, seasonId: season.id } }),
  ]);

  const completedBooks = books.filter((b) => b.status === 'COMPLETED');
  const seasonSessions = allSessions.filter(
    (s) => s.date >= season.startDate && s.date <= season.endDate,
  );
  const seasonCompletedBooks = completedBooks.filter(
    (b) => b.completedAt && b.completedAt >= season.startDate && b.completedAt <= season.endDate,
  );

  return {
    seasonInfo,
    seasonProgress: sp ? { xp: sp.xp, level: sp.level } : { xp: 0, level: 0 },
    earnedBadgeIds: badgeAwards.map((a) => a.badgeId),
    metrics: computeSeasonMetrics(seasonSessions, seasonCompletedBooks),
  };
}

export default async function BadgesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const { seasonInfo, seasonProgress, earnedBadgeIds, metrics } = await getBadgeData(user.id);
  const levelProgress = getLevelProgress(seasonProgress.xp);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Badges</h1>
        <p className="text-gray-500 mt-1">{seasonInfo.label} — Level {levelProgress.level}</p>
      </div>

      {/* Season XP bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Level {levelProgress.level} → {levelProgress.level + 1}
          </span>
          <span className="text-sm text-gray-500">
            {levelProgress.xpIntoLevel} / {levelProgress.xpForThisLevel} XP
          </span>
        </div>
        <ProgressBar
          current={levelProgress.xpIntoLevel}
          total={levelProgress.xpForThisLevel}
          color="bg-forest"
        />
      </div>

      {/* Badge lines */}
      <div className="space-y-4">
        {BADGE_LINES.map((line) => {
          const badges = getBadgesByLine(line.id as BadgeLine);
          const currentValue = metrics ? getMetricValue(line.id as BadgeLine, metrics) : 0;
          const highestEarned = badges.filter((b) => earnedBadgeIds.includes(b.id)).pop();

          return (
            <div key={line.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{line.icon}</span>
                <h3 className="font-semibold text-ink">{line.name}</h3>
                {highestEarned && (
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${TIER_COLORS[highestEarned.tier].bg} ${TIER_COLORS[highestEarned.tier].text}`}>
                    {highestEarned.tier}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">{line.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {badges.map((badge) => {
                  const earned = earnedBadgeIds.includes(badge.id);
                  const progress = Math.min(1, currentValue / badge.threshold);
                  const colors = TIER_COLORS[badge.tier];

                  return (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-lg border-2 ${earned ? `${colors.bg} ${colors.border}` : 'bg-gray-50 border-gray-200'}`}
                    >
                      <p className={`text-xs font-semibold capitalize mb-1 ${earned ? colors.text : 'text-gray-400'}`}>
                        {badge.tier}
                      </p>
                      <p className={`text-sm font-medium ${earned ? colors.text : 'text-gray-500'}`}>
                        {badge.threshold.toLocaleString()}
                      </p>
                      {earned ? (
                        <p className={`text-xs mt-1 ${colors.text}`}>✓ Earned</p>
                      ) : (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-gray-400 h-1 rounded-full"
                              style={{ width: `${progress * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {currentValue.toLocaleString()} / {badge.threshold.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
