import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Building2, MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Karachi Housing Schemes — Real Estate Guides | Nayab Real Marketing',
  description: 'Browse investment guides, price trends and development news for DHA Karachi, Bahria Town, Falaknaz Projects, ASF City and all major Karachi housing schemes.',
};

async function getTaxonomy() {
  try {
    const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/blogs/taxonomy`, { cache: 'no-store' });
    if (!res.ok) return { areas: [], schemes: [] };
    return res.json();
  } catch { return { areas: [], schemes: [] }; }
}

export default async function SchemesIndexPage() {
  const { areas, schemes } = await getTaxonomy();

  // Group schemes by area
  const byArea: Record<string, any[]> = {};
  schemes.forEach((s: any) => {
    const key = s.areaSlug || 'other';
    if (!byArea[key]) byArea[key] = [];
    byArea[key].push(s);
  });

  const SCHEME_COLORS = ['bg-sky-50 border-sky-200 text-sky-700', 'bg-emerald-50 border-emerald-200 text-emerald-700', 'bg-violet-50 border-violet-200 text-violet-700', 'bg-amber-50 border-amber-200 text-amber-700', 'bg-rose-50 border-rose-200 text-rose-700'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-br from-[#1a2e5a] to-[#0f1e3d] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-white">Housing Schemes</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Explore Housing Schemes</h1>
          <p className="text-slate-300 max-w-2xl">
            Investment guides, price updates and development news for Karachi's top housing societies and projects.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {schemes.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>No scheme guides published yet.</p>
            <Link href="/blog" className="text-red-600 text-sm font-semibold mt-2 inline-block hover:underline">Browse all articles →</Link>
          </div>
        ) : Object.entries(byArea).map(([areaKey, areaSchemes], aIdx) => {
          const areaInfo = areas.find((a: any) => a.slug === areaKey);
          const areaLabel = areaInfo?.label || areaKey.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
          return (
            <div key={areaKey}>
              {areaKey !== 'other' && (
                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={16} className="text-red-600" />
                  <h2 className="font-extrabold text-[#1a2e5a] text-lg">{areaLabel}</h2>
                  <Link href={`/blogs/areas/${areaKey}`} className="text-xs text-red-600 font-semibold hover:underline ml-1">View area →</Link>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {areaSchemes.map((s: any, sIdx: number) => (
                  <Link key={s.slug} href={`/blogs/schemes/${s.slug}`}
                    className="group bg-white rounded-2xl border-2 border-transparent hover:border-red-200 shadow-sm p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 shrink-0">
                        <Building2 size={18} className="text-red-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-[#1a2e5a] text-sm group-hover:text-red-700 transition-colors">{s.label}</h3>
                        <p className="text-xs text-slate-400">{s.blogCount} article{s.blogCount !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {areaKey !== 'other' && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                        <MapPin size={10} /> {areaLabel}
                      </span>
                    )}
                    <span className="text-red-600 text-xs font-semibold group-hover:underline self-start">Read guides →</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Quick area nav */}
        {areas.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-extrabold text-[#1a2e5a] mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-red-600" /> Browse by Area
            </h2>
            <div className="flex flex-wrap gap-3">
              {areas.map((a: any) => (
                <Link key={a.slug} href={`/blogs/areas/${a.slug}`}
                  className="flex items-center gap-1.5 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-xl px-4 py-2 text-sm font-semibold transition-colors border hover:border-red-200">
                  <MapPin size={13} /> {a.label}
                  <span className="text-xs text-slate-400 ml-1">({a.blogCount})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
