import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  onPageChange: (page: number) => void;
  /** Extra Tailwind classes on the wrapper <nav> */
  className?:   string;
}

/**
 * Shared Pagination component used on the Properties page, Blog page,
 * and any future listing pages.
 *
 * Features:
 *  - Smart ellipsis: [1] … [4] [5*] [6] … [12]
 *  - Accessible: aria-label, aria-current="page"
 *  - Returns null when totalPages ≤ 1 (no unnecessary chrome)
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  /* ── Build page-number list with ellipsis ── */
  const getPages = (): (number | '…')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | '…')[] = [1];

    if (currentPage > 3) pages.push('…');

    const start = Math.max(2, currentPage - 1);
    const end   = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);

    return pages;
  };

  const btnBase =
    'transition-all duration-150 shadow-sm border font-semibold text-sm';

  const prevNextCls = `
    ${btnBase}
    flex items-center gap-1 px-3 py-2 rounded-lg
    bg-white border-slate-200 text-slate-600
    hover:border-red-300 hover:text-red-700 hover:shadow-md
    disabled:opacity-30 disabled:pointer-events-none
  `;

  const pageCls = (active: boolean) => `
    ${btnBase}
    w-9 h-9 rounded-lg
    ${active
      ? 'bg-red-700 text-white border-red-700 shadow-md shadow-red-200/60 scale-110'
      : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-700 hover:shadow-md'
    }
  `;

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 mt-10 flex-wrap select-none ${className}`}
    >
      {/* ← Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={prevNextCls}
      >
        <ChevronLeft size={15} /> Prev
      </button>

      {/* Page numbers */}
      {getPages().map((page, idx) =>
        page === '…' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={pageCls(currentPage === page)}
          >
            {page}
          </button>
        )
      )}

      {/* Next → */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={prevNextCls}
      >
        Next <ChevronRight size={15} />
      </button>
    </nav>
  );
}