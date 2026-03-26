import { Metadata } from 'next';
import Link from 'next/link';
   
  
import BlogCard from '@/components/ui/BlogCard';
import { Building2, MapPin, ArrowLeft, FileText } from 'lucide-react';

interface Props { params: Promise<{ scheme: string }> }

async function getSchemeData(schemeSlug: string) {
  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const [blogsRes, taxRes] = await Promise.all([
    fetch(`${base}/api/blogs?published=true&scheme=${schemeSlug}&limit=100`, { cache: 'no-store' }),
    fetch(`${base}/api/blogs/taxonomy`, { cache: 'no-store' }),
  ]);
  const blogsData = await blogsRes.json();
  const tax = await taxRes.json();
  const schemeInfo = (tax.schemes || []).find((s: any) => s.slug === schemeSlug);
  return { blogs: blogsData.blogs ?? [], schemeInfo };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scheme } = await params;
  const { schemeInfo } = await getSchemeData(scheme);
  const label = schemeInfo?.label || scheme.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    title: `${label} Real Estate Guide | Nayab Real Marketing`,
    description: `Investment insights, property updates and development news for ${label}. Expert guides from Nayab Real Marketing.`,
    openGraph: {
      title: `${label} — Real Estate Guide | Nayab Real Marketing`,
      description: `Browse all property articles and investment guides for ${label}.`,
    },
  };
}

export default async function SchemePage({ params }: Props) {
  const { scheme } = await params;
  const { blogs, schemeInfo } = await getSchemeData(scheme);
  const label = schemeInfo?.label || scheme.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  const areaLabel = schemeInfo?.areaLabel;
  const areaSlug  = schemeInfo?.areaSlug;

  return (
    <div className="min-h-screen bg-gray-50">
      

      <div className="primary-gradient py-16">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <Link href="/blogs/schemes" className="hover:text-white">Schemes</Link>
            {areaSlug && <><span>/</span><Link href={`/blogs/areas/${areaSlug}`} className="hover:text-white">{areaLabel}</Link></>}
            <span>/</span>
            <span className="text-white">{label}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center">
              <Building2 size={22} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">{label}</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-slate-400 text-sm">{blogs.length} article{blogs.length !== 1 ? 's' : ''}</p>
                {areaLabel && (
                  <Link href={`/blogs/areas/${areaSlug}`}
                    className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 transition-colors">
                    <MapPin size={10} /> {areaLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
          <p className="text-slate-300 max-w-2xl mt-2">
            Investment insights, property price trends and development updates for {label}
            {areaLabel ? `, ${areaLabel}, Karachi` : ', Karachi'}.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-extrabold text-[#1a2e5a] text-xl flex items-center gap-2">
            <FileText size={18} className="text-red-600" /> All {label} Articles
          </h2>
          <Link href="/blogs/schemes" className="text-sm text-slate-500 hover:text-red-600 font-semibold flex items-center gap-1">
            <ArrowLeft size={14} /> All Schemes
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>No articles published for this scheme yet.</p>
            <Link href="/blog" className="text-red-600 text-sm font-semibold mt-2 inline-block hover:underline">Browse all articles →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b: any) => <BlogCard key={b._id} blog={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
