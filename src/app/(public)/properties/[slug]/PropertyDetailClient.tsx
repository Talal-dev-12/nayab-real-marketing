'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PropertyDetailSkeleton } from '@/components/ui/Skeleton';
import {
  ArrowLeft, MapPin, Bed, Bath, Maximize2, Tag, Heart, Share2,
  Eye, ChevronLeft, ChevronRight, CheckCircle2, Phone, Mail,
  ChevronRight as ChevronRightIcon, Building2, TrendingUp, ShieldCheck, Users,
  LogIn, Send, AlertCircle,
} from 'lucide-react';
import type { Property } from '@/types';
import { savedApi, inquiriesApi } from '@/lib/api-client';

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'nayabrealmarketing.official@gmail.com';

interface AuthUser { id: string; name: string; email: string; role: string; }

function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    if (raw) try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    setChecked(true);
  }, []);
  return { user, checked };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, checked } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  // Save state
  const [saved, setSaved] = useState(false);
  const [savingProp, setSavingProp] = useState(false);

  // Inquiry form
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    fetch(`/api/properties?slug=${params.slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setLoading(false); return; }
        setProperty(data);
        fetch(`/api/properties?type=${data.type}&status=available&limit=4`)
          .then(r => r.json()).then(d => {
            setRelated((d.properties ?? []).filter((p: Property) => p._id !== data._id).slice(0, 3));
          }).catch(() => { });
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [params.slug]);

  // Check if this property is already saved
  useEffect(() => {
    if (!user || !property) return;
    savedApi.list().then(res => {
      const ids = ((res as any).savedProperties ?? []).map((p: any) => p._id ?? p);
      setSaved(ids.includes((property as any)._id));
    }).catch(() => { });
  }, [user, property]);

  // Pre-fill message
  useEffect(() => {
    if (property && !message) {
      setMessage(`I'm interested in "${property.title}". Please contact me with more details.`);
    }
  }, [property]);

  const handleSave = async () => {
    if (!user) { router.push(`/sign-in?redirect=/properties/${params.slug}`); return; }
    setSavingProp(true);
    try {
      const res = await savedApi.toggle((property as any)._id);
      setSaved((res as any).saved);
    } catch { /* silent */ } finally { setSavingProp(false); }
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push(`/sign-in?redirect=/properties/${params.slug}`); return; }
    if (!message.trim()) { setInquiryError('Please enter a message.'); return; }
    setSending(true); setInquiryError('');
    try {
      await inquiriesApi.send({
        propertyId: (property as any)._id,
        message: message.trim(),
        phone: phone.trim(),
      });
      setSent(true);
    } catch (err: any) {
      setInquiryError(err.message || 'Failed to send inquiry. Please try again.');
    } finally { setSending(false); }
  };

  const formatPrice = (price: number, type: string, period?: string) => {
    const f = price >= 10000000
      ? `${(price / 10000000).toFixed(1)} Crore`
      : price >= 100000
        ? `${(price / 100000).toFixed(0)} Lac`
        : price.toLocaleString();
    return `PKR ${f}${type === 'rent' ? `/${period || 'month'}` : ''}`;
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><PropertyDetailSkeleton /></div>;

  if (!property) return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="text-8xl mb-6">🏠</div>
        <h1 className="text-3xl font-extrabold text-[#1a2e5a] mb-3">Property Not Found</h1>
        <Link href="/properties" className="inline-flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600">
          <ArrowLeft size={18} /> Browse Properties
        </Link>
      </div>
    </div>
  );

  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'];
  const amenities = property.amenities?.length ? property.amenities : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-red-700">Home</Link><ChevronRightIcon size={14} />
          <Link href="/properties" className="hover:text-red-700">Properties</Link><ChevronRightIcon size={14} />
          <span className="text-[#1a2e5a] font-medium line-clamp-1">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title + Price */}
        <div className="flex flex-wrap gap-4 items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${property.priceType === 'sale' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                For {property.priceType === 'sale' ? 'Sale' : 'Rent'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${property.status === 'available' ? 'bg-emerald-100 text-emerald-700' : property.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                {property.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2e5a]">{property.title}</h1>
            <div className="flex items-center gap-2 text-slate-500 mt-2">
              <MapPin size={16} className="text-red-700" />
              <span>{property.areaScheme ? `${property.areaScheme}, ` : ''}{property.location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-red-700">{formatPrice(property.price, property.priceType, property.rentPeriod)}</p>
            <div className="flex items-center gap-2 mt-2 justify-end text-slate-400 text-sm"><Eye size={14} /> {property.views} views</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Images + Details ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-[350px] md:h-[480px] group">
                <img src={images[currentImage]} alt={property.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  {/* Save / Heart button */}
                  <button
                    onClick={handleSave}
                    disabled={savingProp}
                    title={user ? (saved ? 'Remove from saved' : 'Save property') : 'Sign in to save'}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-60 ${saved ? 'bg-red-600 text-white' : 'bg-white text-slate-600 hover:bg-red-50'}`}>
                    <Heart size={18} fill={saved ? 'white' : 'none'} />
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-600 hover:bg-slate-50">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)}
                      className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? 'border-red-700' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-5 pb-3 border-b">Property Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Maximize2, label: 'Area', value: `${property.area?.toLocaleString()} sqft`, color: 'bg-blue-50 text-blue-700' },
                  ...(property.bedrooms > 0 ? [{ icon: Bed, label: 'Bedrooms', value: String(property.bedrooms), color: 'bg-amber-50 text-amber-700' }] : []),
                  ...(property.bathrooms > 0 ? [{ icon: Bath, label: 'Bathrooms', value: String(property.bathrooms), color: 'bg-emerald-50 text-emerald-700' }] : []),
                  { icon: Tag, label: 'Type', value: property.type.charAt(0).toUpperCase() + property.type.slice(1), color: 'bg-purple-50 text-purple-700' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl text-center">
                    <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center mb-2`}><Icon size={20} /></div>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
                    <span className="font-extrabold text-[#1a2e5a] text-lg">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-4 pb-3 border-b">Description</h2>
              <p className="text-slate-600 leading-relaxed">{property.description || 'No description available.'}</p>
            </div>

            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-5 pb-3 border-b">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />{a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-red-700 rounded-xl flex items-center justify-center shrink-0"><Building2 size={20} className="text-white" /></div>
                <div>
                  <h2 className="font-extrabold text-[#1a2e5a] text-xl leading-tight">Nayab Real Marketing</h2>
                  <p className="text-red-700 text-sm font-semibold">Pakistan's Trusted Real Estate Experts Since 2010</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Nayab Real Marketing is one of Karachi's most respected real estate agencies, serving buyers, sellers, investors, and renters across Pakistan since 2010. With over 2,500 verified listings and a team of dedicated property consultants, we specialize in residential, commercial, and investment properties across Karachi, Lahore, and Islamabad.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: ShieldCheck, title: '100% Verified Listings', desc: 'Every property is personally verified for legal clarity.' },
                  { icon: TrendingUp, title: 'Best Market Valuations', desc: 'Data-driven pricing for maximum value.' },
                  { icon: Users, title: '14+ Years Experience', desc: 'Trusted by 1,200+ clients across Pakistan.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-gray-50 rounded-xl p-4">
                    <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center mb-3"><Icon size={18} className="text-red-700" /></div>
                    <h4 className="font-bold text-[#1a2e5a] text-sm mb-1">{title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+923212869000"
                  className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                  <Phone size={15} /> +92-321-2869000
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                  <Mail size={15} /> {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* ── Right sidebar: Inquiry form ── */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-1">Send Inquiry</h3>
              <p className="text-slate-500 text-sm mb-5">Our team will respond within 24 hours.</p>

              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-[#1a2e5a] text-lg">Inquiry Sent!</p>
                  <p className="text-slate-500 text-sm mt-1">We'll contact you shortly about this property.</p>
                  <Link href="/profile"
                    className="mt-4 inline-block text-sm text-red-700 font-semibold hover:underline">
                    View my inquiries →
                  </Link>
                </div>
              ) : !checked ? null : !user ? (
                /* Guest: prompt to log in */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <LogIn size={28} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a2e5a]">Sign in to send an inquiry</p>
                    <p className="text-slate-500 text-sm mt-1">Your details will be filled automatically.</p>
                  </div>
                  <Link
                    href={`/sign-in?redirect=/properties/${params.slug}`}
                    className="block w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm transition-colors text-center">
                    Sign In to Inquire
                  </Link>
                  <Link href="/sign-up" className="block text-center text-sm text-slate-500 hover:text-red-700">
                    Don't have an account? <span className="font-semibold text-red-700">Create one</span>
                  </Link>
                </div>
              ) : (
                /* Logged-in: full form with pre-filled email */
                <form onSubmit={handleInquiry} className="space-y-3">
                  {/* Pre-filled user info */}
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1a2e5a] truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Phone (optional)</label>
                    <input type="tel" placeholder="+92-300-0000000"
                      value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 transition-colors" />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Message *</label>
                    <textarea rows={4}
                      value={message} onChange={e => setMessage(e.target.value)}
                      required
                      className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none transition-colors" />
                  </div>

                  {inquiryError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <AlertCircle size={14} className="shrink-0" />
                      {inquiryError}
                    </div>
                  )}

                  <button type="submit" disabled={sending}
                    className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    <Send size={15} />
                    {sending ? 'Sending…' : 'Send Inquiry'}
                  </button>
                  <p className="text-center text-xs text-slate-400">We never share your contact information.</p>
                </form>
              )}

              {/* Quick contact */}
              <div className="mt-5 pt-5 border-t space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Or contact us directly</p>
                <a href="tel:+923212869000"
                  className="flex items-center gap-3 w-full bg-slate-50 hover:bg-red-50 border hover:border-red-200 text-slate-700 px-4 py-3 rounded-xl font-semibold text-sm transition-colors">
                  <Phone size={15} className="text-red-700" /> +92-321-2869000
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 w-full bg-slate-50 hover:bg-red-50 border hover:border-red-200 text-slate-700 px-4 py-3 rounded-xl font-semibold text-sm transition-colors">
                  <Mail size={15} className="text-red-700" /> Email Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-extrabold text-[#1a2e5a] mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(p => (
                <Link key={p._id} href={`/properties/${p.slug}`}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all group">
                  <div className="h-44 overflow-hidden">
                    <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1a2e5a] line-clamp-1 group-hover:text-red-700 transition-colors">{p.title}</h3>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-1"><MapPin size={12} /> {p.location}</p>
                    <p className="text-red-700 font-extrabold mt-2">{formatPrice(p.price, p.priceType, p.rentPeriod)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
