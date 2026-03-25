"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/ui/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/Skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Property } from "@/types";
import { set } from "mongoose";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // ✅ declared first
  const [lastPage, setLastPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "all",
    priceType: "all",
    city: "all",
    search: "",
  });
  const [total, setTotal] = useState(0);

  // Reset to page 1 whenever filters change — AFTER state declarations ✅
  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams({
      status: "available",
      page: page.toString(),
      limit: "12",
    });

    if (filters.priceType !== "all") params.set("priceType", filters.priceType);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.city !== "all") params.set("city", filters.city);

    fetch(`/api/properties?${params}`)
      .then((r) => r.json())
      .then((d) => {
        console.log("Fetched properties:", d); // Debug log to inspect API response
        setTotal(d.total || 0); // Set total count for pagination 
        const data = d.properties ?? [];
        const search = filters.search.toLowerCase();
        const filtered = search
          ? data.filter(
              (p: { title: string; location: string }) =>
                p.title.toLowerCase().includes(search) ||
                p.location.toLowerCase().includes(search),
            )
          : data;
        setProperties(filtered);
        setLastPage(d.pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-[#1a2e5a] py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Browse Properties
        </h1>
        <p className="text-slate-400">
          Find your perfect property from our verified listings
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Search
            </label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Search size={16} className="text-red-600" />
              <input
                type="text"
                placeholder="Location, area, or title..."
                className="outline-none text-sm flex-1"
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Listing Type
            </label>
            <select
              className="border rounded-lg px-3 py-2 text-sm outline-none"
              onChange={(e) =>
                setFilters((f) => ({ ...f, priceType: e.target.value }))
              }
            >
              <option value="all">All</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              Property Type
            </label>
            <select
              className="border rounded-lg px-3 py-2 text-sm outline-none"
              onChange={(e) =>
                setFilters((f) => ({ ...f, type: e.target.value }))
              }
            >
              <option value="all">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="office">Office</option>
              <option value="plot">Plot</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
              City
            </label>
            <select
              className="border rounded-lg px-3 py-2 text-sm outline-none"
              onChange={(e) =>
                setFilters((f) => ({ ...f, city: e.target.value }))
              }
            >
              <option value="all">All Cities</option>
              <option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option>
              <option value="Islamabad">Islamabad</option>
            </select>
          </div>
          <div className="text-sm text-slate-500">
            <SlidersHorizontal size={16} className="inline mr-1" />
            {loading ? "Loading..." : `${total} properties found`}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-xl font-semibold">No properties found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}

        {/* Pagination ✅ inside container, proper alignment */}
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
