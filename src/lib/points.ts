export function calculateSessionPoints(pagesRead: number, bookCompleted: boolean): number {
  let points = pagesRead;
  if (bookCompleted) {
    points += 50;
  }
  return points;
}

export function calculateTotalPoints(sessions: { pointsEarned: number }[]): number {
  return sessions.reduce((sum, session) => sum + session.pointsEarned, 0);
}
