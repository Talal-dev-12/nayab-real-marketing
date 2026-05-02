import { ShieldCheck, TrendingUp, Users, FileText, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#0a1429] relative overflow-hidden">
      {/* Abstract Glowing Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              The Nayab Advantage
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Elevating Real Estate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              Beyond Expectations
            </span>
          </h2>
          <p className="text-blue-100/70 text-lg md:text-xl leading-relaxed">
            Since 1997, we've transformed how Pakistan invests in property. No guesswork, no hidden fees—just absolute transparency, elite expertise, and guaranteed security.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[280px] gap-6">
          
          {/* Card 1: Large Wide (Verified Properties) */}
          <div className="md:col-span-2 lg:col-span-2 row-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:border-red-500/30 transition-all duration-500 group relative overflow-hidden backdrop-blur-sm flex flex-col justify-between">
            <div className="absolute right-0 top-0 w-64 h-64 bg-red-500/10 rounded-bl-full blur-3xl pointer-events-none group-hover:bg-red-500/20 transition-colors duration-500"></div>
            
            <div className="w-14 h-14 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="w-7 h-7 text-red-400" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">100% Verified Properties</h3>
              <p className="text-blue-100/60 leading-relaxed mb-4">Every listing undergoes rigorous physical and legal scrutiny. Complete legal clearance and zero fraud risk guaranteed.</p>
              <div className="flex gap-4">
                 <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20"><CheckCircle2 className="w-3.5 h-3.5"/> Legal Clearance</span>
                 <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20"><CheckCircle2 className="w-3.5 h-3.5"/> Safe Investment</span>
              </div>
            </div>
          </div>

          {/* Card 2: Tall (Data-Driven Valuations) */}
          <div className="md:col-span-1 lg:col-span-1 row-span-2 bg-gradient-to-br from-[#1a2e5a] to-[#0f1e3d] border border-blue-400/20 rounded-3xl p-8 hover:border-blue-400/40 transition-all duration-500 group relative overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/30 transition-colors duration-500"></div>
            
            <div className="w-14 h-14 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mb-8 group-hover:-translate-y-2 transition-transform duration-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <TrendingUp className="w-7 h-7 text-blue-300" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">Data-Driven Valuations</h3>
            <p className="text-blue-200/70 leading-relaxed mb-8 flex-grow">We ensure you buy at the right price and sell for maximum profit using real-time market data and historical trends.</p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-300"/></div>
                <span className="text-sm font-medium text-blue-100">Transparent Pricing</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-300"/></div>
                <span className="text-sm font-medium text-blue-100">Expert Negotiation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-300"/></div>
                <span className="text-sm font-medium text-blue-100">No Hidden Fees</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Standard (Seasoned Expert Agents) */}
          <div className="md:col-span-1 lg:col-span-1 row-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:border-red-500/30 transition-all duration-500 group relative backdrop-blur-sm flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">Seasoned <br/> Expert Agents</h3>
            </div>
            <p className="text-blue-100/60 text-sm leading-relaxed">Industry veterans possessing deep, localized knowledge of Karachi's most premium housing societies.</p>
          </div>

          {/* Card 4: Standard (Legal Assistance) */}
          <div className="md:col-span-1 lg:col-span-1 row-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] hover:border-red-500/30 transition-all duration-500 group relative backdrop-blur-sm flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:-rotate-12 transition-transform duration-500">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white leading-tight">Flawless Legal <br/> Assistance</h3>
            </div>
            <p className="text-blue-100/60 text-sm leading-relaxed">We handle all NOC approvals, seamless title transfers, and tax documentation.</p>
          </div>

          {/* Card 5: Large Wide (Legacy / CTA) */}
          <div className="md:col-span-2 lg:col-span-2 row-span-1 bg-gradient-to-r from-red-900/40 to-red-600/10 border border-red-500/20 rounded-3xl p-8 hover:border-red-500/40 transition-all duration-500 group relative overflow-hidden backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800')] bg-cover bg-center opacity-10 mix-blend-overlay group-hover:opacity-20 transition-opacity duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-red-400" />
                <span className="text-red-400 font-bold uppercase tracking-widest text-sm">Our Legacy</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Over 25 Years of Excellence</h3>
              <p className="text-red-100/70 max-w-md">Join thousands of satisfied clients who have trusted Nayab Real Marketing to build their future.</p>
            </div>

            <Link href="/about" className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-red-600/30 hover:-translate-y-1">
              Discover Our Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
