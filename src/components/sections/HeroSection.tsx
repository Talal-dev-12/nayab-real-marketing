"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Building2, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import superFlowEffect from "@/lib/superFlowEffect";

import "swiper/css";
import "swiper/css/pagination";
import "@/assets/css/super-flow.css";

/* ─────────────────────────────────────────────
   Hero background images
───────────────────────────────────────────── */
const HERO_IMAGES = [
  "/heroImages/1.avif",
  "/heroImages/2.avif",
  "/heroImages/3.avif",
  "/heroImages/4.avif",
];

export default function HeroSection() {
  const [searchType, setSearchType] = useState<"all" | "sale" | "rent">("all");
  const [location, setLocation] = useState("");

  return (
    <>
      <style>{`
        /* ── Section fade-in ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.35s; }

        /* ── Hero overlay gradient ── */
        .hero-overlay {
          background: linear-gradient(
            120deg,
            rgba(10,18,48,0.78) 0%,
            rgba(10,18,48,0.45) 60%,
            transparent 100%
          );
        }
      `}</style>
      <section className="relative min-h-[91vh] lg:min-h-[90vh] xl:min-h-[88vh] flex items-center overflow-hidden">
        
        {/* Background Swiper with Super Flow Effect */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay, Pagination, superFlowEffect as any]}
            effect="super-flow"
            slidesPerView={1}
            loop={true}
            speed={1000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ el: ".swiper-pagination", clickable: true }}
            className="w-full h-full"
          >
            {HERO_IMAGES.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="super-flow-image">
                  <img src={img} alt={`Hero ${i+1}`} />
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal"></div>
          </Swiper>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 hero-overlay pointer-events-none" style={{ zIndex: 1 }} />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 w-full" style={{ zIndex: 2 }}>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 fade-up">
              <Star size={14} fill="currentColor" /> Pakistan's Trusted Real Estate Partner
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 fade-up delay-1">
              Find Your <span className="text-red-400">Perfect</span>
              <br /> Property in Pakistan
            </h1>

            <p className="text-slate-300 text-lg mb-10 leading-relaxed fade-up delay-2">
              Explore thousands of verified properties across Karachi, Lahore,
              and Islamabad. Buy, sell, or rent with Nayab Real Marketing — your
              trusted partner since 2010.
            </p>

            {/* Search bar */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 fade-up delay-3 border border-white/20">
              {/* Tabs */}
              <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
                {(["all", "sale", "rent"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchType(t)}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
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
                {/* Location input */}
                <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by area, city, or property name..."
                    className="flex-1 outline-none text-slate-700 text-sm bg-transparent placeholder:text-slate-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* Property type dropdown */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-w-[180px] focus-within:border-red-500 focus-within:bg-white focus-within:shadow-sm transition-all">
                  <Building2 size={18} className="text-slate-400 shrink-0" />
                  <select className="flex-1 outline-none text-slate-700 text-sm bg-transparent appearance-none cursor-pointer font-medium">
                    <option>Property Type</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Plot</option>
                    <option>Office</option>
                  </select>
                </div>

                {/* Search button */}
                <Link
                  href={`/properties${searchType !== "all" ? `?type=${searchType}` : ""}${location ? `&location=${encodeURIComponent(location)}` : ""}`}
                  className="bg-red-700 hover:bg-red-600 active:scale-[0.97] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-red-700/25"
                >
                  <Search size={16} /> Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
