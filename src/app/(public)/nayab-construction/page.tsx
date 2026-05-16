import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Ruler, HardHat, Hammer, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: "Nayab Construction | Top Construction Company in Pakistan",
  description: "High-quality residential and commercial construction projects by Nayab Construction.",
  keywords: "Nayab Construction, Construction Company in Pakistan, Building Contractors, Commercial Construction",
};

export default function NayabConstructionPage() {
  return (
    <div className="min-h-screen bg-[#F3F2ED] text-stone-900 font-sans">
      
      {/* 1. Split-screen Hero */}
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row">
        {/* Left Content */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 lg:px-16 py-20 z-10 bg-[#F3F2ED]">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-[2px] bg-amber-600" />
            <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Engineering Excellence</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-8 text-stone-900">
            Solid.<br />
            Secure.<br />
            <span className="text-stone-400">Built to Last.</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-md leading-relaxed mb-12">
            We combine modern engineering standards with reliable workmanship to create durable structures across Pakistan.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-4 bg-stone-900 text-white px-8 py-5 w-max font-bold hover:bg-amber-600 transition-colors duration-300">
            Request an Estimate <ArrowRight size={20} />
          </Link>
        </div>
        
        {/* Right Image */}
        <div className="w-full lg:w-[55%] relative min-h-[50vh] lg:min-h-full">
          <Image
            src="/divisions/construction_banner.png"
            alt="Construction Site"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-stone-900/20 mix-blend-multiply" />
        </div>
      </section>

      {/* 2. Process Timeline */}
      <section className="py-24 lg:py-32 max-w-7xl mx-auto px-6 lg:px-16">
        <div className="max-w-2xl mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Our Blueprint for Success</h2>
          <p className="text-xl text-stone-600">A transparent, step-by-step approach ensuring your project is delivered on time, exactly as planned.</p>
        </div>

        <div className="space-y-16 lg:space-y-0 lg:grid lg:grid-cols-3 gap-12 relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] bg-stone-200" />
          
          {[
            { icon: Ruler, title: '01. Planning & Design', desc: 'Detailed architectural drawings, material selection, and strict budget outlines to prevent surprises.' },
            { icon: Hammer, title: '02. Grey Structure', desc: 'Laying the solid foundation. We use premium steel and cement to ensure structural integrity that lasts generations.' },
            { icon: CheckCircle2, title: '03. Finishing & Handover', desc: 'Flawless execution of interior finishes, plumbing, and electricals before the final quality inspection.' }
          ].map((step, i) => (
             <div key={i} className="relative z-10 bg-[#F3F2ED]">
               <div className="w-24 h-24 bg-white border border-stone-200 flex items-center justify-center mb-8 shadow-sm">
                 <step.icon size={32} className="text-amber-600" strokeWidth={1.5} />
               </div>
               <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
               <p className="text-stone-600 leading-relaxed">{step.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* 3. Masonry Portfolio */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight max-w-xl">
              Projects that define our legacy.
            </h2>
            <Link href="/contact" className="text-amber-500 font-bold hover:text-amber-400 transition-colors flex items-center gap-2">
              View All Projects <ArrowRight size={18} />
            </Link>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[
              { height: 'h-96', img: '/heroImages/1.avif', title: 'Luxury Villa DHA' },
              { height: 'h-64', img: '/heroImages/2.avif', title: 'Corporate Plaza Phase 8' },
              { height: 'h-80', img: '/heroImages/3.avif', title: 'Residential Complex' },
              { height: 'h-64', img: '/divisions/properties_banner.png', title: 'Scheme 33 Homes' },
              { height: 'h-96', img: '/heroImages/4.avif', title: 'Commercial Hub' },
            ].map((item, i) => (
              <div key={i} className={`relative w-full ${item.height} group overflow-hidden bg-stone-800 break-inside-avoid`}>
                <Image src={item.img} alt={item.title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-xl font-bold text-white mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                  <div className="w-8 h-[2px] bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
