"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface TransactionFiltersProps {
  categories: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
}

export function TransactionFilters({
  categories,
  accounts,
}: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") ?? ""
  );
  const [accountId, setAccountId] = useState(
    searchParams.get("accountId") ?? ""
  );

  const hasFilters = search || categoryId || accountId;

  function applyFilters() {
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }

    if (accountId) {
      params.set("accountId", accountId);
    } else {
      params.delete("accountId");
    }

    // Reset to page 1 when filters change
    params.delete("page");

    startTransition(() => {
      router.push(`/transactions?${params.toString()}`);
    });
  }

  function clearFilters() {
    setSearch("");
    setCategoryId("");
    setAccountId("");

    startTransition(() => {
      router.push("/transactions");
    });
  }

  return (
    <div className="bg-white rounded-lg border border-border shadow-card p-4 space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            type="text"
            placeholder="Search payee, memo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="pl-9 h-10"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-10 px-3 rounded-md border border-border bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-steel-blue/20 min-w-[150px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Account filter */}
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="h-10 px-3 rounded-md border border-border bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-steel-blue/20 min-w-[150px]"
        >
          <option value="">All Accounts</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>

        {/* Apply button */}
        <Button
          onClick={applyFilters}
          disabled={isPending}
          className="bg-steel-blue hover:bg-steel-blue/90 h-10"
        >
          {isPending ? "Applying..." : "Apply Filters"}
        </Button>

        {/* Clear button */}
        {hasFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            disabled={isPending}
            className="h-10 gap-1"
          >
            <X size={16} />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
