"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/ui/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/Skeleton";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import type { Property } from "@/types";

const POPULAR_AREAS = [
  "Clifton",
  "DHA",
  "Gulshan",
  "Johar",
  "Bahria Town",
  "PECHS",
  "North Nazimabad",
  "Gulberg",
  "F-7 Islamabad",
  "Blue Area",
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [lastPage,   setLastPage]   = useState(1);
  const [total,      setTotal]      = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    type:      "all",
    priceType: "all",
    city:      "all",
    search:    "",           // ← only updates on button click / suggestion pick
  });

  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Fetch from API
  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams({
      status: "available",
      page:   page.toString(),
      limit:  "12",
    });

    if (filters.priceType !== "all") params.set("priceType", filters.priceType);
    if (filters.type      !== "all") params.set("type",      filters.type);
    if (filters.city      !== "all") params.set("city",      filters.city);
    if (filters.search)              params.set("search",    filters.search); // ✅ server-side search

    fetch(`/api/properties?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProperties(d.properties ?? []);
        setLastPage(d.pages || 1);
        setTotal(d.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, page]);

  // Trigger search
  const handleSearch = () => {
    setShowSuggestions(false);
    setFilters((f) => ({ ...f, search: searchInput.trim() }));
  };

  // Pick a suggestion
  const handleSuggestion = (area: string) => {
    setSearchInput(area);
    setShowSuggestions(false);
    setFilters((f) => ({ ...f, search: area }));
  };

  // Clear search
  const handleClear = () => {
    setSearchInput("");
    setFilters((f) => ({ ...f, search: "" }));
  };

  // Filtered suggestions based on what's typed
  const suggestions = searchInput.trim()
    ? POPULAR_AREAS.filter((a) =>
        a.toLowerCase().includes(searchInput.toLowerCase())
      )
    : POPULAR_AREAS;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-[#1a2e5a] py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Browse Properties</h1>
        <p className="text-slate-400">Find your perfect property from our verified listings</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-4 items-end">

          {/* Search with suggestions */}
          <div className="flex-1 min-w-[260px]" ref={searchRef}>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Search
            </label>
            <div className="relative">
              {/* Input row */}
              <div className="flex items-center border-2 border-slate-200 focus-within:border-red-500 rounded-lg overflow-hidden transition-colors">
                <Search size={16} className="text-red-600 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by area, title or location..."
                  className="outline-none text-sm flex-1 px-2 py-2.5"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                {/* Clear button */}
                {searchInput && (
                  <button
                    onClick={handleClear}
                    className="text-slate-400 hover:text-slate-600 px-2 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
                {/* Search button */}
                <button
                  onClick={handleSearch}
                  className="bg-red-700 hover:bg-red-600 text-white px-4 py-2.5 text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Search size={14} />
                  Search
                </button>
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <p className="text-xs font-semibold text-slate-400 uppercase px-4 pt-3 pb-1">
                    Popular Areas
                  </p>
                  {suggestions.map((area) => (
                    <button
                      key={area}
                      onClick={() => handleSuggestion(area)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
                    >
                      <MapPin size={14} className="text-red-400 flex-shrink-0" />
                      {area}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Active search tag */}
            {filters.search && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-500">Showing results for:</span>
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <MapPin size={10} />
                  {filters.search}
                  <button onClick={handleClear} className="ml-1 hover:text-red-900">
                    <X size={10} />
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Listing Type */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Listing Type
            </label>
            <select
              className="border rounded-lg px-3 py-2.5 text-sm outline-none"
              onChange={(e) => setFilters((f) => ({ ...f, priceType: e.target.value }))}
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
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
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
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              City
            </label>
            <select
              className="border rounded-lg px-3 py-2.5 text-sm outline-none"
              onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
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
            {loading ? "Loading..." : `${total} properties found`}
          </div>
        </div>

        {/* Grid */}
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
              <button
                onClick={handleClear}
                className="mt-4 text-sm text-red-700 font-semibold hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && lastPage > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {Array.from({ length: lastPage }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                  page === num
                    ? "bg-red-700 text-white"
                    : "border text-slate-600 hover:bg-slate-100"
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page === lastPage}
              className="px-4 py-2 rounded-lg border text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}