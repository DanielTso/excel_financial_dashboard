import { cache } from "react";
import prisma from "./db";

/**
 * React cache() wrappers for common database queries
 * These caches are request-scoped and deduplicate identical queries
 * within the same request
 */

/**
 * Get user accounts (cached per request)
 */
export const getUserAccounts = cache(async (userId: string) => {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
  });
});

/**
 * Get user categories (cached per request)
 */
export const getUserCategories = cache(async (userId: string) => {
  return prisma.category.findMany({
    where: { userId },
    orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
  });
});

/**
 * Get user by email (cached per request)
 */
export const getUserByEmail = cache(async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
});

/**
 * Get recent transactions (cached per request)
 * Limited to last N transactions for dashboard/overview
 */
export const getRecentTransactions = cache(
  async (userId: string, limit: number = 10) => {
    return prisma.transaction.findMany({
      where: { account: { userId } },
      include: {
        account: { select: { name: true } },
        category: { select: { name: true, color: true } },
      },
      orderBy: { date: "desc" },
      take: limit,
    });
  }
);

/**
 * Get account balance summary (cached per request)
 */
export const getAccountBalances = cache(async (userId: string) => {
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: {
      id: true,
      currentBalance: true,
      type: true,
    },
  });

  return accounts.reduce(
    (acc, account) => {
      acc.total += account.currentBalance;
      if (account.type === "CHECKING" || account.type === "SAVINGS") {
        acc.cash += account.currentBalance;
      } else if (account.type === "INVESTMENT") {
        acc.investments += account.currentBalance;
      } else if (account.type === "CREDIT_CARD" || account.type === "LOAN") {
        acc.debt += account.currentBalance;
      }
      return acc;
    },
    { total: 0, cash: 0, investments: 0, debt: 0 }
  );
});

/**
 * Get monthly transaction summary (cached per request)
 */
export const getMonthlySummary = cache(
  async (userId: string, year: number, month: number) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 1);

    const [incomeResult, expenseResult] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          account: { userId },
          amount: { gt: 0 },
          date: { gte: startOfMonth, lt: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          account: { userId },
          amount: { lt: 0 },
          date: { gte: startOfMonth, lt: endOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      income: incomeResult._sum.amount ?? 0,
      expenses: Math.abs(expenseResult._sum.amount ?? 0),
    };
  }
);

/**
 * Clear cache (for mutations - note: React cache is request-scoped,
 * so this is mainly for documentation purposes)
 */
export function clearCache() {
  // React cache() is automatically cleared at the end of each request
  // This function exists for documentation purposes
}
