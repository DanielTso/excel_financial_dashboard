"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Transaction {
  id: string;
  date: Date;
  payee: string;
  amount: number;
  type: string;
  account: { name: string };
  category: { name: string; color: string | null } | null;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="bg-white rounded-md border border-border shadow-card overflow-hidden">
      <Table>
        <TableHeader className="bg-sand/30 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent h-10 border-divider">
            <TableHead className="w-[120px] text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-4">Date</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Payee</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Category</TableHead>
            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Account</TableHead>
            <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-4">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                No transactions found for this period.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-sand/10 transition-colors border-divider h-10 group">
                <TableCell className="text-[13px] font-mono py-2 px-4 text-muted-foreground">
                  {format(tx.date, "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-[13px] font-semibold py-2">
                  {tx.payee}
                </TableCell>
                <TableCell className="py-2">
                  {tx.category ? (
                    <Badge 
                      variant="outline" 
                      className="text-[11px] font-medium h-5 bg-white px-2 border-divider"
                      style={{ 
                        borderColor: tx.category.color ? `${tx.category.color}40` : undefined,
                        color: tx.category.color || undefined,
                        backgroundColor: tx.category.color ? `${tx.category.color}10` : undefined
                      }}
                    >
                      {tx.category.name}
                    </Badge>
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic px-2">Uncategorized</span>
                  )}
                </TableCell>
                <TableCell className="text-[12px] text-muted-foreground py-2">
                  {tx.account.name}
                </TableCell>
                <TableCell className={cn(
                  "text-right font-mono text-[13px] font-bold py-2 px-4 tabular-nums",
                  tx.amount > 0 ? "text-positive" : "text-foreground"
                )}>
                  {tx.amount > 0 ? `+$${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `-$${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
