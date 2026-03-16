import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatDateISO,
  formatRelativeTime,
  formatAccountType,
  formatTransactionType,
  truncateText,
} from "./formatters";

describe("formatCurrency", () => {
  it("should format positive amounts", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("should format negative amounts", () => {
    expect(formatCurrency(-1234.56)).toBe("-$1,234.56");
  });

  it("should format zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("should handle different currencies", () => {
    expect(formatCurrency(100, "EUR")).toContain("100");
    expect(formatCurrency(100, "GBP")).toContain("100");
  });
});

describe("formatNumber", () => {
  it("should format with thousand separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("should format with decimals", () => {
    expect(formatNumber(1234.567, 2)).toBe("1,234.57");
  });

  it("should format zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});

describe("formatPercentage", () => {
  it("should format percentage", () => {
    expect(formatPercentage(25)).toBe("25.0%");
  });

  it("should format with custom decimals", () => {
    expect(formatPercentage(33.333, 2)).toBe("33.33%");
  });

  it("should format zero", () => {
    expect(formatPercentage(0)).toBe("0.0%");
  });
});

describe("formatDate", () => {
  it("should format Date object", () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024
    expect(formatDate(date)).toContain("Jan");
    expect(formatDate(date)).toContain("15");
    expect(formatDate(date)).toContain("2024");
  });

  it("should format ISO string", () => {
    expect(formatDate("2024-01-15T00:00:00.000Z")).toContain("Jan");
  });

  it("should format with custom format", () => {
    const date = new Date(2024, 0, 15);
    expect(formatDate(date, "yyyy-MM-dd")).toBe("2024-01-15");
  });

  it("should handle invalid date", () => {
    expect(formatDate("invalid")).toBe("Invalid date");
  });
});

describe("formatDateISO", () => {
  it("should format to ISO date", () => {
    const date = new Date(2024, 0, 15);
    expect(formatDateISO(date)).toBe("2024-01-15");
  });

  it("should handle invalid date", () => {
    expect(formatDateISO("invalid")).toBe("");
  });
});

describe("formatRelativeTime", () => {
  it("should format relative to now", () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(yesterday);
    expect(result).toContain("ago");
  });

  it("should handle invalid date", () => {
    expect(formatRelativeTime("invalid")).toBe("Invalid date");
  });
});

describe("formatAccountType", () => {
  it("should format known types", () => {
    expect(formatAccountType("CHECKING")).toBe("Checking");
    expect(formatAccountType("SAVINGS")).toBe("Savings");
    expect(formatAccountType("CREDIT_CARD")).toBe("Credit Card");
    expect(formatAccountType("INVESTMENT")).toBe("Investment");
  });

  it("should return unknown types as-is", () => {
    expect(formatAccountType("UNKNOWN")).toBe("UNKNOWN");
  });
});

describe("formatTransactionType", () => {
  it("should format known types", () => {
    expect(formatTransactionType("INCOME")).toBe("Income");
    expect(formatTransactionType("EXPENSE")).toBe("Expense");
    expect(formatTransactionType("TRANSFER")).toBe("Transfer");
  });

  it("should return unknown types as-is", () => {
    expect(formatTransactionType("UNKNOWN")).toBe("UNKNOWN");
  });
});

describe("truncateText", () => {
  it("should truncate long text", () => {
    expect(truncateText("Hello World", 8)).toBe("Hello...");
  });

  it("should not truncate short text", () => {
    expect(truncateText("Hi", 10)).toBe("Hi");
  });

  it("should handle exact length", () => {
    expect(truncateText("Hello", 5)).toBe("Hello");
  });
});
