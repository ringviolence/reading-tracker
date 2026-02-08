'use client';

import { useState } from 'react';
import { BadgeDefinition, BadgeTier } from '@/types';
import { TIER_COLORS } from '@/lib/badges';

interface BadgeCategoryProps {
  name: string;
  description: string;
  badges: BadgeDefinition[];
  earnedBadgeIds: string[];
  currentValue: number;
}

export default function BadgeCategory({
  name,
  description,
  badges,
  earnedBadgeIds,
  currentValue,
}: BadgeCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const earnedCount = badges.filter((b) => earnedBadgeIds.includes(b.id)).length;
  const totalCount = badges.length;
  const progressPercent = (earnedCount / totalCount) * 100;

  const badgesByTier: Record<BadgeTier, BadgeDefinition[]> = {
    bronze: badges.filter((b) => b.tier === 'bronze'),
    silver: badges.filter((b) => b.tier === 'silver'),
    gold: badges.filter((b) => b.tier === 'gold'),
    platinum: badges.filter((b) => b.tier === 'platinum'),
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-t-lg"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <span className="text-sm text-gray-500">
              ({earnedCount}/{totalCount})
            </span>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <span className="text-gray-400 ml-4">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {(['bronze', 'silver', 'gold', 'platinum'] as BadgeTier[]).map((tier) => {
            const tierBadges = badgesByTier[tier];
            if (tierBadges.length === 0) return null;

            return (
              <div key={tier}>
                <h4 className={`text-sm font-medium capitalize mb-2 ${TIER_COLORS[tier].text}`}>
                  {tier}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {tierBadges.map((badge) => {
                    const isEarned = earnedBadgeIds.includes(badge.id);
                    const progress = Math.min((currentValue / badge.threshold) * 100, 100);

                    return (
                      <div
                        key={badge.id}
                        className={`p-3 rounded-lg border-2 ${
                          isEarned
                            ? `${TIER_COLORS[tier].bg} ${TIER_COLORS[tier].border}`
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{isEarned ? '✓' : '○'}</span>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-medium text-sm truncate ${
                                isEarned ? TIER_COLORS[tier].text : 'text-gray-600'
                              }`}
                            >
                              {badge.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{badge.description}</p>
                            {!isEarned && (
                              <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                                <div
                                  className="bg-gray-400 h-1 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
