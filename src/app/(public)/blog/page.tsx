'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/ui/BlogCard';
import Pagination from '@/components/ui/Pagination';
import { BlogCardSkeleton } from '@/components/ui/Skeleton';
import { Search, MapPin, Building2, X, SlidersHorizontal } from 'lucide-react';
import type { AreaSummary, SchemeSummary } from '@/types';
import { useBlogs } from '@/hooks/useBlogs';
import { usePagination } from '@/hooks/usePagination';
import Select from '@/components/ui/Select';

/* ─────────────────────────────────────────────
   FilterPanel — shared by sidebar + drawer
───────────────────────────────────────────── */
interface FilterPanelProps {
  search: string; setSearch: (v: string) => void;
  category: string; setCategory: (v: string) => void;
  areaF: string; setAreaF: (v: string) => void;
  schemeF: string; setSchemeF: (v: string) => void;
  categories: string[];
  areas: AreaSummary[];
  visibleSchemes: SchemeSummary[];
  schemes: SchemeSummary[];
  hasFilters: boolean;
  clearFilters: () => void;
  onClose?: () => void;
}

function FilterPanel({
  search, setSearch, category, setCategory,
  areaF, setAreaF, schemeF, setSchemeF,
  categories, areas, visibleSchemes, schemes,
  hasFilters, clearFilters, onClose,
}: FilterPanelProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-200 transition-all">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input type="text" value={search} placeholder="Search articles..."
            onChange={e => setSearch(e.target.value)} className="outline-none text-sm flex-1" />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear search">
              <X size={13} className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Category</p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all relative">
          <Select
            value={category}
            onChange={(val) => { setCategory(val); onClose?.(); }}
            className="w-full text-slate-700 font-medium py-1"
            options={categories.map(cat => ({
              value: cat,
              label: cat === 'all' ? 'All Categories' : cat
            }))}
          />
        </div>
      </div>

      {/* Area */}
      {areas.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin size={12} className="text-red-600" /> Filter by Area
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all relative">
            <Select
              value={areaF}
              onChange={(val) => { setAreaF(val); onClose?.(); }}
              className="w-full text-slate-700 font-medium py-1"
              options={[
                { value: 'all', label: 'All Areas' },
                ...areas.map(a => ({
                  value: a.slug,
                  label: `${a.label} (${a.blogCount})`
                }))
              ]}
            />
          </div>
          <Link href="/blogs/areas" className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-3 hover:underline">
            View all areas →
          </Link>
        </div>
      )}

      {/* Scheme */}
      {visibleSchemes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Building2 size={12} className="text-red-600" /> Housing Scheme
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all relative">
            <Select
              value={schemeF}
              onChange={(val) => { setSchemeF(val); onClose?.(); }}
              className="w-full text-slate-700 font-medium py-1"
              options={[
                { value: 'all', label: 'All Schemes' },
                ...visibleSchemes.map(s => ({
                  value: s.slug,
                  label: `${s.label} (${s.blogCount})`
                }))
              ]}
            />
          </div>
          <Link href="/blogs/schemes" className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-3 hover:underline">
            View all schemes →
          </Link>
        </div>
      )}

      {hasFilters && (
        <button onClick={() => { clearFilters(); onClose?.(); }}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl transition-colors mt-2">
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FilterDrawer — mobile only
───────────────────────────────────────────── */
function FilterDrawer({ open, onClose, activeCount, children }: {
  open: boolean; onClose: () => void; activeCount: number; children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div onClick={onClose} aria-hidden="true"
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }} />
      <div role="dialog" aria-modal="true" aria-label="Filters"
        className="fixed top-0 right-0 h-full w-[82vw] max-w-sm bg-gray-50 z-50 lg:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out"
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-red-600" />
            <span className="font-bold text-[#1a2e5a] text-base">Filters</span>
            {activeCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <button onClick={onClose} aria-label="Close filters"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors">
            <X size={16} className="text-slate-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        <div className="px-4 py-3 bg-white border-t shrink-0">
          <button onClick={onClose}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm transition-colors">
            Show Results
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function BlogPage() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [areaF,    setAreaF]    = useState('all');
  const [schemeF,  setSchemeF]  = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const gridTopRef = useRef<HTMLDivElement>(null);

  /* ── Data via shared hook ── */
  const { blogs, areas, schemes, loading } = useBlogs();

  /* ── Derived filter values ── */
  useEffect(() => { setSchemeF('all'); }, [areaF]);

  const visibleSchemes = useMemo(() =>
    areaF === 'all' ? schemes : schemes.filter(s => s.areaSlug === areaF),
    [schemes, areaF]
  );

  const filtered = useMemo(() => blogs.filter(b => {
    if (category !== 'all' && b.category   !== category) return false;
    if (areaF    !== 'all' && b.areaSlug   !== areaF)    return false;
    if (schemeF  !== 'all' && b.schemeSlug !== schemeF)   return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase()) &&
        !b.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [blogs, category, areaF, schemeF, search]);

  /* ── Pagination via shared hook ── */
  const { currentPage, pageSize, totalPages, setPage, resetPage, paginate } = usePagination({
    totalItems:      filtered.length,
    desktopPageSize: 9,
    mobilePageSize:  6,
  });

  useEffect(() => { resetPage(); }, [search, category, areaF, schemeF, resetPage]);

  const paginated = paginate(filtered);

  /* ── Helpers ── */
  const categories  = ['all', ...Array.from(new Set(blogs.map(b => b.category)))];
  const hasFilters  = category !== 'all' || areaF !== 'all' || schemeF !== 'all' || !!search;
  const activeCount = [category !== 'all', areaF !== 'all', schemeF !== 'all', !!search].filter(Boolean).length;

  const clearFilters = useCallback(() => {
    setCategory('all'); setAreaF('all'); setSchemeF('all'); setSearch('');
  }, []);

  const handlePageChange = (p: number) => {
    setPage(p);
    setTimeout(() => gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const filterProps = {
    search, setSearch, category, setCategory,
    areaF, setAreaF, schemeF, setSchemeF,
    categories, areas, visibleSchemes, schemes,
    hasFilters, clearFilters,
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="primary-gradient py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Blog & Property Guides</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Real estate insights, investment tips, and area guides for Karachi's top localities
        </p>
        {areas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {areas.slice(0, 6).map(a => (
              <Link key={a.slug} href={`/blogs/areas/${a.slug}`}
                className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 transition-colors">
                <MapPin size={11} /> {a.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden lg:block lg:w-64 shrink-0 space-y-4">
            <FilterPanel {...filterProps} />
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile top bar */}
            <div className="flex items-center justify-between mb-5 lg:hidden">
              <p className="text-sm text-slate-500">
                {loading
                  ? <span className="h-4 w-24 bg-slate-200 rounded animate-pulse inline-block" />
                  : <>{filtered.length} article{filtered.length !== 1 ? 's' : ''}</>}
              </p>
              <button onClick={() => setDrawerOpen(true)}
                className="relative flex items-center gap-2 bg-white border border-slate-200 shadow-sm text-[#1a2e5a] font-semibold text-sm px-4 py-2 rounded-xl hover:border-red-300 hover:shadow-md transition-all">
                <SlidersHorizontal size={15} className="text-red-600" />
                Filters
                {activeCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>

            {/* Desktop result count */}
            <div className="hidden lg:flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                {loading
                  ? <span className="h-4 w-24 bg-slate-200 rounded animate-pulse inline-block" />
                  : <>{filtered.length} article{filtered.length !== 1 ? 's' : ''} &nbsp;·&nbsp; Page {currentPage} of {totalPages}</>}
              </p>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {category !== 'all' && (
                  <span className="flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                    {category} <button onClick={() => setCategory('all')} aria-label="Remove"><X size={10} /></button>
                  </span>
                )}
                {areaF !== 'all' && (
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                    <MapPin size={10} /> {areas.find(a => a.slug === areaF)?.label}
                    <button onClick={() => setAreaF('all')} aria-label="Remove"><X size={10} /></button>
                  </span>
                )}
                {schemeF !== 'all' && (
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                    <Building2 size={10} /> {schemes.find(s => s.slug === schemeF)?.label}
                    <button onClick={() => setSchemeF('all')} aria-label="Remove"><X size={10} /></button>
                  </span>
                )}
                {search && (
                  <span className="flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">
                    <Search size={10} /> "{search}"
                    <button onClick={() => setSearch('')} aria-label="Remove"><X size={10} /></button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs text-red-600 font-semibold hover:underline px-1">
                  Clear all
                </button>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={gridTopRef} style={{ scrollMarginTop: '80px' }} />

            {/* Blog grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(pageSize)].map((_, i) => <BlogCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-lg font-semibold mb-2">No articles found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-4 text-red-600 font-semibold text-sm hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.map(b => <BlogCard key={b._id} blog={b} />)}
                </div>

                {/* Shared Pagination component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />

                <p className="text-center text-xs text-slate-400 mt-3 lg:hidden">
                  Page {currentPage} of {totalPages} &nbsp;·&nbsp; {filtered.length} articles
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} activeCount={activeCount}>
        <FilterPanel {...filterProps} onClose={() => setDrawerOpen(false)} />
      </FilterDrawer>
    </div>
  );
}