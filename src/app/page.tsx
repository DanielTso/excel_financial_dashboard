import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { SpendingDonutChart } from "@/components/dashboard/SpendingDonutChart";
import { NetWorthTrendChart } from "@/components/dashboard/NetWorthTrendChart";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Calculate real KPIs
  const accounts = await prisma.account.findMany({ where: { userId: user!.id } });
  const totalAssets = accounts.filter(a => a.currentBalance > 0).reduce((sum, a) => sum + a.currentBalance, 0);
  const totalLiabilities = Math.abs(accounts.filter(a => a.currentBalance < 0).reduce((sum, a) => sum + a.currentBalance, 0));
  const netWorthValue = totalAssets - totalLiabilities;

  const currentMonthTransactions = await prisma.transaction.findMany({
    where: {
      account: { userId: user!.id },
      date: {
        gte: new Date(2026, 2, 1),
        lt: new Date(2026, 3, 1),
      }
    },
    include: {
      category: true,
      account: true
    }
  });

  const income = currentMonthTransactions.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
  const expense = Math.abs(currentMonthTransactions.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0));
  const cashFlow = income - expense;

  const recentTransactions = await prisma.transaction.findMany({
    where: { account: { userId: user!.id } },
    include: {
      account: { select: { name: true } },
      category: { select: { name: true, color: true } },
    },
    orderBy: { date: 'desc' },
    take: 7,
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-display text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">March 2026</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          label="Net Worth" 
          value={`$${netWorthValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          delta={{ value: "+4.2%", isPositive: true, label: "this month" }}
        />
        <KpiCard 
          label="Cash Flow" 
          value={`$${cashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          delta={{ value: cashFlow >= 0 ? "+$252" : "-$252", isPositive: cashFlow >= 0, label: "vs last month" }}
        />
        <KpiCard 
          label="Budget Used" 
          value="72%" 
          delta={{ value: "72% of $4,200", isPositive: true }}
        />
        <KpiCard 
          label="Bills Due (TD)" 
          value="$1,340" 
          delta={{ value: "3 upcoming", isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[15px] font-semibold text-foreground uppercase tracking-tight">Income vs. Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart />
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[15px] font-semibold text-foreground uppercase tracking-tight">Top Spending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingDonutChart />
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Trend Section */}
      <Card className="border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-[15px] font-semibold text-foreground uppercase tracking-tight">Net Worth — 12 Month Trend</CardTitle>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm bg-positive-bg text-positive text-[12px] font-bold">
            <TrendingUp size={14} />
            <span>+$32,420 (20.9%)</span>
          </div>
        </CardHeader>
        <CardContent>
          <NetWorthTrendChart />
        </CardContent>
      </Card>

      {/* Recent Transactions Table */}
      <Card className="border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[15px] font-semibold text-foreground uppercase tracking-tight">Recent Transactions</CardTitle>
          <Link href="/transactions">
            <Button variant="outline" size="sm" className="h-8 gap-2 text-[12px] border-steel-blue text-steel-blue hover:bg-steel-blue/5">
              View All <ArrowRight size={14} />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={recentTransactions} />
        </CardContent>
      </Card>
    </div>
  );
}
