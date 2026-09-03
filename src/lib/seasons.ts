export type SeasonName = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonInfo {
  year: number;
  name: SeasonName;
  startDate: Date;
  endDate: Date;
  label: string;
}

/** Stable identifier for a season, e.g. "2026-spring". */
export function seasonKey(info: { year: number; name: SeasonName }): string {
  return `${info.year}-${info.name}`;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function makeSeason(
  name: SeasonName,
  year: number,
  startMonth: number,
  startDay: number,
  endYear: number,
  endMonth: number,
  endDay: number,
): SeasonInfo {
  const seasonYear = name === 'winter' ? year : year;
  return {
    year: seasonYear,
    name,
    startDate: new Date(Date.UTC(year, startMonth - 1, startDay)),
    endDate: new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999)),
    label: `${name.charAt(0).toUpperCase() + name.slice(1)} ${seasonYear}`,
  };
}

export function getSeasonForDate(date: Date): SeasonInfo {
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  if (month >= 3 && month <= 5) {
    return makeSeason('spring', year, 3, 1, year, 5, 31);
  } else if (month >= 6 && month <= 8) {
    return makeSeason('summer', year, 6, 1, year, 8, 31);
  } else if (month >= 9 && month <= 11) {
    return makeSeason('autumn', year, 9, 1, year, 11, 30);
  } else {
    const winterYear = month === 12 ? year : year - 1;
    const febDays = isLeapYear(winterYear + 1) ? 29 : 28;
    return makeSeason('winter', winterYear, 12, 1, winterYear + 1, 2, febDays);
  }
}

export function getCurrentSeason(): SeasonInfo {
  return getSeasonForDate(new Date());
}
