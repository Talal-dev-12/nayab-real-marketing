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

const DEFAULT_FILTERS: PropertyFilters = {
  type: 'all', priceType: 'all', city: 'all', search: '', minPrice: '', maxPrice: '',
};

export default function PropertiesPage() {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const gridTopRef = useRef<HTMLDivElement>(null);

  /* ── Data ── */
  const { properties, total, totalPages, loading } = useProperties({
    filters: appliedFilters,
    page,
    limit: 12,
  });

  /* ── Side effects ── */

  // Reset to page 1 on applied filter change
  useEffect(() => { setPage(1); }, [appliedFilters]);

  /* ── Handlers ── */
  const triggerSearch = () => {
    setAppliedFilters(localFilters);
  };

  const clearSearch = () => {
    setLocalFilters(f => ({ ...f, search: '' }));
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    setTimeout(() => {
      gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

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
          
          <div className="flex flex-col gap-6">
            
            {/* Header row & Search Input */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex items-center gap-2.5 lg:w-[200px] flex-shrink-0 w-full">
                <div className="w-10 h-10 rounded-xl bg-red-700/10 flex items-center justify-center">
                  <SlidersHorizontal size={18} className="text-red-700" />
                </div>
                <h2 className="text-[#1a2e5a] font-bold text-lg">Filters</h2>
              </div>

              <div className="flex-1 w-full relative">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all overflow-hidden px-4 py-3.5">
                  <Search size={18} className="text-slate-400 mr-3 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search by area, title, or keyword..."
                    className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
                    value={localFilters.search}
                    onChange={e => setLocalFilters(f => ({ ...f, search: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && triggerSearch()}
                  />
                  {localFilters.search && (
                    <button onClick={clearSearch} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-200/50 hover:bg-slate-200 rounded-full p-1">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="hidden lg:flex text-[13px] font-semibold text-slate-500 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-100 whitespace-nowrap">
                  {loading ? 'Searching…' : `${total} Found`}
                </div>
                <button 
                  onClick={triggerSearch}
                  className="w-full lg:w-auto bg-[#1a2e5a] hover:bg-[#243d72] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm hover:shadow-md"
                >
                  <Search size={16} /> Search
                </button>
              </div>
            </div>

            <div className="h-px bg-slate-100 w-full hidden md:block"></div>

            {/* Bottom Row: Advanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Listing Type */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Listing Type</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all">
                  <select 
                    className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium cursor-pointer appearance-none"
                    value={localFilters.priceType}
                    onChange={e => setLocalFilters(f => ({ ...f, priceType: e.target.value, minPrice: '', maxPrice: '' }))}
                  >
                    <option value="all">All Listings</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">Property Type</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all flex items-center">
                  <Building2 size={16} className="text-slate-400 mr-2.5 shrink-0" />
                  <select 
                    className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium cursor-pointer appearance-none"
                    value={localFilters.type}
                    onChange={e => setLocalFilters(f => ({ ...f, type: e.target.value }))}
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
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 block">City</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all flex items-center">
                  <MapPin size={16} className="text-slate-400 mr-2.5 shrink-0" />
                  <select 
                    className="w-full bg-transparent outline-none text-sm text-slate-700 font-medium cursor-pointer appearance-none"
                    value={localFilters.city}
                    onChange={e => setLocalFilters(f => ({ ...f, city: e.target.value }))}
                  >
                    <option value="all">All Cities</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Price Range
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all h-[46px] flex flex-col justify-center mt-0.5">
                  <PriceRangeSlider
                    min={0}
                    max={localFilters.priceType === 'rent' ? 1000000 : 500000000}
                    step={localFilters.priceType === 'rent' ? 10000 : 1000000}
                    value={[
                      localFilters.minPrice ? Number(localFilters.minPrice) : 0,
                      localFilters.maxPrice ? Number(localFilters.maxPrice) : (localFilters.priceType === 'rent' ? 1000000 : 500000000)
                    ]}
                    onChange={(val) => {
                      const [minPrice, maxPrice] = val;
                      const maxAllowed = localFilters.priceType === 'rent' ? 1000000 : 500000000;
                      setLocalFilters(f => ({
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
        </div>

        {/* Scroll anchor */}
        <div ref={gridTopRef} style={{ scrollMarginTop: '80px' }} />

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-xl font-semibold text-slate-700">No properties found</p>
            <p className="text-sm mt-2 text-slate-500">Try a different area or adjust your filters</p>
            {appliedFilters.search && (
              <button onClick={() => {
                setLocalFilters(f => ({ ...f, search: '' }));
                setAppliedFilters(f => ({ ...f, search: '' }));
              }} className="mt-5 px-6 py-2 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 transition-colors">
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
          <p className="text-center text-xs text-slate-400 mt-4 font-medium">
            Page {page} of {totalPages} &nbsp;·&nbsp; {total} properties
          </p>
        )}

      </div>
    </div>
  );
}