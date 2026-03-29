'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bed, Bath, Maximize, MapPin, Heart } from 'lucide-react';
import { Property } from '@/types';
import { savedApi } from '@/lib/api-client';

interface PropertyCardProps {
  property: Property;
  initialSaved?: boolean;
}

export default function PropertyCard({ property, initialSaved = false }: PropertyCardProps) {
  const router = useRouter();
  const [saved,   setSaved]   = useState(initialSaved);
  const [saving,  setSaving]  = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    setIsLoggedIn(!!raw);
  }, []);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // don't navigate to property
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
    if (price >= 100000)   return `${(price / 100000).toFixed(1)} Lac`;
    return price.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded text-xs font-bold text-white uppercase ${property.priceType === 'sale' ? 'bg-red-700' : 'bg-blue-600'}`}>
            For {property.priceType === 'sale' ? 'Sale' : 'Rent'}
          </span>
        </div>
        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          title={isLoggedIn ? (saved ? 'Remove from saved' : 'Save property') : 'Sign in to save'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-60 ${saved ? 'bg-red-600 text-white' : 'bg-white/90 text-slate-600 hover:bg-red-50'}`}
        >
          <Heart size={14} fill={saved ? 'white' : 'none'} />
        </button>
        <div className="absolute bottom-3 right-3 bg-[#1a2e5a] text-white px-3 py-1 rounded font-bold text-sm">
          PKR {formatPrice(property.price)}
          {property.priceType === 'rent' && <span className="text-xs font-normal">/{property.rentPeriod}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {property.bedrooms > 0 && (
          <div className="flex gap-4 text-slate-500 text-sm mb-3 border-b pb-3">
            <span className="flex items-center gap-1"><Bed size={14} className="text-red-600" /> {property.bedrooms} Beds</span>
            <span className="flex items-center gap-1"><Bath size={14} className="text-red-600" /> {property.bathrooms} Baths</span>
            <span className="flex items-center gap-1"><Maximize size={14} className="text-red-600" /> {property.area} sqft</span>
          </div>
        )}
        <h3 className="font-bold text-[#1a2e5a] text-base mb-2 group-hover:text-red-700 transition-colors line-clamp-1">
          <Link href={`/properties/${property.slug}`}>{property.title}</Link>
        </h3>
        <p className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin size={13} className="text-red-600 shrink-0" />
          {property.location}
        </p>
        <Link
          href={`/properties/${property.slug}`}
          className="block text-center bg-[#1a2e5a] hover:bg-red-700 text-white text-sm font-semibold py-2 rounded transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
