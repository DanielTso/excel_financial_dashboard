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

  const categories = await prisma.category.findMany({
    where: { userId: user!.id, isIncome: false },
    include: {
      budgets: {
        where: { year: 2026 },
      },
      transactions: {
        where: {
          date: {
            gte: new Date(2026, 2, 1),
            lt: new Date(2026, 3, 1),
          },
        },
      },
    },
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display text-foreground leading-tight">Budget</h1>
          <p className="text-[13px] text-muted-foreground">Plan your spending and track your progress.</p>
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
          <Button variant="outline" className="h-10 gap-2 border-divider hover:bg-sand/20 text-[13px] font-semibold">
            <Copy size={18} />
            Copy Last Month
          </Button>
        </div>
      </div>

      <BudgetGrid categories={categories} month={3} year={2026} />
    </div>
  );
}
