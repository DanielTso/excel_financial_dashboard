import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
}

export function KpiCard({ label, value, delta, className }: KpiCardProps) {
  return (
    <Card className={cn("border-border shadow-card hover:shadow-hover transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold text-muted-foreground uppercase tracking-tight">
            {label}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-foreground leading-none">
              {value}
            </span>
          </div>
          
          {delta && (
            <div className="flex items-center gap-2 mt-4">
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-sm text-[12px] font-bold",
                delta.isPositive ? "bg-positive-bg text-positive" : "bg-negative-bg text-negative"
              )}>
                {delta.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{delta.value}</span>
              </div>
              {delta.label && (
                <span className="text-[11px] text-muted-foreground italic">
                  {delta.label}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
