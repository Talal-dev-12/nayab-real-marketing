'use client';
import { Star } from 'lucide-react';
import Image from 'next/image';

const modernSocieties = [
  { 
    name: "DHA City", 
    subtitle: "Premium Living", 
    logo: "https://ui-avatars.com/api/?name=DHA&background=0f1e3d&color=fff&font-size=0.4&bold=true&rounded=true" 
  },
  { 
    name: "Bahria Town", 
    subtitle: "Luxury Lifestyle", 
    logo: "https://ui-avatars.com/api/?name=BT&background=c0392b&color=fff&font-size=0.4&bold=true&rounded=true" 
  },
  { 
    name: "Scheme 33", 
    subtitle: "Prime Investment", 
    logo: "https://ui-avatars.com/api/?name=33&background=1a2e5a&color=fff&font-size=0.4&bold=true&rounded=true" 
  },
  { 
    name: "ASF City", 
    subtitle: "Secure Community", 
    logo: "https://ui-avatars.com/api/?name=ASF&background=2c4a8a&color=fff&font-size=0.4&bold=true&rounded=true" 
  },
  { 
    name: "Fazaia", 
    subtitle: "Elite Standards", 
    logo: "https://ui-avatars.com/api/?name=FH&background=e74c3c&color=fff&font-size=0.4&bold=true&rounded=true" 
  },
  { 
    name: "Gwadar Golf", 
    subtitle: "Future Hub", 
    logo: "https://ui-avatars.com/api/?name=GGC&background=0f1e3d&color=fff&font-size=0.4&bold=true&rounded=true" 
  },
  { 
    name: "Commander", 
    subtitle: "Affordable", 
    logo: "https://ui-avatars.com/api/?name=CC&background=c0392b&color=fff&font-size=0.4&bold=true&rounded=true" 
  },
  { 
    name: "Saima Arabian", 
    subtitle: "Modern Villas", 
    logo: "https://ui-avatars.com/api/?name=SA&background=1a2e5a&color=fff&font-size=0.4&bold=true&rounded=true" 
  }
];

export default function SocietiesMarquee() {
  return (
    <section className="py-12 bg-gradient-to-b from-[#0a1429] to-[#112040] border-y border-white/5 overflow-hidden relative">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 mb-8 relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 shadow-lg shadow-black/20">
          <Star className="w-4 h-4 text-red-500" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">
            Premium Partner Societies
          </span>
          <Star className="w-4 h-4 text-red-500" />
        </div>
      </div>

      <div className="relative flex w-full overflow-hidden group">
        {/* Left fade gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0a1429] to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex w-max animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...modernSocieties, ...modernSocieties].map((society, index) => (
            <div 
              key={index} 
              className="mx-3 group/card relative flex items-center gap-4 px-6 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/30 rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden min-w-[240px]"
            >
              {/* Subtle hover gradient inside card */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
              
              {/* Logo Image */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover/card:border-red-500/50 transition-colors duration-500 shrink-0 bg-white/5 shadow-md">
                <Image 
                  src={society.logo} 
                  alt={`${society.name} logo`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              
              <div className="flex flex-col justify-center">
                <span className="text-lg font-extrabold text-white tracking-wide">
                  {society.name}
                </span>
                <span className="text-sm font-medium text-blue-200/60 mt-0.5">
                  {society.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a1429] to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
}
