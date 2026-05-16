import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Target, BarChart3, Rocket, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: "Nayab Marketing | Digital Marketing Agency in Pakistan",
  description: "Drive growth with Nayab Marketing's data-driven property campaigns and digital branding solutions.",
  keywords: "Nayab Marketing, Real Estate Marketing, Digital Marketing Agency, Property Marketing Pakistan",
};

export default function NayabMarketingPage() {
  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* 1. Dramatic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Glowing Gradient Mesh Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        
        <div className="absolute inset-0 z-0 opacity-40">
           <Image
            src="/divisions/marketing_banner.png"
            alt="Digital Agency"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#050B14]/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/40 border border-blue-500/30 rounded-full text-cyan-300 font-medium text-xs md:text-sm mb-8 tracking-wide uppercase">
            <Zap size={14} className="text-cyan-400" /> Digital Branding & Lead Gen
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
            Scale Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Property Brand
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-light mb-12">
            Data-driven marketing, high-conversion ad campaigns, and dominant online presence for builders and investors.
          </p>
          <Link href="/contact" className="group inline-flex items-center justify-center gap-3 bg-white text-[#050B14] px-8 py-4 rounded-full font-bold text-lg hover:bg-cyan-50 transition-all duration-300 hover:scale-105">
            Launch Campaign
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 2. Infinite Marquee */}
      <section className="py-10 border-y border-white/5 bg-white/5 backdrop-blur-md overflow-hidden flex">
        <div className="flex w-max animate-[marquee_20s_linear_infinite]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 px-6 items-center">
              {['REAL ESTATE MARKETING', 'LEAD GENERATION', 'SOCIAL MEDIA', 'SEO PROMOTION', 'BRAND DEVELOPMENT', 'DATA ANALYTICS'].map((word, j) => (
                <div key={j} className="flex items-center gap-12">
                  <span className="text-2xl md:text-4xl font-black text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">
                    {word}
                  </span>
                  <span className="text-cyan-500/50">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Alternating Sections */}
      <section className="py-24 lg:py-40 max-w-7xl mx-auto px-6 space-y-32">
        
        {/* Block 1 */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <Target className="text-white" size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Precision Targeting</h2>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              We don't just run ads; we engineer high-converting funnels. By analyzing market data, we position your property projects directly in front of active buyers and investors across Google, Facebook, and Instagram.
            </p>
            <ul className="space-y-4 pt-4">
              {['Hyper-local demographic targeting', 'A/B testing ad creatives', 'Retargeting warm leads'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-4">
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-blue-900/40 to-purple-900/40 backdrop-blur-sm flex items-center justify-center border border-white/5">
                <Image src="/divisions/marketing_banner.png" alt="Targeting" fill className="object-cover opacity-50 mix-blend-luminosity" />
              </div>
            </div>
          </div>
        </div>

        {/* Block 2 */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <BarChart3 className="text-white" size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Dominant Branding</h2>
            <p className="text-xl text-slate-400 font-light leading-relaxed">
              In real estate, trust is everything. We build powerful brand identities that resonate with premium clients. From logo design to consistent social media aesthetics, we make your project unforgettable.
            </p>
            <ul className="space-y-4 pt-4">
              {['Visual identity & styling', 'Social media management', 'Authority building content'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-1/2">
             <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10 p-4">
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-purple-900/40 to-pink-900/40 backdrop-blur-sm flex items-center justify-center border border-white/5">
                <Image src="/heroImages/2.avif" alt="Branding" fill className="object-cover opacity-40 mix-blend-luminosity" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 4. Stats / ROI Section */}
      <section className="py-24 bg-gradient-to-b from-[#050B14] to-blue-950/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
             {[
               { val: '300%', label: 'Average ROI Increase' },
               { val: '50k+', label: 'Leads Generated' },
               { val: '120+', label: 'Campaigns Launched' },
               { val: 'No.1', label: 'Real Estate Agency' },
             ].map((stat, i) => (
               <div key={i} className="space-y-2">
                 <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
                   {stat.val}
                 </div>
                 <div className="text-sm md:text-base text-cyan-400 font-medium tracking-wide uppercase">
                   {stat.label}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
