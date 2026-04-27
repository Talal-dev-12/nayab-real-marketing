'use client';
import { useState, useEffect, useRef } from 'react';
import PropertyCard from '@/components/ui/PropertyCard';
import Pagination from '@/components/ui/Pagination';
import { PropertyCardSkeleton } from '@/components/ui/Skeleton';
import { Search, SlidersHorizontal, MapPin, X, Building2 } from 'lucide-react';
import { useProperties, type PropertyFilters } from '@/hooks/useProperties';
import PriceRangeSlider from '@/components/ui/PriceRangeSlider';

const formatPrice = (value: number) => {
  if (value === 0) return '0';
  if (value >= 10000000) return `${(value / 10000000).toFixed(2).replace(/\.?0+$/, '')} Crore`;
  if (value >= 100000) return `${(value / 100000).toFixed(2).replace(/\.?0+$/, '')} Lac`;
  return `${(value / 1000).toFixed(0)}k`;
};

const POPULAR_AREAS = [
  'Clifton', 'DHA', 'Gulshan', 'Johar', 'Bahria Town',
  'PECHS', 'North Nazimabad', 'Gulberg', 'F-7 Islamabad', 'Blue Area',
];

const DEFAULT_FILTERS: PropertyFilters = {
  type: 'all', priceType: 'all', city: 'all', search: '', minPrice: '', maxPrice: '',
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
      <div className="primary-gradient py-20 pb-28 text-center relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/[0.03] rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/[0.03] rounded-full" />
        <div className="relative z-10">
          <p className="text-red-400 text-sm font-semibold tracking-widest uppercase mb-3">Explore Our Listings</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Browse Properties</h1>
          <p className="text-slate-400 text-[15px] max-w-lg mx-auto">Discover verified properties across Pakistan — filtered to match exactly what you're looking for.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── Filter bar — elevated card overlapping hero ── */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 -mt-20 relative z-20 mb-10">

          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-700/10 flex items-center justify-center">
                <SlidersHorizontal size={18} className="text-red-700" />
              </div>
              <h2 className="text-[#1a2e5a] font-bold text-lg">Filter Properties</h2>
            </div>
            <div className="text-[13px] font-semibold text-slate-500 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
              {loading ? 'Searching…' : `${total} propert${total === 1 ? 'y' : 'ies'} found`}
            </div>
          </div>

          {/* Filters grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">

            {/* Search */}
            <div className="lg:col-span-3" ref={searchRef}>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Search Location
              </label>
              <div className="relative">
                <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm rounded-xl overflow-hidden transition-all">
                  <Search size={16} className="text-slate-400 ml-3.5 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchInput}
                    placeholder="Area, title..."
                    className="outline-none text-sm flex-1 px-3 py-3 bg-transparent text-slate-800 placeholder:text-slate-400 w-full"
                    onChange={e => { setSearchInput(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={e => e.key === 'Enter' && triggerSearch()}
                  />
                  {searchInput && (
                    <button onClick={clearSearch} className="text-slate-400 hover:text-slate-600 px-2 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                  <button
                    onClick={triggerSearch}
                    className="bg-[#1a2e5a] hover:bg-[#243d72] text-white px-4 py-3 text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Search size={14} /> Search
                  </button>
                </div>

                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 pt-2.5 pb-1.5">
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
            <div className="lg:col-span-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Listing Type
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all">
                <select
                  className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium cursor-pointer appearance-none"
                  value={filters.priceType}
                  onChange={e => setFilters(f => ({ ...f, priceType: e.target.value, minPrice: '', maxPrice: '' }))}
                >
                  <option value="all">All Listings</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>

            {/* Property Type */}
            <div className="lg:col-span-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Property Type
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all">
                <Building2 size={16} className="text-slate-400 mr-2 shrink-0" />
                <select
                  className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium cursor-pointer appearance-none"
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
            </div>

            {/* City */}
            <div className="lg:col-span-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                City
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all">
                <MapPin size={16} className="text-slate-400 mr-2 shrink-0" />
                <select
                  className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium cursor-pointer appearance-none"
                  value={filters.city}
                  onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
                >
                  <option value="all">All Cities</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
              </div>
            </div>
            {/* Price Range */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 focus-within:border-red-500 focus-within:shadow-sm transition-all h-full flex flex-col justify-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Price Range
                </label>
                <PriceRangeSlider
                  min={0}
                  max={filters.priceType === 'rent' ? 1000000 : 500000000}
                  step={filters.priceType === 'rent' ? 10000 : 1000000}
                  value={[
                    filters.minPrice ? Number(filters.minPrice) : 0,
                    filters.maxPrice ? Number(filters.maxPrice) : (filters.priceType === 'rent' ? 1000000 : 500000000)
                  ]}
                  onChange={(val) => {
                    const [minPrice, maxPrice] = val;
                    const maxAllowed = filters.priceType === 'rent' ? 1000000 : 500000000;
                    setFilters(f => ({
                      ...f,
                      minPrice: minPrice === 0 ? '' : minPrice.toString(),
                      maxPrice: maxPrice >= maxAllowed ? '' : maxPrice.toString()
                    }));
                  }}
                  formatLabel={formatPrice}
                />
              </div>
            </div>
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