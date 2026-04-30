import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, FileText, Building2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Karachi Property Areas — Real Estate Guides | Nayab Real Marketing',
  description: 'Browse property investment guides, market insights and development news for all major areas of Karachi — Scheme 33, Gulshan-e-Iqbal, Clifton, Malir and more.',
};

async function getAreas() {
  try {
    const base = process.env.NEXTAUTH_URL;
    const res = await fetch(`${base}/api/blogs/taxonomy`, { cache: 'no-store' });
    if (!res.ok) return { areas: [], schemes: [] };
    return res.json();
  } catch { return { areas: [], schemes: [] }; }
}

export default async function AreasIndexPage() {
  const { areas, schemes } = await getAreas();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="primary-gradient py-16">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-white">Areas</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Explore Property Areas</h1>
          <p className="text-slate-300 max-w-2xl">
            Property investment guides, market trends and development news organised by Karachi's major localities.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">

        {areas.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <MapPin size={40} className="mx-auto mb-3 opacity-30" />
            <p>No area guides published yet.</p>
            <Link href="/blog" className="text-red-600 text-sm font-semibold mt-2 inline-block hover:underline">Browse all articles →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {areas.map((area: any) => {
              const areaSchemes = schemes.filter((s: any) => s.areaSlug === area.slug);
              return (
                <Link key={area.slug} href={`/blogs/areas/${area.slug}`}
                  className="group bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-red-200 hover:shadow-md p-6 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <MapPin size={18} className="text-red-600" />
                      </div>
                      <div>
                        <h2 className="font-extrabold text-[#1a2e5a] text-lg group-hover:text-red-700 transition-colors">{area.label}</h2>
                        <p className="text-xs text-slate-400">{area.blogCount} article{area.blogCount !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all mt-1" />
                  </div>

                  {areaSchemes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {areaSchemes.slice(0, 4).map((s: any) => (
                        <span key={s.slug} className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full border">
                          <Building2 size={10} /> {s.label}
                        </span>
                      ))}
                      {areaSchemes.length > 4 && (
                        <span className="text-xs text-slate-400 self-center">+{areaSchemes.length - 4} more</span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Schemes quick-nav */}
        {schemes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-extrabold text-[#1a2e5a] mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-red-600" /> All Housing Schemes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {schemes.map((s: any) => (
                <Link key={s.slug} href={`/blogs/schemes/${s.slug}`}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-red-700 transition-colors group">
                  <Building2 size={13} className="text-slate-400 group-hover:text-red-500 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
