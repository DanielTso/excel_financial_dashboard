"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  group: string;
  budgets: { month: number; year: number; budgeted: number }[];
  transactions: { amount: number }[];
}

interface BudgetGridProps {
  categories: Category[];
  month: number;
  year: number;
}

export function BudgetGrid({ categories, month, year }: BudgetGridProps) {
  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  return (
    <div className="bg-white rounded-md border border-border shadow-card overflow-hidden">
      <Table>
        <TableHeader className="bg-sand/30 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent h-10 border-divider">
            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-4">Category</TableHead>
            <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground w-[150px]">Budgeted</TableHead>
            <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground w-[150px]">Actual</TableHead>
            <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground w-[150px] px-4">Difference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedCategories).map(([group, cats]) => (
            <React.Fragment key={group}>
              <TableRow className="bg-sand/10 h-8 border-divider">
                <TableCell colSpan={4} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 py-1">
                  {group}
                </TableCell>
              </TableRow>
              {cats.map((cat) => {
                const budgeted = cat.budgets.find(b => b.month === month && b.year === year)?.budgeted || 0;
                const actual = Math.abs(cat.transactions.reduce((sum, tx) => sum + tx.amount, 0));
                const diff = budgeted - actual;
                const percent = budgeted > 0 ? (actual / budgeted) * 100 : 0;

                return (
                  <TableRow key={cat.id} className="hover:bg-sand/5 transition-colors border-divider h-10 group">
                    <TableCell className="text-[13px] font-medium py-2 px-4">{cat.name}</TableCell>
                    <TableCell className="text-right font-mono text-[13px] py-2">
                      <input 
                        className="bg-transparent text-right w-full focus:outline-none focus:bg-sand/20 rounded px-1 cursor-edit tabular-nums"
                        defaultValue={budgeted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono text-[13px] text-muted-foreground py-2 tabular-nums">
                      ${actual.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-mono text-[13px] font-bold py-2 px-4 tabular-nums",
                      percent >= 100 ? "text-negative bg-negative-bg/20" : 
                      percent >= 85 ? "text-warning bg-warning-bg/20" : 
                      "text-positive bg-positive-bg/20"
                    )}>
                      ${Math.abs(diff).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      {diff < 0 ? "-" : ""}
                    </TableCell>
                  </TableRow>
                );
              })}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import React from "react";
