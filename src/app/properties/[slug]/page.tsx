'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ArrowLeft, MapPin, Bed, Bath, Maximize2, Tag, Phone, Mail,
  Heart, Share2, Eye, Calendar, ChevronLeft, ChevronRight, CheckCircle2, ChevronRightIcon
} from 'lucide-react';
import { defaultProperties, defaultAgents, getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/data';
import type { Property, Agent } from '@/types';

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const allProps = getFromStorage<Property[]>(STORAGE_KEYS.PROPERTIES, defaultProperties);
    const found = allProps.find((p: Property) => p.slug === params.slug);
    if (!found) { setLoading(false); return; }
    const updated = allProps.map((p: Property) => p.id === found.id ? { ...p, views: (p.views || 0) + 1 } : p);
    saveToStorage(STORAGE_KEYS.PROPERTIES, updated);
    setProperty({ ...found, views: (found.views || 0) + 1 });
    const agents = getFromStorage<Agent[]>(STORAGE_KEYS.AGENTS, defaultAgents);
    setAgent(agents.find((a: Agent) => a.id === found.agentId) || null);
    setRelated(allProps.filter((p: Property) => p.id !== found.id && p.type === found.type).slice(0, 3));
    setLoading(false);
  }, [params.slug]);

  const formatPrice = (price: number, type: string, period?: string) => {
    const formatted = price >= 10000000
      ? `${(price / 10000000).toFixed(1)} Crore`
      : price >= 100000
      ? `${(price / 100000).toFixed(0)} Lac`
      : price.toLocaleString();
    return `PKR ${formatted}${type === 'rent' ? `/${period || 'month'}` : ''}`;
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!property) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="text-8xl mb-6">🏠</div>
        <h1 className="text-3xl font-extrabold text-[#1a2e5a] mb-3">Property Not Found</h1>
        <p className="text-slate-500 mb-8">This property is no longer available or has been removed.</p>
        <Link href="/properties" className="inline-flex items-center gap-2 bg-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600">
          <ArrowLeft size={18} /> Browse Properties
        </Link>
      </div>
      <Footer />
    </div>
  );

  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'];

  const amenities = [
    'Electricity Backup', 'Sui Gas', 'Boundary Wall', 'CCTV Security',
    'Near Market', 'Near Mosque', 'Good Ventilation', 'Peaceful Environment',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-red-700">Home</Link>
          <ChevronRightIcon size={14} />
          <Link href="/properties" className="hover:text-red-700">Properties</Link>
          <ChevronRightIcon size={14} />
          <span className="text-[#1a2e5a] font-medium line-clamp-1">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap gap-4 items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                property.priceType === 'sale' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                For {property.priceType === 'sale' ? 'Sale' : 'Rent'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                property.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                property.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>{property.status}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2e5a]">{property.title}</h1>
            <div className="flex items-center gap-2 text-slate-500 mt-2">
              <MapPin size={16} className="text-red-700" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-red-700">{formatPrice(property.price, property.priceType, property.rentPeriod)}</p>
            <div className="flex items-center gap-2 mt-2 justify-end text-slate-400 text-sm">
              <Eye size={14} /> {property.views} views
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-[350px] md:h-[480px] group">
                <img
                  src={images[currentImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Prev/Next */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setWishlist(!wishlist)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${wishlist ? 'bg-red-600 text-white' : 'bg-white text-slate-600 hover:bg-red-50'}`}
                  >
                    <Heart size={18} fill={wishlist ? 'white' : 'none'} />
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-600 hover:bg-slate-50"
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-5' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? 'border-red-700' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Facts */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-5 pb-3 border-b">Property Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Maximize2, label: 'Area', value: `${property.area?.toLocaleString()} sqft`, color: 'bg-blue-50 text-blue-700' },
                  ...(property.bedrooms > 0 ? [{ icon: Bed, label: 'Bedrooms', value: property.bedrooms.toString(), color: 'bg-amber-50 text-amber-700' }] : []),
                  ...(property.bathrooms > 0 ? [{ icon: Bath, label: 'Bathrooms', value: property.bathrooms.toString(), color: 'bg-emerald-50 text-emerald-700' }] : []),
                  { icon: Tag, label: 'Type', value: property.type.charAt(0).toUpperCase() + property.type.slice(1), color: 'bg-purple-50 text-purple-700' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl text-center">
                    <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center mb-2`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
                    <span className="font-extrabold text-[#1a2e5a] text-lg">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-4 pb-3 border-b">Description</h2>
              <p className="text-slate-600 leading-relaxed">
                {property.description || 'No description available for this property.'}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-5 pb-3 border-b">Amenities & Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-4 pb-3 border-b">Location</h2>
              <div className="flex items-center gap-2 text-slate-600 mb-4">
                <MapPin size={18} className="text-red-700" />
                <span className="font-medium">{property.location}, {property.city}</span>
              </div>
              <div className="bg-slate-100 rounded-xl h-48 flex items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2 text-slate-300" />
                  <p>{property.location}</p>
                  <p className="text-xs">{property.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Agent Card */}
            {agent && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-[#0f1e3d] to-[#1a2e5a] p-5">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Listed by</p>
                  <div className="flex items-center gap-4">
                    <img src={agent.image} alt={agent.name} className="w-14 h-14 rounded-full object-cover border-2 border-red-500" />
                    <div>
                      <h3 className="text-white font-extrabold text-lg">{agent.name}</h3>
                      <p className="text-red-400 text-sm">{agent.specialization}</p>
                      <p className="text-slate-400 text-xs">{agent.properties} Properties</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-3 w-full bg-red-700 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-colors">
                    <Phone size={16} /> {agent.phone}
                  </a>
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold text-sm transition-colors">
                    <Mail size={16} /> {agent.email}
                  </a>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-5">Send Inquiry</h3>
              {sent ? (
                <div className="text-center py-6">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-[#1a2e5a]">Message Sent!</p>
                  <p className="text-slate-500 text-sm">We'll contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-3">
                  {[
                    { key: 'name', label: 'Your Name', type: 'text', placeholder: 'Ahmed Khan' },
                    { key: 'email', label: 'Email', type: 'email', placeholder: 'ahmed@email.com' },
                    { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+92-300-0000000' },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        required
                        value={(contactForm as any)[key]}
                        onChange={e => setContactForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Message</label>
                    <textarea
                      rows={3}
                      placeholder={`I'm interested in ${property.title}...`}
                      value={contactForm.message}
                      onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none transition-colors"
                    />
                  </div>
                  <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-4">Property Details</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Property ID', value: `NRM-${property.id}` },
                  { label: 'Type', value: property.type },
                  { label: 'Status', value: property.status },
                  { label: 'City', value: property.city },
                  { label: 'Listed', value: new Date(property.createdAt).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-[#1a2e5a] capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-extrabold text-[#1a2e5a] mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(prop => (
                <Link key={prop.id} href={`/properties/${prop.slug}`} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1a2e5a] line-clamp-1 group-hover:text-red-700 transition-colors">{prop.title}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                      <MapPin size={12} /> {prop.location}
                    </div>
                    <p className="font-extrabold text-red-700 mt-2">{formatPrice(prop.price, prop.priceType, prop.rentPeriod)}</p>
                  </div>
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
