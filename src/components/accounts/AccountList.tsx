"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  type: string;
  institution: string | null;
  currentBalance: number;
}

interface AccountListProps {
  accounts: Account[];
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CHECKING: "Banking",
  SAVINGS: "Banking",
  CREDIT_CARD: "Credit Cards",
  INVESTMENT: "Investments",
  LOAN: "Loans",
  ASSET: "Assets",
  LIABILITY: "Liabilities",
};

export function AccountList({ accounts }: AccountListProps) {
  const groupedAccounts = accounts.reduce((acc, account) => {
    const group = ACCOUNT_TYPE_LABELS[account.type] || "Other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  const totalNetWorth = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  return (
    <div className="space-y-6">
      {Object.entries(groupedAccounts).map(([group, groupAccounts]) => (
        <div key={group} className="space-y-3">
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground px-1">
            {group}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupAccounts.map((account) => (
              <Card key={account.id} className="border-border shadow-card hover:shadow-hover transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[14px] font-semibold text-foreground leading-tight">{account.name}</p>
                    <p className="text-[11px] text-muted-foreground">{account.institution || "Other"}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-[15px] font-mono font-bold leading-tight",
                      account.currentBalance >= 0 ? "text-foreground" : "text-negative"
                    )}>
                      ${Math.abs(account.currentBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      {account.currentBalance < 0 && "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
      
      <div className="pt-8 border-t border-divider flex justify-between items-baseline px-2">
        <span className="text-[14px] font-bold text-muted-foreground uppercase tracking-tight">Total Net Worth</span>
        <span className={cn(
          "text-2xl font-mono font-bold",
          totalNetWorth >= 0 ? "text-positive" : "text-negative"
        )}>
          ${Math.abs(totalNetWorth).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
