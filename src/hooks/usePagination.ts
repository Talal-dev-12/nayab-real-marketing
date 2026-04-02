import { useState, useEffect, useCallback } from 'react';

interface UsePaginationOptions {
  /** Items per page on desktop (≥ lg breakpoint). Default: 12 */
  desktopPageSize?: number;
  /** Items per page on mobile (< lg breakpoint). Default: desktopPageSize */
  mobilePageSize?: number;
  /** Total number of items to paginate over */
  totalItems: number;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  resetPage: () => void;
  /** Slice a full array to the current page window */
  paginate: <T>(items: T[]) => T[];
}

/**
 * Centralised pagination logic used by every listing page.
 *
 * Handles:
 *  - Current page state
 *  - Responsive page size (mobile vs desktop via window.innerWidth / resize)
 *  - Total pages derived from totalItems + pageSize
 *  - A `paginate()` helper to slice any array
 */
export function usePagination({
  desktopPageSize = 12,
  mobilePageSize,
  totalItems,
}: UsePaginationOptions): UsePaginationReturn {
  const mobileFallback = mobilePageSize ?? desktopPageSize;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize,    setPageSize]    = useState(desktopPageSize);

  /* Sync page size with viewport */
  useEffect(() => {
    const update = () =>
      setPageSize(window.innerWidth < 1024 ? mobileFallback : desktopPageSize);

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [desktopPageSize, mobileFallback]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  /* Clamp currentPage if totalPages shrinks (e.g. after a filter change) */
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const paginate = useCallback(<T>(items: T[]): T[] =>
    items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, pageSize]
  );

  return { currentPage, pageSize, totalPages, setPage, resetPage, paginate };
}