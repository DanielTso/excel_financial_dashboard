import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(
  value: number,
  decimals: number = 0,
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a percentage value
 */
export function formatPercentage(
  value: number,
  decimals: number = 1,
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = "MMM d, yyyy"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(dateObj)) {
    return "Invalid date";
  }

  return format(dateObj, formatStr);
}

/**
 * Format a date to ISO format (YYYY-MM-DD)
 */
export function formatDateISO(date: Date | string | number): string {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(dateObj)) {
    return "";
  }

  return format(dateObj, "yyyy-MM-dd");
}

/**
 * Format a date relative to now (e.g., "2 days ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  suffix: boolean = true
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(dateObj)) {
    return "Invalid date";
  }

  return formatDistanceToNow(dateObj, { addSuffix: suffix });
}

/**
 * Format account type for display
 */
export function formatAccountType(type: string): string {
  const typeMap: Record<string, string> = {
    CHECKING: "Checking",
    SAVINGS: "Savings",
    CREDIT_CARD: "Credit Card",
    LOAN: "Loan",
    INVESTMENT: "Investment",
    ASSET: "Asset",
  };

  return typeMap[type] ?? type;
}

/**
 * Format transaction type for display
 */
export function formatTransactionType(type: string): string {
  const typeMap: Record<string, string> = {
    INCOME: "Income",
    EXPENSE: "Expense",
    TRANSFER: "Transfer",
  };

  return typeMap[type] ?? type;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
