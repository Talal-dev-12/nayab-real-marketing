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
            <div className="bg-white rounded-2xl shadow-2xl p-4 fade-up delay-3">
              <div className="flex gap-2 mb-4">
                {(["all", "sale", "rent"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchType(t)}
                    className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                      searchType === t
                        ? "bg-red-700 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t === "all" ? "All" : t === "sale" ? "For Sale" : "For Rent"}
                  </button>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-300 transition-all">
                  <Search size={18} className="text-red-600 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by area, city, or property type..."
                    className="flex-1 outline-none text-gray-700 text-sm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[160px] focus-within:ring-2 focus-within:ring-red-300 transition-all">
                  <Building2 size={18} className="text-red-600 shrink-0" />
                  <select className="flex-1 outline-none text-gray-700 text-sm bg-transparent">
                    <option>Property Type</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Plot</option>
                    <option>Office</option>
                  </select>
                </div>
                <Link
                  href={`/properties${searchType !== "all" ? `?type=${searchType}` : ""}${location ? `&location=${encodeURIComponent(location)}` : ""}`}
                  className="bg-red-700 hover:bg-red-600 active:scale-95 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-red-700/30"
                >
                  <Search size={16} /> Search Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
