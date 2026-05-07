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
    description: "Discover our journey of trust, resilience, and real estate excellence since 1997.",
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
            Your trusted partner in Pakistan's real estate sector. Connecting you with premium properties and delivering excellence through decades of market knowledge and resilience.
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
                Welcome to Nayab Real Marketing, your trusted partner in Pakistan's real estate sector. Our journey began in 1997 with a passion for connecting people with their ideal properties. What started as a part-time endeavor quickly transformed into a lifelong commitment to real estate excellence.
              </p>
              <p>
                In 2003, we established our first office in DHA, gathering invaluable experience in high-level corporate dealings and managing premium <strong className="text-slate-800 font-semibold">DHA properties</strong>. Though the early years tested our resilience, these challenges became our greatest strength.
              </p>
              <p>
                We soon shifted our focus to <strong className="text-slate-800 font-semibold">Scheme 33 properties</strong>, where we achieved remarkable success. In 2008, A. Nadeem, Adnan Ahmed, and Munir Ahmed officially founded Nayab Real Marketing. Since then, we have successfully developed, marketed, and sold extensive <strong className="text-slate-800 font-semibold">Nayab Real Marketing properties in Scheme 33 Karachi</strong>, as well as highly sought-after <strong className="text-slate-800 font-semibold">Gulzar-e-Hijri properties</strong>.
              </p>
              <p>
                We are proud to offer excellent opportunities in well-known, thriving locations, including exclusive <strong className="text-slate-800 font-semibold">Paradise Bakery area properties</strong> and prime <strong className="text-slate-800 font-semibold">Maskan Johar properties</strong>.
              </p>
              <p className="pt-2 border-t border-slate-200 mt-4">
                Today, <strong className="text-slate-800 font-semibold">Nayab Real Marketing About Us</strong> represents decades of market knowledge, resilience, and an unwavering commitment to helping our clients make safe and profitable investments.
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

      {/* Services Section */}
      <section className="bg-white py-20 lg:py-28 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2e5a] mb-6">Comprehensive Services</h2>
            <p className="text-slate-600 text-lg">
              Beyond buying and selling, we offer a complete suite of services to ensure your real estate journey is seamless, secure, and perfectly tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Real Estate Consultancy',
                desc: 'Expert guidance on market trends and investment strategies to maximize your returns.',
                icon: TrendingUp,
              },
              {
                title: 'Interior Design Services',
                desc: 'Transform your spaces with our premium, modern interior design solutions tailored to your lifestyle.',
                icon: Palette,
              },
              {
                title: 'Construction Services',
                desc: 'End-to-end construction management delivering high-quality builds on time and within budget.',
                icon: HardHat,
              },
              {
                title: 'Legal Documentation Services',
                desc: 'Flawless and transparent handling of all legal paperwork, ensuring secure ownership transfers.',
                icon: FileText,
              },
              {
                title: 'Office Meeting Setup',
                desc: 'Schedule a professional appointment with our experts in our modern corporate office environment.',
                icon: Calendar,
              }
            ].map((service, index) => (
              <div
                key={service.title}
                className="group bg-slate-50 p-8 rounded-2xl hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-100"
              >
                <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:bg-red-50 transition-all duration-300">
                  <service.icon className="text-red-700" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1a2e5a] mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#1a2e5a] hover:bg-[#0A1230] text-white px-8 py-4 rounded-xl font-bold text-sm md:text-base transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <Calendar size={18} />
              Book an Appointment
            </Link>
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