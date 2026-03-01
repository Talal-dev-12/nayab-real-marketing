'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [priceMax, setPriceMax] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (type) params.set('type', type);
    if (city) params.set('city', city);
    if (priceMax) params.set('maxPrice', priceMax);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10,22,40,0.65) 0%, rgba(10,22,40,0.75) 100%), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-red-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Pakistan's #1 Trusted Real Estate Agency
        </div>

        {/* Heading */}
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white font-bold leading-tight mb-6">
          Find Your Perfect
          <span className="text-primary block">Dream Property</span>
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Explore thousands of residential & commercial properties across Pakistan. Your dream home is just a search away.
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Keyword */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-navy text-sm"
                />
              </div>

              {/* Type */}
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-navy text-sm appearance-none bg-white"
                >
                  <option value="">Property Type</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              {/* City */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-navy text-sm appearance-none bg-white"
                >
                  <option value="">Select City</option>
                  <option>Karachi</option>
                  <option>Lahore</option>
                  <option>Islamabad</option>
                  <option>Rawalpindi</option>
                  <option>Faisalabad</option>
                  <option>Multan</option>
                </select>
              </div>

              {/* Price */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-navy text-sm appearance-none bg-white"
                >
                  <option value="">Max Price</option>
                  <option value="5000000">PKR 50 Lac</option>
                  <option value="10000000">PKR 1 Crore</option>
                  <option value="30000000">PKR 3 Crore</option>
                  <option value="50000000">PKR 5 Crore</option>
                  <option value="100000000">PKR 10 Crore</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 text-lg"
            >
              <Search size={20} />
              Search Properties
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-14 text-white">
          {[
            { value: '5,000+', label: 'Properties Listed' },
            { value: '2,000+', label: 'Happy Clients' },
            { value: '15+', label: 'Years Experience' },
            { value: '50+', label: 'Expert Agents' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
