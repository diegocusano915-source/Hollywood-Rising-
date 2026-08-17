/**
 * HOLLYWOOD RISING - Calendar Helper Utility
 * Real 12-Month Calendar Engine (52 Weeks / 364 Days per Year)
 * Infinite Year Progression: 2026 -> 2027 -> 2028 -> 2031 -> 2032 -> ...
 */

export interface CalendarDateRange {
  week: number;
  year: number;
  weekText: string;
  dateRangeText: string;
  fullDateText: string;
}

const MONTHS = [
  { name: 'January', days: 31 },
  { name: 'February', days: 28 },
  { name: 'March', days: 31 },
  { name: 'April', days: 30 },
  { name: 'May', days: 31 },
  { name: 'June', days: 30 },
  { name: 'July', days: 31 },
  { name: 'August', days: 31 },
  { name: 'September', days: 30 },
  { name: 'October', days: 31 },
  { name: 'November', days: 30 },
  { name: 'December', days: 31 },
];

function getDayAndMonth(dayOfYear: number): { day: number; month: string } {
  let remaining = Math.max(1, Math.min(364, dayOfYear));
  for (let i = 0; i < MONTHS.length; i++) {
    if (remaining <= MONTHS[i].days) {
      return { day: remaining, month: MONTHS[i].name };
    }
    remaining -= MONTHS[i].days;
  }
  return { day: 31, month: 'December' };
}

export function formatCalendarDate(week: number, year: number): CalendarDateRange {
  // Normalize week (1..52)
  const normalizedWeek = ((week - 1) % 52) + 1;
  const yearOffset = Math.floor((week - 1) / 52);
  const actualYear = year + yearOffset;

  const startDayOfYear = (normalizedWeek - 1) * 7 + 1;
  const endDayOfYear = (normalizedWeek - 1) * 7 + 7;

  const start = getDayAndMonth(startDayOfYear);
  const end = getDayAndMonth(endDayOfYear);

  let dateRangeText = '';
  if (start.month === end.month) {
    dateRangeText = `${start.day}–${end.day} ${start.month} ${actualYear}`;
  } else {
    dateRangeText = `${start.day} ${start.month} – ${end.day} ${end.month} ${actualYear}`;
  }

  return {
    week: normalizedWeek,
    year: actualYear,
    weekText: `Week ${normalizedWeek}`,
    dateRangeText,
    fullDateText: `Week ${normalizedWeek} • ${dateRangeText}`,
  };
}
