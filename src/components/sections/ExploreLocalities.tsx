'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import type { AreaSummary, SchemeSummary } from '@/types';

// Colour palette cycles for cards
const AREA_COLORS = [
  { bg: 'bg-sky-50',     border: 'hover:border-sky-300',     icon: 'text-sky-600',     iconBg: 'bg-sky-100'     },
  { bg: 'bg-emerald-50', border: 'hover:border-emerald-300', icon: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  { bg: 'bg-violet-50',  border: 'hover:border-violet-300',  icon: 'text-violet-600',  iconBg: 'bg-violet-100'  },
  { bg: 'bg-amber-50',   border: 'hover:border-amber-300',   icon: 'text-amber-600',   iconBg: 'bg-amber-100'   },
  { bg: 'bg-rose-50',    border: 'hover:border-rose-300',    icon: 'text-rose-600',    iconBg: 'bg-rose-100'    },
  { bg: 'bg-teal-50',    border: 'hover:border-teal-300',    icon: 'text-teal-600',    iconBg: 'bg-teal-100'    },
];

export default function ExploreLocalities() {
  const [areas,   setAreas]   = useState<AreaSummary[]>([]);
  const [schemes, setSchemes] = useState<SchemeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs/taxonomy')
      .then(r => r.json())
      .then(d => { setAreas(d.areas ?? []); setSchemes(d.schemes ?? []); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || (areas.length === 0 && schemes.length === 0)) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 space-y-12">

        {/* ── Explore Areas ── */}
        {areas.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="section-subtitle">Property Guides</p>
                <h2 className="section-title">Explore Areas</h2>
              </div>
              <Link href="/blogs/areas" className="text-sm font-semibold text-red-700 hover:underline flex items-center gap-1 hidden sm:flex">
                All Areas <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {areas.slice(0, 6).map((area, i) => {
                const c = AREA_COLORS[i % AREA_COLORS.length];
                return (
                  <Link key={area.slug} href={`/blogs/areas/${area.slug}`}
                    className={`group flex flex-col items-center text-center gap-3 p-4 rounded-2xl border-2 border-transparent ${c.border} ${c.bg} bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
                    <div className={`w-12 h-12 ${c.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <MapPin size={22} className={c.icon} />
                    </div>
                    <div>
                      <p className="font-bold text-[#1a2e5a] text-sm leading-tight">{area.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{area.blogCount} guide{area.blogCount !== 1 ? 's' : ''}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="sm:hidden mt-4 text-center">
              <Link href="/blogs/areas" className="text-sm font-semibold text-red-700 hover:underline">View all areas →</Link>
            </div>
          </div>
        )}

        {/* ── Explore Housing Schemes ── */}
        {schemes.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="section-subtitle">Investment Guides</p>
                <h2 className="section-title">Housing Schemes</h2>
              </div>
              <Link href="/blogs/schemes" className="text-sm font-semibold text-red-700 hover:underline flex items-center gap-1 hidden sm:flex">
                All Schemes <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {schemes.slice(0, 8).map((scheme, i) => {
                const c = AREA_COLORS[i % AREA_COLORS.length];
                return (
                  <Link key={scheme.slug} href={`/blogs/schemes/${scheme.slug}`}
                    className={`group flex items-center gap-3 p-4 rounded-2xl border-2 border-transparent ${c.border} bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
                    <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Building2 size={18} className={c.icon} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1a2e5a] text-sm truncate group-hover:text-red-700 transition-colors">{scheme.label}</p>
                      {scheme.areaLabel && (
                        <p className="text-xs text-slate-400 truncate flex items-center gap-0.5 mt-0.5">
                          <MapPin size={9} /> {scheme.areaLabel}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="sm:hidden mt-4 text-center">
              <Link href="/blogs/schemes" className="text-sm font-semibold text-red-700 hover:underline">View all schemes →</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
