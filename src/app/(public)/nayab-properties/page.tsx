import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, TrendingUp, ShieldCheck, Home, Key, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: "Nayab Properties | Premium Real Estate Agency in Pakistan",
  description: "Secure, profitable real estate investments and property management in Karachi.",
  keywords: "Nayab Properties, Real Estate Agency Pakistan, Property Investment, Buy & Sell Property",
};

export default function NayabPropertiesPage() {
  return (
    <div className="min-h-screen bg-[#0A0710] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* 1. Glassmorphism Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Ambient Gradients */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-indigo-600/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-1/3 h-1/3 bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-full text-indigo-300 font-medium text-xs md:text-sm tracking-wide uppercase backdrop-blur-md">
              <ShieldCheck size={16} /> Verified Real Estate Partners
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Invest with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Confidence.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-lg leading-relaxed font-light">
              Expert consultancy for buying, selling, and renting premium residential and commercial properties across Karachi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/properties" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all text-center">
                Browse Listings
              </Link>
              <Link href="/contact" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold backdrop-blur-sm transition-all text-center flex items-center justify-center gap-2">
                Talk to an Expert <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.15)]">
             <Image
              src="/divisions/properties_banner.png"
              alt="Premium Real Estate"
              fill
              className="object-cover"
              priority
            />
            {/* Glass Overlay Data Card */}
            <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-300 font-medium mb-1">Market Growth</p>
                <p className="text-2xl font-bold text-white flex items-center gap-2">+24.5% <TrendingUp size={20} className="text-emerald-400" /></p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <p className="text-sm text-indigo-300 font-medium mb-1">Active Listings</p>
                <p className="text-2xl font-bold text-white">500+</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Bento Box Services Layout */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Comprehensive Solutions</h2>
          <p className="text-slate-400 text-lg max-w-2xl">From initial market research to final key handover, our property experts guide you through every step of your real estate journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Box 1 (Large) */}
          <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-white/5 p-10 flex flex-col justify-between group hover:bg-indigo-900/60 transition-colors relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <TrendingUp size={120} />
             </div>
             <div>
               <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/30">
                 <Users size={28} />
               </div>
               <h3 className="text-3xl font-bold text-white mb-4">Investment Consultancy</h3>
               <p className="text-slate-400 text-lg leading-relaxed max-w-md">We analyze market trends, upcoming infrastructure projects, and historical data to identify high-ROI opportunities in Karachi's prime locations.</p>
             </div>
          </div>

          {/* Box 2 */}
          <div className="rounded-3xl bg-white/5 border border-white/5 p-8 flex flex-col justify-between hover:bg-white/10 transition-colors">
             <div>
               <div className="text-purple-400 mb-4"><Home size={32} /></div>
               <h3 className="text-xl font-bold text-white mb-2">Residential Sales</h3>
               <p className="text-slate-400 text-sm">Luxury apartments, villas, and plots in secure communities.</p>
             </div>
          </div>

          {/* Box 3 */}
          <div className="rounded-3xl bg-white/5 border border-white/5 p-8 flex flex-col justify-between hover:bg-white/10 transition-colors">
             <div>
               <div className="text-cyan-400 mb-4"><Key size={32} /></div>
               <h3 className="text-xl font-bold text-white mb-2">Rental Management</h3>
               <p className="text-slate-400 text-sm">Connecting verified landlords with reliable, long-term tenants.</p>
             </div>
          </div>

          {/* Box 4 (Wide) */}
          <div className="md:col-span-3 rounded-3xl bg-gradient-to-r from-[#0A0710] to-indigo-950/30 border border-white/5 p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
             <div className="relative z-10 flex items-start gap-6">
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0 backdrop-blur-md">
                 <MapPin size={32} />
               </div>
               <div>
                 <h3 className="text-2xl font-bold text-white mb-2">Prime Locations Covered</h3>
                 <p className="text-slate-400">DHA City • Bahria Town • Scheme 33 • Gulzar-e-Hijri • Maskan</p>
               </div>
             </div>
             <Link href="/contact" className="relative z-10 whitespace-nowrap px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform">
               View Location Guides
             </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
