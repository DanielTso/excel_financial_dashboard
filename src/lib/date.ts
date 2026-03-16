/**
 * Date utility functions for consistent date handling
 */

export interface MonthYear {
  month: number; // 1-12
  year: number;
}

/**
 * Get current month and year
 */
export function getCurrentMonthYear(): MonthYear {
  const now = new Date();
  return {
    month: now.getMonth() + 1, // JavaScript months are 0-indexed
    year: now.getFullYear(),
  };
}

/**
 * Get start and end dates for a given month/year
 */
export function getMonthDateRange(
  year: number,
  month: number
): { startDate: Date; endDate: Date } {
  // Month is 1-12, JavaScript Date uses 0-11
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1); // First day of next month

  return { startDate, endDate };
}

/**
 * Get the previous month
 */
export function getPreviousMonth(month: number, year: number): MonthYear {
  if (month === 1) {
    return { month: 12, year: year - 1 };
  }
  return { month: month - 1, year };
}

/**
 * Get the next month
 */
export function getNextMonth(month: number, year: number): MonthYear {
  if (month === 12) {
    return { month: 1, year: year + 1 };
  }
  return { month: month + 1, year };
}

/**
 * Format month/year for display
 */
export function formatMonthYear(
  month: number,
  year: number,
  format: "long" | "short" = "long"
): string {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("en-US", {
    month: format === "long" ? "long" : "short",
    year: "numeric",
  });
}

/**
 * Get year-to-date range
 */
export function getYearToDateRange(year: number): {
  startDate: Date;
  endDate: Date;
} {
  const now = new Date();
  const startDate = new Date(year, 0, 1);
  const endDate =
    year === now.getFullYear() ? now : new Date(year, 11, 31, 23, 59, 59);

  return { startDate, endDate };
}

/**
 * Get last N months
 */
export function getLastNMonths(n: number): MonthYear[] {
  const { month, year } = getCurrentMonthYear();
  const months: MonthYear[] = [];

  for (let i = 0; i < n; i++) {
    months.push({ month, year });
    const prev = getPreviousMonth(month, year);
    months[i] = { month, year };
    months[i] = prev;
  }

  return months.reverse();
}

/**
 * Check if a date is in a given month/year
 */
export function isDateInMonth(
  date: Date,
  month: number,
  year: number
): boolean {
  return (
    date.getMonth() === month - 1 && date.getFullYear() === year
  );
}

/**
 * Get fiscal year range (assuming fiscal year starts in July)
 */
export function getFiscalYearRange(year: number): {
  startDate: Date;
  endDate: Date;
} {
  return {
    startDate: new Date(year, 6, 1), // July 1
    endDate: new Date(year + 1, 5, 30, 23, 59, 59), // June 30
  };
}
