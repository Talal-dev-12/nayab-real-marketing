import { Metadata } from 'next';
import Link from 'next/link';


import BlogCard from '@/components/ui/BlogCard';
import PropertyCard from '@/components/ui/PropertyCard';
import { MapPin, Building2, ArrowLeft, FileText, Home, Utensils, Landmark, ShoppingBag } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import { Area } from '@/models/Area';

interface Props { params: Promise<{ area: string }> }

async function getAreaData(areaSlug: string) {
  const base = process.env.NEXTAUTH_URL;
  await connectDB();

  const areaDoc = await Area.findOne({ slug: areaSlug }).lean();

  const [blogsRes, taxRes] = await Promise.all([
    fetch(`${base}/api/blogs?published=true&area=${areaSlug}&limit=100`, { cache: 'no-store' }),
    fetch(`${base}/api/blogs/taxonomy`, { cache: 'no-store' }),
  ]);
  const blogsData = await blogsRes.json();
  const tax = await taxRes.json();
  const areaInfo = (tax.areas || []).find((a: any) => a.slug === areaSlug);
  const schemes = (tax.schemes || []).filter((s: any) => s.areaSlug === areaSlug);

  const queryLabel = areaDoc?.name || areaInfo?.label || areaSlug.replace(/-/g, ' ');
  const propsRes = await fetch(`${base}/api/properties?search=${encodeURIComponent(queryLabel)}&limit=12`, { cache: 'no-store' });
  const propsData = await propsRes.json();

  return { blogs: blogsData.blogs ?? [], areaInfo, schemes, areaDoc, properties: propsData.properties ?? [] };
}

async function getGeoPlaces(label: string) {
  try {
    const geoApiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    if (!geoApiKey) {
      console.warn('GEOAPIFY_API_KEY not set in environment variables');
      return null;
    }
    
    const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(label + ', Karachi')}&apiKey=${geoApiKey}`;
    const geoRes = await fetch(geoUrl, { next: { revalidate: 86400 } });
    if (!geoRes.ok) return null;
    const geoData = await geoRes.json();
    
    if (!geoData.features?.length) return null;
    
    const { lon, lat } = geoData.features[0].properties;
    
    const [restRes, tourRes, markRes] = await Promise.all([
      fetch(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${lon},${lat},3000&limit=5&apiKey=${geoApiKey}`, { next: { revalidate: 86400 } }),
      fetch(`https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${lon},${lat},3000&limit=5&apiKey=${geoApiKey}`, { next: { revalidate: 86400 } }),
      fetch(`https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=circle:${lon},${lat},3000&limit=5&apiKey=${geoApiKey}`, { next: { revalidate: 86400 } })
    ]);
    
    const [restaurants, tourism, markets] = await Promise.all([
      restRes.json(), tourRes.json(), markRes.json()
    ]);
    
    return {
      restaurants: restaurants.features?.map((f: any) => f.properties.name).filter(Boolean) || [],
      popularPlaces: tourism.features?.map((f: any) => f.properties.name).filter(Boolean) || [],
      markets: markets.features?.map((f: any) => f.properties.name).filter(Boolean) || []
    };
  } catch (error) {
    console.error('Geoapify error:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  if (area === 'null' || area === 'undefined') {
    return { title: 'Invalid Area | Nayab Real Marketing' };
  }
  const { areaDoc, areaInfo } = await getAreaData(area);
  const label = areaInfo?.label || area.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    title: `${label} Properties & Real Estate Guide | Nayab Real Marketing`,
    description: areaDoc?.description ? areaDoc.description.slice(0, 160) : `Explore properties for sale and rent in ${label}, Karachi. Read our latest real estate investment guides and updates for ${label}.`,
    openGraph: {
      title: `${label} Properties & Area Guide — Nayab Real Marketing`,
      description: areaDoc?.description ? areaDoc.description.slice(0, 160) : `Explore properties and investment updates for ${label}, Karachi.`,
      images: areaDoc?.image ? [{ url: areaDoc.image, width: 800, height: 600, alt: label }] : undefined,
    },
  };
}

