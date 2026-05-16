import { Metadata } from 'next';
import React from 'react';
import { Award, Users, Building, TrendingUp, Palette, FileText, HardHat, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About Us | Nayab Real Marketing",
  description: "Learn about Nayab Real Marketing. Established in 1997, we provide trustworthy real estate consultancy, interior design, and construction services in Karachi.",
  keywords: "Nayab Real Marketing About Us, Who We Are – Nayab Real Estate, Scheme 33 properties, Nayab Real Marketing properties in Scheme 33 Karachi, DHA properties, Gulzar-e-Hijri properties, Paradise Bakery area properties, Maskan Johar properties",
  openGraph: {
    title: "About Us | Nayab Real Marketing",
    description: "Discover our journey of trust and real estate excellence in Karachi since 1997.",
    url: "https://nayabrealmarketing.com/about",
    siteName: "Nayab Real Marketing",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#0A1230]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about/premium_real_estate_exterior.png"
            alt="Nayab Real Marketing About Us - Premium Building"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1230] via-[#0A1230]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Who We Are – <span className="text-red-400">Nayab Real Estate</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Your trusted partner in Karachi's real estate sector. We help you find the best properties with our years of experience and deep market knowledge.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2e5a] mb-8">Our Journey of Excellence</h2>

            <div className="space-y-5 text-slate-600 text-lg leading-relaxed">
              <p>
                Welcome to Nayab Real Marketing, your trusted partner in Karachi's real estate market. We started our journey in 1997 with a simple goal: to help people find their perfect properties. What began as a small effort quickly grew into a lifelong dedication to real estate excellence.
              </p>
              <p>
                In 2003, we opened our first office in DHA, gaining valuable experience in corporate dealings and managing premium <strong className="text-slate-800 font-semibold">DHA properties</strong>. The challenges we faced early on only made us stronger.
              </p>
              <p>
                Later, we focused on <strong className="text-slate-800 font-semibold">Scheme 33 properties</strong>, where we found great success. In 2008, A. Nadeem, Adnan Ahmed, and Munir Ahmed officially founded Nayab Real Marketing. Since then, we have successfully developed, marketed, and sold many <strong className="text-slate-800 font-semibold">Nayab Real Marketing properties in Scheme 33 Karachi</strong>, along with popular <strong className="text-slate-800 font-semibold">Gulzar-e-Hijri properties</strong>.
              </p>
              <p>
                We are proud to offer great opportunities in well-known, active locations, including the <strong className="text-slate-800 font-semibold">Paradise Bakery area properties</strong> and prime <strong className="text-slate-800 font-semibold">Maskan Johar properties</strong>.
              </p>
              <p className="pt-2 border-t border-slate-200 mt-4">
                Today, <strong className="text-slate-800 font-semibold">Nayab Real Marketing About Us</strong> stands for decades of market knowledge and a strong commitment to helping our clients make safe, profitable investments.
              </p>
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative">
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/about/modern_office_meeting.png"
                alt="Who We Are - Nayab Real Estate Team Meeting"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block animate-fade-up">
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-4 rounded-xl">
                  <Award className="text-red-700" size={32} />
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#1a2e5a]">25+</div>
                  <div className="text-slate-500 font-medium text-sm">Years of Trust</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Our Divisions Section */}
      <section className="bg-slate-50 py-20 lg:py-28 border-y border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-red-100 text-red-700 font-bold rounded-full text-sm mb-6 animate-fade-in">
              Complete Real Estate & Development Solutions
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a2e5a] mb-6">Our Brand Divisions</h2>
            <p className="text-slate-600 text-lg">
              We proudly operate through four specialized divisions, each focused on providing excellence in its field under one trusted brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Division 1: Nayab Marketing */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="h-48 relative overflow-hidden bg-blue-900">
                <Image src="/divisions/marketing_banner.png" alt="Nayab Marketing" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="text-blue-400" /> Nayab Marketing</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-600 mb-6 line-clamp-3">
                  Specializes in real estate marketing, digital branding, lead generation, and property promotion strategies to help businesses grow.
                </p>
                <Link href="/nayab-marketing" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors">
                  Explore Nayab Marketing <TrendingUp size={18} />
                </Link>
              </div>
            </div>

            {/* Division 2: Nayab Construction */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="h-48 relative overflow-hidden bg-amber-900">
                <Image src="/divisions/construction_banner.png" alt="Nayab Construction" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-2xl font-bold flex items-center gap-2"><HardHat className="text-amber-400" /> Nayab Construction</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-600 mb-6 line-clamp-3">
                  Focuses on high-quality residential and commercial construction projects, combining modern engineering with reliable workmanship.
                </p>
                <Link href="/nayab-construction" className="inline-flex items-center gap-2 text-amber-600 font-bold hover:text-amber-800 transition-colors">
                  Explore Nayab Construction <HardHat size={18} />
                </Link>
              </div>
            </div>

            {/* Division 3: Nayab Interior */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="h-48 relative overflow-hidden bg-emerald-900">
                <Image src="/divisions/interior_banner.png" alt="Nayab Interior" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-2xl font-bold flex items-center gap-2"><Palette className="text-emerald-400" /> Nayab Interior</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-600 mb-6 line-clamp-3">
                  Provides modern interior design solutions that transform spaces into stylish, functional, and comfortable luxury environments.
                </p>
                <Link href="/nayab-interior" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-800 transition-colors">
                  Explore Nayab Interior <Palette size={18} />
                </Link>
              </div>
            </div>

            {/* Division 4: Nayab Properties */}
            <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100">
              <div className="h-48 relative overflow-hidden bg-purple-900">
                <Image src="/divisions/properties_banner.png" alt="Nayab Properties" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-2xl font-bold flex items-center gap-2"><Building className="text-purple-400" /> Nayab Properties</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-600 mb-6 line-clamp-3">
                  Deals with buying, selling, renting, and investment consultancy for residential and commercial properties with expert guidance.
                </p>
                <Link href="/nayab-properties" className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-800 transition-colors">
                  Explore Nayab Properties <Building size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0A1230] py-20 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-700/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-white">
          {[
            { value: '1997', label: 'Industry Experience Since', icon: Award },
            { value: '2008', label: 'Nayab Established In', icon: Building },
            { value: '100+', label: 'Major Projects Marketed', icon: TrendingUp },
            { value: '1000+', label: 'Satisfied Clients', icon: Users },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm">
              <Icon className="text-red-400 mx-auto mb-4" size={36} strokeWidth={1.5} />
              <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">{value}</div>
              <div className="text-slate-300 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}