"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PropertyCard from "@/components/ui/PropertyCard";
import { PropertyCardSkeleton } from "@/components/ui/Skeleton";
import type { Property } from "@/types";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propsLoading, setPropsLoading] = useState(true);

  // Carousel refs & state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* ── Data fetching ── */
  useEffect(() => {
    let mounted = true;
    fetch("/api/properties?featured=true&status=available&limit=8")
      .then((r) => r.json())
      .then((d) => {
        if (mounted) setProperties(d.properties ?? []);
      })
      .catch(() => { })
      .finally(() => {
        if (mounted) setPropsLoading(false);
      });
    return () => {
      mounted = false;
    };
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
        /* ── Carousel ── */
        .prop-carousel {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-top: 0.5rem;
          padding-bottom: 1.5rem;
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
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #334155;
          border: none;
        }
        .carousel-arrow:hover:not(:disabled) {
          background: #b91c1c;
          color: white;
          box-shadow: 0 8px 25px rgba(185,28,28,0.4);
          transform: translateY(-50%) scale(1.05);
        }
        .carousel-arrow:disabled {
          opacity: 0;
          pointer-events: none;
          transform: translateY(-50%) scale(0.9);
        }
        .carousel-arrow svg { transition: color 0.2s; }
      `}</style>
      <section className="py-12 md:py-4">
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
          </div>

          {/* Carousel wrapper */}
          <div className="relative">
            {/* Left arrow */}
            <button
              className="carousel-arrow"
              style={{ left: -24 }}
              onClick={() => scrollCarousel("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} strokeWidth={2} />
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
              style={{ right: -24 }}
              onClick={() => scrollCarousel("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Scroll hint fade on mobile */}
          <p className="text-center text-xs text-slate-400 mt-4 sm:hidden">
            ← Swipe to explore →
          </p>
          <div className="text-center mt-10">
            {!propsLoading && (
              <Link
                href="/properties"
                className="btn-primary inline-flex items-center gap-2"
              >
                View All Properties →
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
