import { ShieldCheck, TrendingUp, FileText, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 mb-6 uppercase tracking-wider">
            WHY CHOOSE US
          </div>
          <h2 className="text-3xl md:text-5xl font-medium text-navy leading-tight tracking-tight max-w-3xl">
            Why <span className="text-primary font-semibold">Nayab Real Marketing</span> is The Right Choice for You
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2 cols wide) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Top Row: 2 Square Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Card 1: Verified Properties */}
              <div className="bg-[#f4f5f7] rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 group hover:shadow-lg">
                <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-8 bg-transparent transition-all duration-500 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary/5">
                  <ShieldCheck className="w-6 h-6 text-gray-700 transition-colors duration-500 group-hover:text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-medium text-navy mb-4">100% Verified Properties</h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  Every property is carefully checked by our team. We ensure all legal documents are clear so you can invest safely without any worries.
                </p>
              </div>

              {/* Card 2: Legal Assistance */}
              <div className="bg-[#f4f5f7] rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 group hover:shadow-lg">
                <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-8 bg-transparent transition-all duration-500 group-hover:-rotate-12 group-hover:border-primary group-hover:bg-primary/5">
                  <FileText className="w-6 h-6 text-gray-700 transition-colors duration-500 group-hover:text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-medium text-navy mb-4">Easy Legal Help</h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  We take care of all the paperwork, approvals, and transfers for you. Our expert legal team makes sure your property deals are smooth and stress-free.
                </p>
              </div>

            </div>

            {/* Bottom Row: 1 Wide Card */}
            <div className="bg-[#f4f5f7] rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 group hover:shadow-lg">
              <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-8 bg-transparent transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:border-primary group-hover:bg-primary/5">
                <Award className="w-6 h-6 text-gray-700 transition-colors duration-500 group-hover:text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-medium text-navy mb-4">Over 25 Years of Trust</h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                Since 1997, Nayab Real Marketing has helped people in Karachi invest safely in property. We believe in clear deals with no hidden fees. Join thousands of happy clients who trust us to build their future securely.
              </p>
            </div>

          </div>

          {/* Right Column: 1 Tall Card */}
          <div className="lg:col-span-1 bg-navy rounded-3xl p-8 md:p-10 flex flex-col transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-navy/20 group hover:shadow-2xl hover:shadow-navy/30">
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-8 bg-transparent transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/50">
              <TrendingUp className="w-6 h-6 text-white transition-transform duration-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-medium text-white mb-6 leading-tight">Sell Your Property</h3>
            
            <p className="text-blue-100/80 leading-relaxed text-[15px] mb-6">
              Get the best price for your property with Nayab Real Marketing. We use our large network and smart marketing to help you sell quickly.
            </p>
            
            <p className="text-blue-100/80 leading-relaxed text-[15px] mb-12 flex-grow">
              From checking your property's value to handling the paperwork, our expert team manages everything so you can relax.
            </p>

            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-colors w-fit">
              List Your Property <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
