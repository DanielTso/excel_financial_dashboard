/**
 * Pagination utilities for database queries
 */

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Calculate skip and take values for Prisma queries
 */
export function getPaginationParams(
  page: number = 1,
  pageSize: number = 25
): { skip: number; take: number } {
  const validatedPage = Math.max(1, page);
  const validatedPageSize = Math.max(1, Math.min(100, pageSize)); // Max 100 items per page

  return {
    skip: (validatedPage - 1) * validatedPageSize,
    take: validatedPageSize,
  };
}

/**
 * Generate pagination metadata
 */
export function getPaginationMetadata(
  totalItems: number,
  currentPage: number,
  pageSize: number
) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const validatedPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  return {
    currentPage: validatedPage,
    pageSize,
    totalItems,
    totalPages: totalPages || 1,
    hasNextPage: validatedPage < totalPages,
    hasPreviousPage: validatedPage > 1,
  };
}

/**
 * Parse pagination from URL search params
 */
export function parsePaginationParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): { page: number; pageSize: number } {
  const params =
    searchParams instanceof URLSearchParams
      ? Object.fromEntries(searchParams.entries())
      : searchParams;

  const page = parseInt(String(params.page || "1"), 10);
  const pageSize = parseInt(String(params.pageSize || "25"), 10);

  return {
    page: isNaN(page) ? 1 : page,
    pageSize: isNaN(pageSize) ? 25 : pageSize,
  };
}

/**
 * Generate page numbers for pagination controls
 * Shows first, last, current, and neighbors
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | string)[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  // Adjust if near the beginning
  if (currentPage <= halfVisible + 1) {
    endPage = maxVisible;
  }

  // Adjust if near the end
  if (currentPage >= totalPages - halfVisible) {
    startPage = totalPages - maxVisible + 1;
  }

  // Add first page and ellipsis
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push("...");
    }
  }

  // Add visible pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // Add ellipsis and last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return pages;
}
