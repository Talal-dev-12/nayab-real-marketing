'use client';
import { useState, useEffect, useRef } from 'react';
import PropertyCard from '@/components/ui/PropertyCard';
import Pagination from '@/components/ui/Pagination';
import { PropertyCardSkeleton } from '@/components/ui/Skeleton';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { useProperties, type PropertyFilters } from '@/hooks/useProperties';

const POPULAR_AREAS = [
  'Clifton', 'DHA', 'Gulshan', 'Johar', 'Bahria Town',
  'PECHS', 'North Nazimabad', 'Gulberg', 'F-7 Islamabad', 'Blue Area',
];

const DEFAULT_FILTERS: PropertyFilters = {
  type: 'all', priceType: 'all', city: 'all', search: '',
};

export default function PropertiesPage() {
  const [filters,         setFilters]         = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [page,            setPage]            = useState(1);
  const [searchInput,     setSearchInput]     = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef  = useRef<HTMLDivElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);

  /* ── Data ── */
  const { properties, total, totalPages, loading } = useProperties({
    filters,
    page,
    limit: 12,
  });

  /* ── Side effects ── */

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [filters]);

  // Close suggestions dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Handlers ── */
  const triggerSearch = () => {
    setShowSuggestions(false);
    setFilters(f => ({ ...f, search: searchInput.trim() }));
  };

  const pickSuggestion = (area: string) => {
    setSearchInput(area);
    setShowSuggestions(false);
    setFilters(f => ({ ...f, search: area }));
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilters(f => ({ ...f, search: '' }));
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    setTimeout(() => {
      gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const suggestions = searchInput.trim()
    ? POPULAR_AREAS.filter(a => a.toLowerCase().includes(searchInput.toLowerCase()))
    : POPULAR_AREAS;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="primary-gradient py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Browse Properties</h1>
        <p className="text-slate-400">Find your perfect property from our verified listings</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Filter bar ── */}
        <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-4 items-end">

          {/* Search */}
          <div className="flex-1 min-w-[260px]" ref={searchRef}>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Search
            </label>
            <div className="relative">
              <div className="flex items-center border-2 border-slate-200 focus-within:border-red-500 rounded-lg overflow-hidden transition-colors">
                <Search size={16} className="text-red-600 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  placeholder="Search by area, title or location..."
                  className="outline-none text-sm flex-1 px-2 py-2.5"
                  onChange={e => { setSearchInput(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={e => e.key === 'Enter' && triggerSearch()}
                />
                {searchInput && (
                  <button onClick={clearSearch} className="text-slate-400 hover:text-slate-600 px-2">
                    <X size={14} />
                  </button>
                )}
                <button
                  onClick={triggerSearch}
                  className="bg-red-700 hover:bg-red-600 text-white px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Search size={14} /> Search
                </button>
              </div>

              {/* Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <p className="text-xs font-semibold text-slate-400 uppercase px-4 pt-3 pb-1">
                    Popular Areas
                  </p>
                  {suggestions.map(area => (
                    <button
                      key={area}
                      onClick={() => pickSuggestion(area)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <MapPin size={14} className="text-red-400 flex-shrink-0" />
                      {area}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Listing Type */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Listing Type
            </label>
            <select
              className="border rounded-lg px-3 py-2.5 text-sm outline-none"
              value={filters.priceType}
              onChange={e => setFilters(f => ({ ...f, priceType: e.target.value }))}
            >
              <option value="all">All</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Property Type
            </label>
            <select
              className="border rounded-lg px-3 py-2.5 text-sm outline-none"
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="office">Office</option>
              <option value="plot">Plot</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">City</label>
            <select
              className="border rounded-lg px-3 py-2.5 text-sm outline-none"
              value={filters.city}
              onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
            >
              <option value="all">All Cities</option>
              <option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>

          {/* Count */}
          <div className="text-sm text-slate-500 pb-1">
            <SlidersHorizontal size={16} className="inline mr-1" />
            {loading ? 'Loading…' : `${total} propert${total === 1 ? 'y' : 'ies'} found`}
          </div>
        </div>

        {/* Scroll anchor */}
        <div ref={gridTopRef} style={{ scrollMarginTop: '80px' }} />

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-xl font-semibold">No properties found</p>
            <p className="text-sm mt-2">Try a different area or adjust your filters</p>
            {filters.search && (
              <button onClick={clearSearch} className="mt-4 text-sm text-red-700 font-semibold hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}

        {/* ── Pagination ── */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Page label */}
        {!loading && totalPages > 1 && (
          <p className="text-center text-xs text-slate-400 mt-3">
            Page {page} of {totalPages} &nbsp;·&nbsp; {total} properties
          </p>
        )}

      </div>
    </div>
  );
}