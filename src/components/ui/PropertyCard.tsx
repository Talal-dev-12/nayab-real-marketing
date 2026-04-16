'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bed, Bath, Maximize, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { Property } from '@/types';
import { savedApi } from '@/lib/api-client';

interface PropertyCardProps {
  property: Property;
  initialSaved?: boolean;
}

export default function PropertyCard({ property, initialSaved = false }: PropertyCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    setIsLoggedIn(!!raw);
  }, []);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push(`/sign-in?redirect=/properties/${property.slug}`);
      return;
    }
    setSaving(true);
    try {
      const res = await savedApi.toggle((property as any)._id);
      setSaved((res as any).saved);
    } catch { /* silent */ } finally { setSaving(false); }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Crore`;
    if (price >= 100000) return `${(price / 100000).toFixed(1)} Lac`;
    return price.toLocaleString();
  };

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Sale / Rent badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className={`px-3 py-1 rounded-lg text-[11px] font-bold text-white uppercase tracking-wider backdrop-blur-sm ${property.priceType === 'sale' ? 'bg-red-700/90' : 'bg-blue-600/90'}`}>
            For {property.priceType === 'sale' ? 'Sale' : 'Rent'}
          </span>
        </div>

        {/* Save heart */}
        <button
          onClick={handleSave}
          disabled={saving}
          title={isLoggedIn ? (saved ? 'Remove from saved' : 'Save property') : 'Sign in to save'}
          className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg transition-all duration-200 disabled:opacity-60 ${saved ? 'bg-red-600 text-white scale-110' : 'bg-white/80 text-slate-600 hover:bg-white hover:scale-110'}`}
        >
          <Heart size={15} fill={saved ? 'white' : 'none'} />
        </button>

        {/* Price — frosted glass strip at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between">
          <div>
            <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest mb-0.5">
              {property.priceType === 'sale' ? 'Price' : 'Rent'}
            </p>
            <p className="text-white text-xl font-extrabold tracking-tight leading-none drop-shadow-md">
              PKR {formatPrice(property.price)}
              {property.priceType === 'rent' && (
                <span className="text-white/70 text-xs font-medium ml-1">/{property.rentPeriod}</span>
              )}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
            <ArrowUpRight size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-3.5">
        <h3 className="font-bold text-[#1a2e5a] text-[15px] mb-2 group-hover:text-red-700 transition-colors duration-200 line-clamp-1">
          {property.title}
        </h3>

        <p className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-3">
          <MapPin size={13} className="text-red-600 shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </p>

        {property.bedrooms > 0 && (
          <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-600 text-[13px] font-medium">
              <Bed size={14} className="text-red-600/80" /> {property.bedrooms}
            </span>
            <span className="text-slate-200 mx-1.5">|</span>
            <span className="flex items-center gap-1.5 text-slate-600 text-[13px] font-medium">
              <Bath size={14} className="text-red-600/80" /> {property.bathrooms}
            </span>
            <span className="text-slate-200 mx-1.5">|</span>
            <span className="flex items-center gap-1.5 text-slate-600 text-[13px] font-medium">
              <Maximize size={14} className="text-red-600/80" /> {property.area} sqft
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
