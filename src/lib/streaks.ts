export function calculateStreak(sessionDates: Date[]): number {
  if (sessionDates.length === 0) return 0;

  const uniqueDays = new Set<string>();
  for (const date of sessionDates) {
    const dayKey = date.toISOString().split('T')[0];
    uniqueDays.add(dayKey);
  }

  const sortedDays = Array.from(uniqueDays).sort().reverse();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return sessions
    .filter((session) => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    })
    .reduce((sum, session) => sum + session.pagesRead, 0);
}
