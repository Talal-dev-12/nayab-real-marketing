'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Building2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { AreaCardSkeleton, SchemeCardSkeleton } from '@/components/ui/Skeleton';
import type { AreaSummary, SchemeSummary } from '@/types';

function Carousel({ items, renderCard, autoPlaySpeed = 1, reverse = false }: { items: any[], renderCard: (item: any) => React.ReactNode, autoPlaySpeed?: number, reverse?: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Triple items for seamless infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  // Initialize scroll position to middle third so we can scroll left or right infinitely
  useEffect(() => {
    const el = scrollRef.current;
    if (el && items.length > 0) {
      // Small timeout to ensure DOM is rendered before calculating width
      setTimeout(() => {
        el.scrollLeft = el.scrollWidth / 3;
      }, 50);
    }
  }, [items]);

  // Auto-scroll loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scroll = (time: number) => {
      const el = scrollRef.current;
      if (el && !isHovered && !isDown && items.length > 0) {
        const deltaTime = time - lastTime;
        if (deltaTime > 16) {
          el.scrollLeft += reverse ? -autoPlaySpeed : autoPlaySpeed;
          lastTime = time;

          // Infinite loop reset logic
          const scrollWidth = el.scrollWidth;
          const oneThird = scrollWidth / 3;
          
          if (el.scrollLeft >= oneThird * 2) {
             el.scrollLeft -= oneThird;
          } else if (el.scrollLeft <= 0) {
             el.scrollLeft += oneThird;
          }
        }
      } else {
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDown, autoPlaySpeed, reverse, items]);

  const handlePrev = () => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const handleNext = () => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsDown(false); }}
      onMouseUp={() => setIsDown(false)}
    >
      <div 
        ref={scrollRef}
        className="flex gap-5 overflow-x-hidden cursor-grab active:cursor-grabbing pb-4"
        onMouseDown={(e) => {
          setIsDown(true);
          const el = scrollRef.current;
          if (el) {
            setStartX(e.pageX - el.offsetLeft);
            setScrollLeft(el.scrollLeft);
          }
        }}
        onMouseMove={(e) => {
          if (!isDown) return;
          e.preventDefault();
          const el = scrollRef.current;
          if (el) {
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 2;
            el.scrollLeft = scrollLeft - walk;
          }
        }}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={`${item.slug}-${idx}`} className="shrink-0 w-[280px] sm:w-[300px]">
            {renderCard(item)}
          </div>
        ))}
      </div>
      
      {/* Fade Edges (Hidden on mobile) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 hidden sm:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 hidden sm:block" />

      {/* Navigation Arrows */}
      <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white text-slate-800 p-2.5 rounded-full shadow-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all hover:bg-slate-50 z-20 border border-slate-200">
        <ChevronLeft size={20} />
      </button>
      <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-slate-800 p-2.5 rounded-full shadow-lg opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all hover:bg-slate-50 z-20 border border-slate-200">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

export default function ExploreLocalities() {
  const [areas,   setAreas]   = useState<AreaSummary[]>([]);
  const [schemes, setSchemes] = useState<SchemeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blogs/taxonomy')
      .then(r => r.json())
      .then(d => { setAreas(d.areas ?? []); setSchemes(d.schemes ?? []); })
      .finally(() => setLoading(false));
  }, []);

  // Show skeletons while loading
  if (loading) {
    return (
      <section className="py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 space-y-16">
          <div className="space-y-4">
            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
            <div className="flex gap-5 overflow-hidden">
              {[...Array(5)].map((_, i) => <AreaCardSkeleton key={i} />)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-72 bg-slate-200 rounded animate-pulse" />
            <div className="flex gap-5 overflow-hidden">
              {[...Array(5)].map((_, i) => <SchemeCardSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (areas.length === 0 && schemes.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 space-y-24">

        {/* ── Explore Areas ── */}
        {areas.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-red-700 font-bold uppercase tracking-wider text-sm mb-2">Property Guides</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2e5a]">Explore Karachi Areas</h2>
              </div>
              <Link href="/blogs/areas" className="text-sm font-bold text-red-700 hover:text-red-800 hover:underline hidden sm:block">
                View All Areas →
              </Link>
            </div>
            
            <Carousel 
              items={areas} 
              autoPlaySpeed={0.8}
              renderCard={(area: AreaSummary) => (
                <Link href={`/blogs/areas/${area.slug}`} className="group block relative h-[380px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  {area.image ? (
                    <img src={area.image} alt={area.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                      <MapPin size={48} className="text-slate-400" />
                    </div>
                  )}
                  {/* Rich Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e3d]/90 via-[#0f1e3d]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                    <div className="transform transition-all duration-500 translate-y-9 group-hover:translate-y-0">
                      <h3 className="text-2xl font-bold text-white mb-2">{area.label}</h3>
                      {area.description && (
                        <p className="text-sm text-slate-200 line-clamp-2 mb-3">
                          {area.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="bg-red-700/90 text-white text-xs font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 backdrop-blur-sm">
                          <FileText size={12} /> {area.blogCount} Article{area.blogCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )} 
            />
            
            <div className="sm:hidden mt-6 text-center">
              <Link href="/blogs/areas" className="text-sm font-bold text-red-700 hover:underline">View All Areas →</Link>
            </div>
          </div>
        )}

        {/* ── Explore Housing Schemes ── */}
        {schemes.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-red-700 font-bold uppercase tracking-wider text-sm mb-2">Investment Guides</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a2e5a]">Housing Schemes in Karachi</h2>
              </div>
              <Link href="/blogs/schemes" className="text-sm font-bold text-red-700 hover:text-red-800 hover:underline hidden sm:block">
                View All Schemes →
              </Link>
            </div>
            
            <Carousel 
              items={schemes} 
              autoPlaySpeed={0.8}
              reverse={true} 
              renderCard={(scheme: SchemeSummary) => (
                <Link href={`/blogs/schemes/${scheme.slug}`} className="group block h-[220px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-1 relative">
                  {/* Banner Line */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-red-800 absolute top-0 left-0" />
                  
                  <div className="p-6 h-full flex flex-col items-center justify-center text-center gap-4">
                    {/* Logo Circle */}
                    <div className="w-20 h-20 rounded-full bg-slate-50 border-2 border-slate-100 p-3 flex items-center justify-center shadow-inner group-hover:border-red-200 transition-colors">
                      {scheme.logo ? (
                        <img src={scheme.logo} alt={scheme.label} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <Building2 size={32} className="text-slate-300" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-[#1a2e5a] line-clamp-1 group-hover:text-red-700 transition-colors">{scheme.label}</h3>
                      {scheme.areaLabel && (
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
                          <MapPin size={12} className="text-slate-400" /> {scheme.areaLabel}
                        </p>
                      )}
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-slate-100 text-slate-500 font-bold text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {scheme.blogCount} POVs
                    </div>
                  </div>
                </Link>
              )} 
            />
            
            <div className="sm:hidden mt-6 text-center">
              <Link href="/blogs/schemes" className="text-sm font-bold text-red-700 hover:underline">View All Schemes →</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}