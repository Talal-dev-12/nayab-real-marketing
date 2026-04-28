"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Building2, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/* ─────────────────────────────────────────────
   Hero slides data
───────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    img: "/heroImages/1.avif",
    tag: "Pakistan's Trusted Real Estate Partner",
    title: (
      <>
        Find Your <span className="text-red-400">Perfect</span>
        <br /> Property in Pakistan
      </>
    ),
    desc: "Explore thousands of verified properties across Karachi, Lahore, and Islamabad. Buy, sell, or rent with Nayab Real Marketing — your trusted partner since 2010.",
  },
  {
    img: "/heroImages/2.avif",
    tag: "Investment Opportunities",
    title: (
      <>
        Premium <span className="text-red-400">Commercial</span>
        <br /> Spaces Available
      </>
    ),
    desc: "Grow your business with premium commercial locations. High-visibility shops, strategic corporate offices, and central commercial plots ready for acquisition.",
  },
  {
    img: "/heroImages/3.avif",
    tag: "Dream Homes",
    title: (
      <>
        Luxury <span className="text-red-400">Living</span>
        <br /> Awaits You
      </>
    ),
    desc: "Discover ultra-modern luxury apartments and sprawling villas tailored completely to your high-end lifestyle. Hand-picked move-in ready homes.",
  },
  {
    img: "/heroImages/4.avif",
    tag: "High-Yield Returns",
    title: (
      <>
        Secure Your <span className="text-red-400">Future</span>
        <br /> Today
      </>
    ),
    desc: "Invest securely in high-yield approved housing schemes backed completely by Nayab Real Marketing. Guaranteeing authenticity, rapid returns, and absolute transparency.",
  },
];

import Select from "@/components/ui/Select";

export default function HeroSection() {
  const [searchType, setSearchType] = useState<"all" | "sale" | "rent">("all");
  const [location, setLocation] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [propertyType, setPropertyType] = useState("");

  return (
    <>
      <style>{`
        /* ── Text fade-in ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.6s ease-out both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }

        /* ── Hero overlay gradient ── */
        .hero-overlay {
          background: linear-gradient(
            120deg,
            rgba(10,18,48,0.78) 0%,
            rgba(10,18,48,0.45) 60%,
            transparent 100%
          );
        }

        /* ── Ken Burns Zoom Effect ── */
        .zoom-image {
          transform: scale(1);
          transition: transform 6s ease-out;
        }
        .swiper-slide-active .zoom-image {
          transform: scale(1.15);
        }
      `}</style>

      <section className="relative min-h-[91vh] lg:min-h-[90vh] xl:min-h-[88vh] flex items-center overflow-hidden bg-[#0A1230]">
        
        {/* Background Swiper with Zoom Animation */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            slidesPerView={1}
            loop={true}
            speed={1200}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            pagination={{ el: ".swiper-pagination", clickable: true }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {HERO_SLIDES.map((slide, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full overflow-hidden bg-black/10">
                  <Image 
                    src={slide.img} 
                    alt={`Nayab Hero ${i+1}`} 
                    fill 
                    priority={i === 0} 
                    className="object-cover zoom-image" 
                  />
                  {/* Overlay bound specifically inside each slide so transition is smooth */}
                  <div className="absolute inset-0 hero-overlay pointer-events-none" />
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal pointer-events-auto z-50 !bottom-6"></div>
          </Swiper>
        </div>

        {/* Dynamic Static Content Overlay */}
        <div className="relative max-w-7xl mx-auto px-4 w-full" style={{ zIndex: 2 }}>
          <div className="max-w-2xl">
            
            {/* Changing Text area (locked height prevents search bar bounce) */}
            <div className="min-h-[290px] sm:min-h-[260px] md:min-h-[240px] flex flex-col justify-end pb-8">
              <div key={activeIndex}>
                <div className="inline-flex items-center gap-2 bg-red-700 text-white text-[13px] font-bold px-4 py-1.5 rounded-full mb-5 animate-fade-up">
                  <Star size={13} fill="currentColor" /> {HERO_SLIDES[activeIndex].tag}
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.15] mb-4 animate-fade-up delay-1 tracking-tight">
                  {HERO_SLIDES[activeIndex].title}
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed animate-fade-up delay-2 max-w-xl">
                  {HERO_SLIDES[activeIndex].desc}
                </p>
              </div>
            </div>

            {/* Static Search bar */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-4 sm:p-5 border border-white/20 fade-up pointer-events-auto">
              
              {/* Tabs */}
              <div className="flex gap-1 mb-4 sm:mb-5 bg-slate-100 p-1 rounded-xl w-fit">
                {(["all", "sale", "rent"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchType(t)}
                    className={`px-4 sm:px-5 py-2 rounded-lg font-bold text-[13px] sm:text-sm transition-all duration-200 ${
                      searchType === t
                        ? "bg-[#1a2e5a] text-white shadow-md"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {t === "all" ? "All" : t === "sale" ? "Buy" : "Rent"}
                  </button>
                ))}
              </div>

              {/* Inputs row */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 sm:py-3.5 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by area, city, or property name..."
                    className="flex-1 outline-none text-slate-700 text-[13px] sm:text-sm bg-transparent placeholder:text-slate-400 font-medium"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 sm:py-2.5 min-w-[200px] focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all relative">
                  <Select
                    value={propertyType}
                    onChange={setPropertyType}
                    placeholder="Property Type"
                    icon={<Building2 size={18} className="text-slate-400" />}
                    className="flex-1 text-[13px] sm:text-sm bg-transparent font-bold"
                    options={[
                      { value: "Residential", label: "Residential" },
                      { value: "Commercial", label: "Commercial" },
                      { value: "Plot", label: "Plot" },
                      { value: "Office", label: "Office" },
                    ]}
                  />
                </div>

                <Link
                  href={`/properties${searchType !== "all" ? `?type=${searchType}` : ""}${location ? `&location=${encodeURIComponent(location)}` : ""}${propertyType ? `&propType=${propertyType}` : ""}`}
                  className="bg-red-700 hover:bg-red-800 active:scale-[0.97] text-white px-8 py-3.5 rounded-xl font-bold text-[13px] sm:text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-red-700/25"
                >
                  Search
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
