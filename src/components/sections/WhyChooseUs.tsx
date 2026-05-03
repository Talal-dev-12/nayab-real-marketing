import { ShieldCheck, TrendingUp, Users, FileText, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function WhyChooseUs() {
  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f1e3d] leading-tight mb-4 tracking-tight">
            Elevating Real Estate <br className="hidden sm:block" />
            Beyond Expectations
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Since 1997, we've transformed how Pakistan invests in property. No guesswork, no hidden fees—just absolute transparency, elite expertise, and guaranteed security.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[auto] md:auto-rows-[280px] gap-6">

          {/* Card 1: Large Wide (Verified Properties) */}
          <div className="md:col-span-2 lg:col-span-2 row-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 group relative flex flex-col justify-between">
            <div className="w-12 h-12 bg-red-50 text-red-600 border border-red-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#0f1e3d] mb-2">100% Verified Properties</h3>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">Every listing undergoes rigorous physical and legal scrutiny. Complete legal clearance and zero fraud risk guaranteed.</p>
              <div className="flex flex-wrap gap-2 md:gap-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Legal Clearance
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Safe Investment
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Tall (Data-Driven Valuations) */}
          <div className="md:col-span-1 lg:col-span-1 row-span-1 md:row-span-2 bg-[#0f1e3d] border border-[#1a2e5a] rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all duration-300 group relative flex flex-col">
            <div className="w-12 h-12 bg-white/10 text-white border border-white/20 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:-translate-y-1 transition-transform duration-300">
              <TrendingUp className="w-6 h-6" />
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Data-Driven Valuations</h3>
            <p className="text-slate-300 leading-relaxed mb-6 md:mb-8 flex-grow text-sm md:text-base">We ensure you buy at the right price and sell for maximum profit using real-time market data and historical trends.</p>

            <ul className="space-y-3 md:space-y-4 mt-auto">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                <span className="text-sm font-medium text-slate-200">Transparent Pricing</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                <span className="text-sm font-medium text-slate-200">Expert Negotiation</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                <span className="text-sm font-medium text-slate-200">No Hidden Fees</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Standard (Seasoned Expert Agents) */}
          <div className="md:col-span-1 lg:col-span-1 row-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 group flex flex-col justify-center">
            <div className="flex flex-row md:flex-col lg:flex-row items-center md:items-start lg:items-center gap-4 mb-4 md:mb-5">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0f1e3d]/5 border border-[#0f1e3d]/10 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shrink-0">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-[#0f1e3d]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#0f1e3d] leading-tight">Seasoned <br className="hidden md:block lg:hidden" /> Expert Agents</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">Industry veterans possessing deep, localized knowledge of Karachi's most premium housing societies.</p>
          </div>

          {/* Card 4: Standard (Legal Assistance) */}
          <div className="md:col-span-1 lg:col-span-1 row-span-1 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 group flex flex-col justify-center">
            <div className="flex flex-row md:flex-col lg:flex-row items-center md:items-start lg:items-center gap-4 mb-4 md:mb-5">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0f1e3d]/5 border border-[#0f1e3d]/10 rounded-xl flex items-center justify-center group-hover:-rotate-6 transition-transform duration-300 shrink-0">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-[#0f1e3d]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#0f1e3d] leading-tight">Flawless Legal <br className="hidden md:block lg:hidden" /> Assistance</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">We handle all NOC approvals, seamless title transfers, and tax documentation for you.</p>
          </div>

          {/* Card 5: Large Wide (Legacy / CTA) */}
          <div className="md:col-span-1 md:col-span-2 lg:col-span-2 row-span-1 bg-red-600 border border-red-700 rounded-3xl p-6 md:p-8 hover:shadow-xl hover:bg-red-700 transition-all duration-300 group relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 md:gap-8">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <Award className="w-5 h-5 text-red-200" />
                <span className="text-red-100 font-bold uppercase tracking-widest text-xs md:text-sm">Our Legacy</span>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2">Over 25 Years of Excellence</h3>
              <p className="text-red-100 max-w-md text-sm md:text-base">Join thousands of satisfied clients who have trusted Nayab Real Marketing to build their future.</p>
            </div>

            <Link href="/about" className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-red-600 hover:bg-slate-50 rounded-xl font-bold transition-all duration-300 shadow-lg text-sm md:text-base hover:-translate-y-1 w-full sm:w-auto">
              Discover Our Journey
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
