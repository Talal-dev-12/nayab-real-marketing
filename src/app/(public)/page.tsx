"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/ui/PropertyCard";
import BlogCard from "@/components/ui/BlogCard";
import {
  PropertyCardSkeleton,
  BlogCardSkeleton,
} from "@/components/ui/Skeleton";
import {
  Search,
  Home,
  Building2,
  MapPin,
  Star,
  Phone,
  CheckCircle,
  TrendingUp,
  Users,
  Award,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Property, Blog } from "@/types";
import ExploreTools from "@/components/sections/ExploreTools";
import ExploreLocalities from "@/components/sections/ExploreLocalities";

/* ─────────────────────────────────────────────
   Hero background images
───────────────────────────────────────────── */
const HERO_IMAGES = [
  "/heroImages/1.avif",
  "/heroImages/2.avif",
  "/heroImages/3.avif",
  "/heroImages/4.avif",
];

const SLIDE_INTERVAL = 7000; // ms

/* ─────────────────────────────────────────────
   Custom hook: crossfade hero
───────────────────────────────────────────── */
function useHeroCrossfade(images: string[], interval: number) {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
       setCurrent((c) => (c + 1) % images.length);
setNext((c) => (c + 2) % images.length);
        setFading(false);
      }, 1000); // match CSS transition duration
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return { current, next, fading };
}

