import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySpendingChart } from "@/components/reports/CategorySpendingChart";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const categories = await prisma.category.findMany({
    where: { userId: user!.id, isIncome: false },
    include: {
      transactions: true
    }
  });

  const spendingData = categories.map(cat => ({
    name: cat.name,
    amount: Math.abs(cat.transactions.reduce((sum, tx) => sum + tx.amount, 0)),
    color: cat.color || "#5C5C5C"
  })).filter(d => d.amount > 0).sort((a, b) => b.amount - a.amount);

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display text-foreground leading-tight">Financial Reports</h1>
        <p className="text-[13px] text-muted-foreground">Insightful analytics of your financial health.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold text-foreground uppercase tracking-tight">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full bg-sand/5 rounded-md p-4">
              <CategorySpendingChart data={spendingData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
