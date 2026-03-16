"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CreditCard, 
  PieChart, 
  ArrowLeftRight, 
  CalendarClock, 
  TrendingUp, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Accounts", href: "/accounts", icon: CreditCard },
  { label: "Budget", href: "/budget", icon: PieChart },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Bills & Income", href: "/bills", icon: CalendarClock },
  { label: "Net Worth", href: "/net-worth", icon: TrendingUp },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-charcoal h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6">
        <h1 className="font-display text-2xl text-sand">Tso Finance</h1>
        <p className="text-[10px] text-sand/50 uppercase tracking-widest mt-1">Personal Dashboard</p>
      </div>
      
      <nav className="flex-1 mt-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-sm transition-colors text-sand/80 hover:bg-sand/10 hover:text-sand",
                    isActive && "bg-sand/15 text-sand border-l-4 border-steel-blue"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[13px] font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sand/10">
        <div className="text-[11px] text-sand/40">
          <p>Tso Finance v1.0.0</p>
          <p>Crafts2Build LLC</p>
        </div>
      </div>
    </aside>
  );
}
