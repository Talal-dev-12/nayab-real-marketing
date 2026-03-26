'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

import BlogCard from '@/components/ui/BlogCard';
import { Search, MapPin, Building2, X, ChevronDown } from 'lucide-react';
import type { Blog, AreaSummary, SchemeSummary } from '@/types';
import { BlogCardSkeleton, SidebarSkeleton } from '@/components/ui/Skeleton';

export default function BlogPage() {
  const [blogs,    setBlogs]    = useState<Blog[]>([]);
  const [areas,    setAreas]    = useState<AreaSummary[]>([]);
  const [schemes,  setSchemes]  = useState<SchemeSummary[]>([]);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [areaF,    setAreaF]    = useState('all');
  const [schemeF,  setSchemeF]  = useState('all');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/blogs?published=true&limit=200').then(r => r.json()),
      fetch('/api/blogs/taxonomy').then(r => r.json()),
    ]).then(([blogData, tax]) => {
      setBlogs(blogData.blogs ?? []);
      setAreas(tax.areas ?? []);
      setSchemes(tax.schemes ?? []);
    }).finally(() => setLoading(false));
  }, []);

  // Reset scheme filter when area changes
  useEffect(() => { setSchemeF('all'); }, [areaF]);

  const visibleSchemes = useMemo(() =>
    areaF === 'all' ? schemes : schemes.filter(s => s.areaSlug === areaF),
    [schemes, areaF]
  );

  const filtered = useMemo(() => {
    return blogs.filter(b => {
      if (category !== 'all' && b.category !== category) return false;
      if (areaF   !== 'all' && b.areaSlug   !== areaF)   return false;
      if (schemeF !== 'all' && b.schemeSlug !== schemeF)  return false;
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()) &&
          !b.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [blogs, category, areaF, schemeF, search]);

  const categories = ['all', ...Array.from(new Set(blogs.map(b => b.category)))];
  const hasFilters = category !== 'all' || areaF !== 'all' || schemeF !== 'all' || search;

  const clearFilters = () => { setCategory('all'); setAreaF('all'); setSchemeF('all'); setSearch(''); };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="primary-gradient py-16 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Blog & Property Guides</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Real estate insights, investment tips, and area guides for Karachi's top localities
        </p>
        {/* Area breadcrumb pills */}
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

          {/* ── Sidebar filters ── */}
          <aside className="lg:w-64 shrink-0 space-y-4">

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text" value={search} placeholder="Search articles..."
                  onChange={e => setSearch(e.target.value)}
                  className="outline-none text-sm flex-1"
                />
                {search && <button onClick={() => setSearch('')}><X size={13} className="text-slate-400" /></button>}
              </div>
            </div>

            {/* Category filter */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Category</p>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat ? 'bg-red-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Area filter */}
            {areas.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1.5">
                  <MapPin size={12} className="text-red-600" /> Filter by Area
                </p>
                <div className="space-y-1">
                  <button onClick={() => setAreaF('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${areaF === 'all' ? 'bg-red-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                    All Areas
                  </button>
                  {areas.map(a => (
                    <button key={a.slug} onClick={() => setAreaF(a.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${areaF === a.slug ? 'bg-red-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <span>{a.label}</span>
                      <span className={`text-xs rounded-full px-1.5 py-0.5 ${areaF === a.slug ? 'bg-red-600 text-red-100' : 'bg-slate-100 text-slate-500'}`}>{a.blogCount}</span>
                    </button>
                  ))}
                </div>
                {areas.length > 0 && (
                  <Link href="/blogs/areas" className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-3 hover:underline">
                    View all areas →
                  </Link>
                )}
              </div>
            )}

            {/* Scheme filter */}
            {visibleSchemes.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1.5">
                  <Building2 size={12} className="text-red-600" /> Housing Scheme
                </p>
                <div className="space-y-1">
                  <button onClick={() => setSchemeF('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${schemeF === 'all' ? 'bg-red-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                    All Schemes
                  </button>
                  {visibleSchemes.map(s => (
                    <button key={s.slug} onClick={() => setSchemeF(s.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${schemeF === s.slug ? 'bg-red-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <span>{s.label}</span>
                      <span className={`text-xs rounded-full px-1.5 py-0.5 ${schemeF === s.slug ? 'bg-red-600 text-red-100' : 'bg-slate-100 text-slate-500'}`}>{s.blogCount}</span>
                    </button>
                  ))}
                </div>
                {schemes.length > 0 && (
                  <Link href="/blogs/schemes" className="flex items-center gap-1 text-xs text-red-600 font-semibold mt-3 hover:underline">
                    View all schemes →
                  </Link>
                )}
              </div>
            )}

            {/* Clear filters */}
            {hasFilters && (
              <button onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl transition-colors">
                <X size={14} /> Clear Filters
              </button>
            )}
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            {/* Active filter tags */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {category !== 'all' && (
                  <span className="flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">
                    Category: {category} <button onClick={() => setCategory('all')}><X size={10} /></button>
                  </span>
                )}
                {areaF !== 'all' && (
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                    <MapPin size={10} /> {areas.find(a => a.slug === areaF)?.label} <button onClick={() => setAreaF('all')}><X size={10} /></button>
                  </span>
                )}
                {schemeF !== 'all' && (
                  <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
                    <Building2 size={10} /> {schemes.find(s => s.slug === schemeF)?.label} <button onClick={() => setSchemeF('all')}><X size={10} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Result count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                {loading ? <span className="h-4 w-24 bg-slate-200 rounded animate-pulse inline-block" /> : `${filtered.length} article${filtered.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <BlogCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-lg font-semibold mb-2">No articles found</p>
                <p className="text-sm">Try adjusting your filters or search query</p>
                {hasFilters && <button onClick={clearFilters} className="mt-4 text-red-600 font-semibold text-sm hover:underline">Clear all filters</button>}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(b => <BlogCard key={b._id} blog={b} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}