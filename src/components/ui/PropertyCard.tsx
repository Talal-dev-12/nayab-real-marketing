import Link from 'next/link';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Property } from '@/types';
import Image from 'next/image';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Crore`;
    if (price >= 100000) return `${(price / 100000).toFixed(1)} Lac`;
    return price.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <Image rel="preload"
          src={property.images[0] || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded text-xs font-bold text-white uppercase ${
            property.priceType === 'sale' ? 'bg-red-700' : 'bg-blue-600'
          }`}>
            For {property.priceType === 'sale' ? 'Sale' : 'Rent'}
          </span>
        </div>
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
