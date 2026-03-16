"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPageNumbers } from "@/lib/pagination";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  baseUrl,
}: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}page=${page}&pageSize=${pageSize}`;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-divider">
      <div className="text-[12px] text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} transactions
      </div>

      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Link
          href={getPageUrl(currentPage - 1)}
          aria-label="Previous page"
          className={cn(
            "inline-flex items-center justify-center h-8 w-8 rounded-md border border-border bg-white text-sm font-medium transition-colors hover:bg-sand/20",
            currentPage <= 1 && "pointer-events-none opacity-50"
          )}
          tabIndex={currentPage <= 1 ? -1 : 0}
        >
          <ChevronLeft size={16} />
        </Link>

        {/* Page numbers */}
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-[12px] text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page as number)}
              className={cn(
                "inline-flex items-center justify-center h-8 min-w-[32px] px-2 rounded-md text-[12px] font-medium transition-colors",
                currentPage === page
                  ? "bg-steel-blue text-white hover:bg-steel-blue/90"
                  : "border border-border bg-white hover:bg-sand/20"
              )}
            >
              {page}
            </Link>
          )
        )}

        {/* Next button */}
        <Link
          href={getPageUrl(currentPage + 1)}
          aria-label="Next page"
          className={cn(
            "inline-flex items-center justify-center h-8 w-8 rounded-md border border-border bg-white text-sm font-medium transition-colors hover:bg-sand/20",
            currentPage >= totalPages && "pointer-events-none opacity-50"
          )}
          tabIndex={currentPage >= totalPages ? -1 : 0}
        >
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
