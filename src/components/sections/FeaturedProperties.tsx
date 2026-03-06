import Link from 'next/link';
import { Bed, Bath, Square, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const featuredProperties = [
  {
    id: '1',
    title: 'Luxury Villa in DHA Phase 6',
    price: '4,50,00,000',
    type: 'SALE',
    bedrooms: 5,
    bathrooms: 4,
    area: 500,
    city: 'Karachi',
    location: 'DHA Phase 6',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    category: 'Residential',
  },
  {
    id: '2',
    title: 'Modern Apartment in Gulberg',
    price: '85,00,000',
    type: 'SALE',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    city: 'Lahore',
    location: 'Gulberg III',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    category: 'Apartment',
  },
  {
    id: '3',
    title: 'Commercial Plot in Blue Area',
    price: '12,00,00,000',
    type: 'SALE',
    bedrooms: 0,
    bathrooms: 0,
    area: 1000,
    city: 'Islamabad',
    location: 'Blue Area',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    category: 'Commercial',
  },
  {
    id: '4',
    title: 'Spacious Family Home in F-7',
    price: '65,000',
    type: 'RENT',
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    city: 'Islamabad',
    location: 'F-7/2',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
    category: 'Residential',
  },
  {
    id: '5',
    title: 'Office Space in Clifton',
    price: '1,50,00,000',
    type: 'SALE',
    bedrooms: 0,
    bathrooms: 2,
    area: 200,
    city: 'Karachi',
    location: 'Clifton Block 5',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    category: 'Office',
  },
  {
    id: '6',
    title: 'Elegant Bungalow in Bahria Town',
    price: '2,80,00,000',
    type: 'SALE',
    bedrooms: 4,
    bathrooms: 3,
    area: 400,
    city: 'Lahore',
    location: 'Bahria Town Phase 4',
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=80',
    category: 'Residential',
  },
];

export default function FeaturedProperties() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-subtitle">What we offer</p>
          <h2 className="section-title">Featured Properties</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Discover our hand-picked selection of premium properties across Pakistan's major cities.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <div key={property.id} className="card property-card overflow-hidden group">
              {/* Image */}
              <div className="relative h-56 img-zoom-wrapper">
                <Image rel="preload"
                  src={property.image}
                  alt={property.title}
                  className="property-img w-full h-full object-cover transition-transform duration-500"
                />
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      property.type === 'SALE'
                        ? 'bg-primary text-white'
                        : 'bg-navy text-white'
                    }`}
                  >
                    {property.type === 'SALE' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white text-navy text-xs font-semibold px-3 py-1 rounded-full">
                    {property.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-heading font-bold text-navy text-lg leading-tight flex-1">
                    {property.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                  <MapPin size={14} className="text-primary" />
                  {property.location}, {property.city}
                </div>

                {/* Features */}
                {(property.bedrooms > 0 || property.area > 0) && (
                  <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-100 mb-4">
                    {property.bedrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed size={15} className="text-primary" />
                        {property.bedrooms} Bed
                      </span>
                    )}
                    {property.bathrooms > 0 && (
                      <span className="flex items-center gap-1">
                        <Bath size={15} className="text-primary" />
                        {property.bathrooms} Bath
                      </span>
                    )}
                    {property.area > 0 && (
                      <span className="flex items-center gap-1">
                        <Square size={15} className="text-primary" />
                        {property.area} sqyd
                      </span>
                    )}
                  </div>
                )}

                {/* Price & Link */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400">
                      {property.type === 'RENT' ? 'Monthly Rent' : 'Price'}
                    </span>
                    <div className="font-heading font-bold text-primary text-xl">
                      PKR {property.price}
                      {property.type === 'RENT' && <span className="text-sm text-gray-400">/mo</span>}
                    </div>
                  </div>
                  <Link
                    href={`/properties/${property.id}`}
                    className="bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-1"
                  >
                    Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/properties" className="btn-primary inline-flex items-center gap-2">
            View All Properties <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
