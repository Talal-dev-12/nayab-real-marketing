import { Metadata } from 'next';
import { Building, TrendingUp, Palette, HardHat, MapPin, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Our Services | Nayab Real Marketing",
  description: "Comprehensive real estate services including property buying & selling, marketing, construction, and interior design across prime locations in Karachi.",
  keywords: "real estate services, property valuation, investment consulting, legal documentation, interior design Karachi, construction, marketing, Nayab Divisions",
  openGraph: {
    title: "Our Services | Nayab Real Marketing",
    description: "Explore our comprehensive real estate services in Pakistan.",
    url: "https://nayabrealmarketing.com/services",
    siteName: "Nayab Real Marketing",
    type: "website",
  },
};

const divisions = [
  {
    icon: TrendingUp,
    title: 'Nayab Marketing',
    desc: 'Specializes in real estate marketing, digital branding, lead generation, and property promotion strategies to help businesses grow.',
    features: ['Digital Branding', 'Lead Generation', 'Property Promotion', 'Marketing Strategy'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    link: '/nayab-marketing'
  },
  {
    icon: HardHat,
    title: 'Nayab Construction',
    desc: 'Focuses on high-quality residential and commercial construction projects, combining modern engineering with reliable workmanship.',
    features: ['Residential Construction', 'Commercial Projects', 'Modern Engineering', 'Quality Workmanship'],
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
    link: '/nayab-construction'
  },
  {
    icon: Palette,
    title: 'Nayab Interior',
    desc: 'Provides modern interior design solutions that transform spaces into stylish, functional, and comfortable luxury environments.',
    features: ['Space Planning', '3D Visualization', 'Luxury Environments', 'Material Selection'],
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    link: '/nayab-interior'
  },
  {
    icon: Building,
    title: 'Nayab Properties',
    desc: 'Deals with buying, selling, renting, and investment consultancy for residential and commercial properties with expert guidance.',
    features: ['Buying & Selling', 'Investment Consultancy', 'Property Rentals', 'Market Valuation'],
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    link: '/nayab-properties'
  },
];

const locations = [
  "DHA Properties",
  "Scheme 33 Properties",
  "Gulzar-e-Hijri",
  "Paradise Bakery Area",
  "Maskan Johar"
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#0A1230] pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <Image
            src="/about/premium_real_estate_exterior.png"
            alt="Nayab Services Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">Our Services & Divisions</h1>
          <p className="text-slate-300 text-lg md:text-xl">
            Comprehensive real estate solutions, construction, interior design, and marketing to meet all your property needs.
          </p>
        </div>
      </div>

      {/* Main Divisions Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2e5a] mb-4">Our Core Divisions</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">We proudly operate through four specialized divisions, each focused on providing excellence in its field under one trusted brand.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {divisions.map(({ icon: Icon, title, desc, features, color, bgColor, link }) => (
            <div key={title} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className={`w-16 h-16 ${bgColor} bg-opacity-10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={32} className={color} />
              </div>
              <h3 className="text-2xl font-bold text-[#1a2e5a] mb-4">{title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">{desc}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <CheckCircle2 size={16} className={color} />
                    {f}
                  </div>
                ))}
              </div>
              
              <Link href={link} className={`inline-flex items-center gap-2 ${color} font-bold hover:opacity-80 transition-opacity`}>
                Explore {title} <Icon size={18} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2e5a] mb-6">Prime Locations We Cover</h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Since our establishment in 1997, we have expanded our reach across Karachi's most sought-after neighborhoods. Whether you're looking for premium corporate spaces or residential comfort, our expertise covers the city's finest locations.
              </p>
              <div className="flex flex-wrap gap-4">
                {locations.map((loc) => (
                  <div key={loc} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl shadow-sm">
                    <MapPin size={18} className="text-red-600" />
                    <span className="font-semibold text-[#1a2e5a]">{loc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 relative">
               <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/about/modern_office_meeting.png"
                  alt="Nayab Real Marketing Expertise"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="bg-red-50 p-4 rounded-xl">
                    <Award className="text-red-700" size={32} />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-[#1a2e5a]">1997</div>
                    <div className="text-slate-500 font-medium text-sm">Established Since</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