/* ─────────────────────────────────────────────
   Page component
───────────────────────────────────────────── */
export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [propsLoading, setPropsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [searchType, setSearchType] = useState<"all" | "sale" | "rent">("all");
  const [location, setLocation] = useState("");

  // Carousel refs & state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { current, next, fading } = useHeroCrossfade(HERO_IMAGES, SLIDE_INTERVAL);

  /* ── Data fetching ── */
  useEffect(() => {
    fetch("/api/properties?featured=true&status=available&limit=8")
      .then((r) => r.json())
      .then((d) => setProperties(d.properties ?? []))
      .catch(() => {})
      .finally(() => setPropsLoading(false));

    fetch("/api/blogs?published=true&limit=3")
      .then((r) => r.json())
      .then((d) => setBlogs(d.blogs ?? []))
      .catch(() => {})
      .finally(() => setBlogsLoading(false));
  }, []);

  /* ── Carousel scroll helpers ── */
  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scrollCarousel = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        /* ── Crossfade hero ── */
        .hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 1s ease-in-out;
          will-change: opacity;
        }
        .hero-bg-zoom {
          animation: heroZoom 14s ease-in-out infinite alternate;
        }
        @keyframes heroZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.06); }
        }

        /* ── Carousel ── */
        .prop-carousel {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 0.5rem;
        }
        .prop-carousel::-webkit-scrollbar { display: none; }
        .prop-carousel > * {
          flex: 0 0 340px;
          scroll-snap-align: start;
        }
        @media (max-width: 640px) {
          .prop-carousel > * { flex: 0 0 88vw; }
        }

        /* ── Arrow button ── */
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s, opacity 0.2s;
          border: none;
        }
        .carousel-arrow:hover {
          background: #b91c1c;
          box-shadow: 0 6px 24px rgba(185,28,28,0.35);
          color: white;
        }
        .carousel-arrow:disabled {
          opacity: 0.3;
          pointer-events: none;
        }
        .carousel-arrow svg { transition: color 0.2s; }
        .carousel-arrow:hover svg { color: white; }

        /* ── Section fade-in ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.35s; }
        .delay-4 { animation-delay: 0.5s; }

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

      <div className="min-h-screen bg-gray-50">

        {/* ══════════════ HERO ══════════════ */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">

          {/* Background layer A (current) */}
          <div
            className="hero-bg hero-bg-zoom"
            style={{
              backgroundImage: `url(${HERO_IMAGES[current]})`,
              opacity: fading ? 0 : 1,
            }}
            rel="preload"
          />

          {/* Background layer B (next — always visible beneath) */}
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url(${HERO_IMAGES[next]})`,
              opacity: 1,
              zIndex: -1,
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 hero-overlay" style={{ zIndex: 1 }} />

          {/* Dots indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
            style={{ zIndex: 2 }}
          >
            {HERO_IMAGES.map((_, i) => (
              <span
                key={i}
                className="block rounded-full transition-all duration-500"
                style={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  background: i === current ? "#ef4444" : "rgba(255,255,255,0.45)",
                }}
              />
            ))}
          </div>

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

        {/* ══════════════ STATS BAR ══════════════ */}
        <section className="bg-[#1a2e5a] py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
              {[
                { icon: Home,   value: "2,500+", label: "Total Properties" },
                { icon: Users,  value: "1,200+", label: "Happy Clients" },
                { icon: Award,  value: "14+",    label: "Years Experience" },
                { icon: MapPin, value: "8",       label: "Cities Covered" },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <Icon className="text-red-400" size={28} />
                  <div className="text-3xl font-extrabold">{value}</div>
                  <div className="text-slate-400 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ EXPLORE TOOLS ══════════════ */}
        <ExploreTools />

        {/* ══════════════ EXPLORE LOCALITIES ══════════════ */}
        <ExploreLocalities />

        {/* ══════════════ FEATURED PROPERTIES (CAROUSEL) ══════════════ */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
              <div>
                <p className="section-subtitle">What We Offer</p>
                <h2 className="text-4xl font-extrabold text-[#1a2e5a]">
                  Featured Properties
                </h2>
                <p className="text-slate-500 mt-2 max-w-md">
                  Handpicked premium properties across Pakistan's top cities.
                </p>
              </div>
              {!propsLoading && (
                <Link
                  href="/properties"
                  className="btn-primary inline-flex items-center gap-2 shrink-0"
                >
                  View All Properties →
                </Link>
              )}
            </div>

            {/* Carousel wrapper */}
            <div className="relative">
              {/* Left arrow */}
              <button
                className="carousel-arrow"
                style={{ left: -22 }}
                onClick={() => scrollCarousel("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>

              {/* Cards track */}
              <div
                ref={carouselRef}
                className="prop-carousel"
                onScroll={updateScrollState}
              >
                {propsLoading
                  ? [...Array(6)].map((_, i) => (
                      <div key={i} style={{ flex: "0 0 340px" }}>
                        <PropertyCardSkeleton />
                      </div>
                    ))
                  : properties.map((p) => (
                      <div
                        key={p._id}
                        className="transition-transform duration-300 hover:-translate-y-1"
                      >
                        <PropertyCard property={p} />
                      </div>
                    ))}
              </div>

              {/* Right arrow */}
              <button
                className="carousel-arrow"
                style={{ right: -22 }}
                onClick={() => scrollCarousel("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </div>

            {/* Scroll hint fade on mobile */}
            <p className="text-center text-xs text-slate-400 mt-4 sm:hidden">
              ← Swipe to explore →
            </p>
          </div>
        </section>

        {/* ══════════════ WHY CHOOSE US ══════════════ */}
        <section className="bg-[#0f1e3d] py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-red-400 font-semibold uppercase tracking-widest text-sm mb-2">
                Why Choose Us
              </p>
              <h2 className="text-4xl font-extrabold text-white">
                The Nayab Real Advantage
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Verified Properties",
                  desc: "Every property is personally verified by our expert team for authenticity and legal clarity.",
                },
                {
                  icon: TrendingUp,
                  title: "Best Market Price",
                  desc: "We ensure you get the best value for your investment with our market intelligence.",
                },
                {
                  icon: Users,
                  title: "Expert Agents",
                  desc: "Our experienced agents guide you through every step of the buying or renting process.",
                },
                {
                  icon: CheckCircle,
                  title: "Legal Assistance",
                  desc: "Complete documentation support for hassle-free property transactions.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-slate-800 rounded-xl p-6 text-center hover:bg-red-700 transition-colors duration-300 group cursor-default"
                >
                  <div className="w-14 h-14 bg-red-700 group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                    <Icon
                      size={24}
                      className="text-white group-hover:text-red-700 transition-colors duration-300"
                    />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                  <p className="text-slate-400 group-hover:text-white text-sm leading-relaxed transition-colors duration-300">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ LATEST BLOGS ══════════════ */}
        <section className="py-20 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subtitle">Our Blog</p>
            <h2 className="text-4xl font-extrabold text-[#1a2e5a]">
              Latest News & Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogsLoading
              ? [...Array(3)].map((_, i) => <BlogCardSkeleton key={i} />)
              : blogs.map((b) => <BlogCard key={b._id} blog={b} />)}
          </div>
          {!blogsLoading && blogs.length > 0 && (
            <div className="text-center mt-10">
              <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
                View All Articles →
              </Link>
            </div>
          )}
        </section>

        {/* ══════════════ CTA ══════════════ */}
        <section
          className="py-24 relative overflow-hidden"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          rel="preload"
        >
          <div className="absolute inset-0 bg-[#1a2e5a] opacity-90" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-slate-300 mb-8 text-lg">
              Get a free consultation with our real estate experts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-red-700 hover:bg-red-600 active:scale-95 text-white px-8 py-4 rounded-lg font-bold text-base transition-all shadow-lg shadow-red-900/40"
              >
                Get Free Consultation
              </Link>
              <a
                href="tel:+923212869000"
                className="border-2 border-white text-white hover:bg-white hover:text-[#1a2e5a] active:scale-95 px-8 py-4 rounded-lg font-bold text-base transition-all flex items-center gap-2 justify-center"
              >
                <Phone size={18} /> Call Now
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}