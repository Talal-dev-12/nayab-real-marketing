'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/ui/PropertyCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Property } from '@/types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({ type: 'all', priceType: 'all', city: 'all', search: '' });

  useEffect(() => {
    const params = new URLSearchParams({ status: 'available', limit: '100' });
    if (filters.priceType !== 'all') params.set('priceType', filters.priceType);
    if (filters.type !== 'all') params.set('type', filters.type);
    if (filters.city !== 'all') params.set('city', filters.city);
    fetch(`/api/properties?${params}`)
      .then(r => r.json()).then(d => {
        const data = d.properties ?? [];
        const search = filters.search.toLowerCase();
        setProperties(search ? data.filter((p: Property) =>
          p.title.toLowerCase().includes(search) || p.location.toLowerCase().includes(search)
        ) : data);
      }).catch(() => {});
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-[#1a2e5a] py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Browse Properties</h1>
        <p className="text-slate-400">Find your perfect property from our verified listings</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Search</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Search size={16} className="text-red-600" />
              <input type="text" placeholder="Location, area, or title..." className="outline-none text-sm flex-1"
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Listing Type</label>
            <select className="border rounded-lg px-3 py-2 text-sm outline-none" onChange={e => setFilters(f => ({ ...f, priceType: e.target.value }))}>
              <option value="all">All</option><option value="sale">For Sale</option><option value="rent">For Rent</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Property Type</label>
            <select className="border rounded-lg px-3 py-2 text-sm outline-none" onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
              <option value="all">All Types</option><option value="residential">Residential</option>
              <option value="commercial">Commercial</option><option value="office">Office</option><option value="plot">Plot</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">City</label>
            <select className="border rounded-lg px-3 py-2 text-sm outline-none" onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}>
              <option value="all">All Cities</option><option value="Karachi">Karachi</option>
              <option value="Lahore">Lahore</option><option value="Islamabad">Islamabad</option>
            </select>
          </div>
          <div className="text-sm text-slate-500"><SlidersHorizontal size={16} className="inline mr-1" />{properties.length} properties found</div>
        </div>
        {properties.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Search size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-xl font-semibold">No properties found</p>
            <p className="text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}