export default async function AreaPage({ params }: Props) {
  const { area } = await params;

  // Guard: if slug is literally "null" or "undefined", show a friendly error
  if (area === 'null' || area === 'undefined') {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <MapPin size={48} className="mx-auto mb-4 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-600 mb-2">Invalid Area Page</h1>
          <p className="text-slate-400 mb-6">This blog has no area assigned. Please edit it in the admin panel.</p>
          <Link href="/blogs/areas" className="text-red-600 font-semibold hover:underline">← Browse all areas</Link>
        </div>

      </div>
    );
  }

  const { blogs, areaInfo, schemes, areaDoc, properties } = await getAreaData(area);
  const label = areaDoc?.name || areaInfo?.label || area.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

  const geoPlaces = await getGeoPlaces(label);

  const displayRestaurants = areaDoc?.restaurants?.length > 0 ? areaDoc.restaurants : (geoPlaces?.restaurants || []);
  const displayPopularPlaces = areaDoc?.popularPlaces?.length > 0 ? areaDoc.popularPlaces : (geoPlaces?.popularPlaces || []);
  const displayMarkets = areaDoc?.markets?.length > 0 ? areaDoc.markets : (geoPlaces?.markets || []);

  const hasPlaces = displayRestaurants.length > 0 || displayPopularPlaces.length > 0 || displayMarkets.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Hero */}
      <div className="primary-gradient py-16">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <Link href="/blogs/areas" className="hover:text-white">Areas</Link>
            <span>/</span>
            <span className="text-white">{label}</span>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-600/20 border border-red-500/30 rounded-xl flex items-center justify-center">
              <MapPin size={22} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">{label}</h1>
              <p className="text-slate-400 text-sm">{blogs.length} article{blogs.length !== 1 ? 's' : ''} · Karachi</p>
            </div>
          </div>
          <p className="text-slate-300 max-w-2xl mt-2">
            Property investment guides, market insights and development news for {label}, Karachi.
          </p>

          {areaDoc?.description && (
            <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm max-w-4xl">
              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{areaDoc.description}</p>
            </div>
          )}

          {/* Scheme pills */}
          {schemes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {schemes.map((s: any) => (
                <Link key={s.slug} href={`/blogs/schemes/${s.slug}`}
                  className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 transition-colors">
                  <Building2 size={11} /> {s.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Notable Places Section */}
        {hasPlaces && (
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayRestaurants.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-4 flex items-center gap-2">
                  <Utensils size={18} className="text-red-600" /> Famous Restaurants
                </h3>
                <ul className="space-y-2">
                  {displayRestaurants.map((item: string, idx: number) => (
                    <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {displayPopularPlaces.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-4 flex items-center gap-2">
                  <Landmark size={18} className="text-red-600" /> Popular Places
                </h3>
                <ul className="space-y-2">
                  {displayPopularPlaces.map((item: string, idx: number) => (
                    <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {displayMarkets.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-4 flex items-center gap-2">
                  <ShoppingBag size={18} className="text-red-600" /> Well-known Markets
                </h3>
                <ul className="space-y-2">
                  {displayMarkets.map((item: string, idx: number) => (
                    <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Schemes section */}
        {schemes.length > 0 && (
          <div className="mb-10">
            <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-red-600" /> Housing Schemes in {label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {schemes.map((s: any) => (
                <Link key={s.slug} href={`/blogs/schemes/${s.slug}`}
                  className="group bg-white rounded-xl border-2 border-transparent hover:border-red-200 shadow-sm p-4 flex items-center gap-3 transition-all hover:shadow-md">
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 shrink-0">
                    <Building2 size={16} className="text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#1a2e5a] text-sm truncate group-hover:text-red-700">{s.label}</p>
                    <p className="text-xs text-slate-400">{s.blogCount} article{s.blogCount !== 1 ? 's' : ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Articles */}
        <div>
          <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-5 flex items-center gap-2">
            <FileText size={18} className="text-red-600" /> All Articles for {label}
          </h2>
          {blogs.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p>No articles published for this area yet.</p>
              <Link href="/blog" className="text-red-600 text-sm font-semibold mt-2 inline-block hover:underline">Browse all articles →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b: any) => <BlogCard key={b._id} blog={b} />)}
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-10">
          <Link href="/blogs/areas" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 font-semibold">
            <ArrowLeft size={15} /> All Areas
          </Link>
        </div>

        {/* Properties Section */}
        <div className="mt-16">
          <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-5 flex items-center gap-2">
            <Home size={18} className="text-red-600" /> Properties in {label}
          </h2>
          {properties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Home size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 font-medium">No properties listed for {label} currently.</p>
              <Link href="/properties" className="text-red-600 text-sm font-semibold mt-2 inline-block hover:underline">
                Browse all properties →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((p: any) => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-5 flex items-center gap-2">
            <MapPin size={18} className="text-red-600" /> Location Map
          </h2>
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(label + ', Karachi')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}