export function calculateStreak(sessionDates: Date[]): number {
  if (sessionDates.length === 0) return 0;

  const uniqueDays = new Set<string>();
  for (const date of sessionDates) {
    const dayKey = date.toISOString().split('T')[0];
    uniqueDays.add(dayKey);
  }

  const sortedDays = Array.from(uniqueDays).sort().reverse();

  const todayKey = new Date().toISOString().split('T')[0];
  const [ty, tm, td] = todayKey.split('-').map(Number);
  const yesterdayKey = new Date(Date.UTC(ty, tm - 1, td - 1)).toISOString().split('T')[0];

  if (sortedDays[0] !== todayKey && sortedDays[0] !== yesterdayKey) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(sortedDays[0]);

  for (let i = 1; i < sortedDays.length; i++) {
    const expectedPrevious = new Date(currentDate);
    expectedPrevious.setDate(expectedPrevious.getDate() - 1);
    const expectedKey = expectedPrevious.toISOString().split('T')[0];

    if (sortedDays[i] === expectedKey) {
      streak++;
      currentDate = expectedPrevious;
    } else {
      break;
    }
  }

  return streak;
}

export function getTodayPages(sessions: { date: Date; pagesRead: number }[]): number {
  const todayKey = new Date().toISOString().split('T')[0];
  return sessions
    .filter((session) => new Date(session.date).toISOString().split('T')[0] === todayKey)
    .reduce((sum, session) => sum + session.pagesRead, 0);
}
