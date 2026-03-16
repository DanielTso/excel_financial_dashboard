import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BudgetGrid } from "@/components/budget/BudgetGrid";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";

export default async function BudgetPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  const currentYear = 2026;
  const currentMonth = 3;

  // Get categories with budgets for the current month
  const categories = await prisma.category.findMany({
    where: { userId: user.id, isIncome: false },
    include: {
      budgets: {
        where: { year: currentYear, month: currentMonth },
        select: { month: true, year: true, budgeted: true },
      },
    },
    orderBy: { group: "asc" },
  });

  // Use aggregation to get transaction sums by category (more efficient than loading all transactions)
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const endOfMonth = new Date(currentYear, currentMonth, 1);

  const transactionSums = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      account: { userId: user.id },
      categoryId: { not: null },
      amount: { lt: 0 }, // Only expenses
      date: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // Create a map of categoryId to transaction sum
  const transactionMap = new Map(
    transactionSums.map((t) => [t.categoryId, Math.abs(t._sum.amount ?? 0)])
  );

  // Combine categories with their transaction totals
  const categoriesWithTransactions = categories.map((cat) => ({
    ...cat,
    transactions: [{ amount: -(transactionMap.get(cat.id) ?? 0) }], // Negative for expense
  }));

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display text-foreground leading-tight">
            Budget
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Plan your spending and track your progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-divider rounded-md px-1 py-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-sand/20">
              <ChevronLeft size={18} />
            </Button>
            <span className="text-[13px] font-bold px-4">March 2026</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-sand/20">
              <ChevronRight size={18} />
            </Button>
          </div>
          <Button
            variant="outline"
            className="h-10 gap-2 border-divider hover:bg-sand/20 text-[13px] font-semibold"
          >
            <Copy size={18} />
            Copy Last Month
          </Button>
        </div>
      </div>

      <BudgetGrid
        categories={categoriesWithTransactions}
        month={currentMonth}
        year={currentYear}
      />
    </div>
  );
}
