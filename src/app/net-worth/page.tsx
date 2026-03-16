import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AllocationDonut } from "@/components/charts/AllocationDonut";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 

export default async function NetWorthPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const accounts = await prisma.account.findMany({
    where: { userId: user!.id },
  });

  const assets = accounts.filter(a => a.currentBalance > 0);
  const liabilities = accounts.filter(a => a.currentBalance < 0);
  
  const totalAssets = assets.reduce((sum, a) => sum + a.currentBalance, 0);
  const totalLiabilities = Math.abs(liabilities.reduce((sum, a) => sum + a.currentBalance, 0));
  const netWorth = totalAssets - totalLiabilities;

  const allocationData = assets.map(a => ({
    name: a.name,
    value: a.currentBalance,
    percent: (a.currentBalance / totalAssets) * 100
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display text-foreground leading-tight">Net Worth</h1>
        <p className="text-[13px] text-muted-foreground">Detailed breakdown of your assets and liabilities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Assets Table */}
          <Card className="border-border shadow-card">
            <CardHeader className="bg-sand/10 h-10 py-0 flex items-center">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Assets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-[13px]">
                <tbody className="divide-y divide-divider">
                  {assets.map((acc) => (
                    <tr key={acc.id} className="h-10">
                      <td className="px-4 font-medium">{acc.name}</td>
                      <td className="px-4 text-right font-mono">${acc.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-positive-bg/10 h-12">
                    <td className="px-4 font-bold text-positive">Total Assets</td>
                    <td className="px-4 text-right font-mono font-bold text-positive text-lg">${totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Liabilities Table */}
          <Card className="border-border shadow-card">
            <CardHeader className="bg-sand/10 h-10 py-0 flex items-center">
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Liabilities</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-[13px]">
                <tbody className="divide-y divide-divider">
                  {liabilities.map((acc) => (
                    <tr key={acc.id} className="h-10">
                      <td className="px-4 font-medium">{acc.name}</td>
                      <td className="px-4 text-right font-mono">-${Math.abs(acc.currentBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-negative-bg/10 h-12">
                    <td className="px-4 font-bold text-negative">Total Liabilities</td>
                    <td className="px-4 text-right font-mono font-bold text-negative text-lg">-${totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-border shadow-card bg-steel-blue text-white overflow-hidden relative">
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <CardContent className="p-6 relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">Current Net Worth</p>
              <h2 className="text-4xl font-mono font-bold mt-2 tabular-nums">
                ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-white/90 bg-white/10 w-fit px-2 py-1 rounded">
                <span>+4.2% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <AllocationDonut data={allocationData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
