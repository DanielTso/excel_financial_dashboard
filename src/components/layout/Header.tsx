"use client";

import { Search, Bell, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";

export function Header() {
  return (
    <header className="h-[56px] bg-white border-b border-border fixed top-0 right-0 left-[220px] z-30 flex items-center justify-between px-8">
      <div className="flex items-center gap-4 w-1/2 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Search Transactions..." 
            className="pl-10 h-9 bg-sand/20 border-sand text-[13px] focus-visible:ring-steel-blue"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-sand/20">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border h-8">
          <span className="text-[13px] font-semibold text-foreground">Daniel Tso</span>
          <button 
            onClick={() => signOut()}
            className="w-8 h-8 rounded-full bg-steel-blue flex items-center justify-center text-white text-[12px] font-bold hover:bg-steel-blue/90 transition-colors"
          >
            DT
          </button>
          <button 
            onClick={() => signOut()}
            className="text-muted-foreground hover:text-negative transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
