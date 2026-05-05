// cumulative_xp(n) = 4n² + 4n — XP needed to reach level n
// xp_to_advance_from(n) = 8(n+1)

export function cumulativeXpForLevel(n: number): number {
  return 4 * n * n + 4 * n;
}

export function computeLevel(xp: number): number {
  if (xp <= 0) return 0;
  let level = Math.floor((-1 + Math.sqrt(1 + xp)) / 2);
  while (cumulativeXpForLevel(level + 1) <= xp) level++;
  while (level > 0 && cumulativeXpForLevel(level) > xp) level--;
  return level;
}

export interface LevelProgress {
  level: number;
  xpIntoLevel: number;
  xpForThisLevel: number;
  percentage: number;
}

export function getLevelProgress(xp: number): LevelProgress {
  const level = computeLevel(xp);
  const xpAtLevel = cumulativeXpForLevel(level);
  const xpAtNext = cumulativeXpForLevel(level + 1);
  const xpIntoLevel = xp - xpAtLevel;
  const xpForThisLevel = xpAtNext - xpAtLevel;
  return {
    level,
    xpIntoLevel,
    xpForThisLevel,
    percentage: Math.min(100, Math.round((xpIntoLevel / xpForThisLevel) * 100)),
  };
}
