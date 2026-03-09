'use client';
import Link from 'next/link';
import { useState } from 'react';

const tools = [
  {
    title: 'Construction\nCost Calculator',
    desc: 'Estimate your build cost instantly',
    href: '/tools/construction-calculator',
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-100',
    color: 'text-sky-500',
    hoverBorder: 'hover:border-sky-300',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <rect x="8" y="8" width="48" height="48" rx="8" fill="currentColor" opacity="0.15"/>
        <path d="M16 48 L16 24 L32 12 L48 24 L48 48 Z" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round"/>
        <rect x="24" y="34" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M28 34 V30 Q32 26 36 30 V34" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Home Loan\nCalculator',
    desc: 'Find affordable loan packages',
    href: '/tools/loan-calculator',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    color: 'text-emerald-500',
    hoverBorder: 'hover:border-emerald-300',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <rect x="10" y="10" width="44" height="44" rx="6" stroke="currentColor" strokeWidth="3" fill="none"/>
        <rect x="16" y="28" width="10" height="8" rx="1.5" fill="currentColor" opacity="0.4"/>
        <rect x="29" y="22" width="10" height="14" rx="1.5" fill="currentColor" opacity="0.6"/>
        <rect x="42" y="16" width="6" height="20" rx="1.5" fill="currentColor"/>
        <path d="M14 42 L50 42" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
        <path d="M16 18 L24 18 M28 18 L36 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Area Unit\nConverter',
    desc: 'Convert Marla, Kanal, Sqft instantly',
    href: '/tools/area-converter',
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    color: 'text-violet-500',
    hoverBorder: 'hover:border-violet-300',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <rect x="8" y="8" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>
        <rect x="34" y="8" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>
        <rect x="8" y="34" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>
        <rect x="34" y="34" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="3" fill="none"/>
        <path d="M30 19 L34 19 M30 45 L34 45 M19 30 L19 34 M45 30 L45 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Property\nTrends',
    desc: 'Track price changes in Pakistan',
    href: '/tools/property-trends',
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    color: 'text-rose-500',
    hoverBorder: 'hover:border-rose-300',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <path d="M10 48 L22 32 L32 38 L46 20 L54 26" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M46 20 L54 20 L54 28" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M10 52 L54 52" stroke="currentColor" strokeWidth="2" opacity="0.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Plot\nFinder',
    desc: 'Find plots in any housing society',
    href: '/properties?type=plot',
    bg: 'bg-teal-50',
    iconBg: 'bg-teal-100',
    color: 'text-teal-500',
    hoverBorder: 'hover:border-teal-300',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <path d="M32 8 C20 8 12 18 12 28 C12 42 32 56 32 56 C32 56 52 42 52 28 C52 18 44 8 32 8Z" stroke="currentColor" strokeWidth="3" fill="none"/>
        <circle cx="32" cy="28" r="7" fill="currentColor" opacity="0.4"/>
        <circle cx="32" cy="28" r="3" fill="currentColor"/>
      </svg>
    ),
  },
  {
    title: 'Property\nIndex',
    desc: 'Compare prices across cities',
    href: '/tools/property-index',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    color: 'text-amber-500',
    hoverBorder: 'hover:border-amber-300',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <path d="M12 48 L12 30 L24 22 L24 48" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none"/>
        <path d="M24 48 L24 18 L36 10 L36 48" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none"/>
        <path d="M36 48 L36 24 L48 16 L48 48" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none"/>
        <path d="M8 48 L56 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'New\nProjects',
    desc: 'Best investment opportunities',
    href: '/properties?status=available&featured=true',
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    color: 'text-orange-500',
    hoverBorder: 'hover:border-orange-300',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <path d="M32 8 L56 24 L56 56 L8 56 L8 24 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none"/>
        <rect x="22" y="38" width="10" height="18" rx="1" fill="currentColor" opacity="0.4"/>
        <rect x="36" y="30" width="10" height="26" rx="1" fill="currentColor" opacity="0.6"/>
        <path d="M20 8 L32 2 L44 8" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        <line x1="32" y1="2" x2="32" y2="8" stroke="currentColor" strokeWidth="2.5"/>
      </svg>
    ),
  },
  {
    title: 'Area\nGuides',
    desc: 'Explore housing societies in Pakistan',
    href: '/blog?category=Market+Analysis',
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    color: 'text-indigo-500',
    hoverBorder: 'hover:border-indigo-300',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <circle cx="28" cy="28" r="16" stroke="currentColor" strokeWidth="3" fill="none"/>
        <path d="M40 40 L54 54" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx="28" cy="28" r="6" fill="currentColor" opacity="0.3"/>
        <path d="M20 28 L36 28 M28 20 L28 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
];

export default function ExploreTools() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Explore More on Nayab Real</h2>
          <p className="text-slate-500 text-sm mt-1">Tools and resources to help you make smarter property decisions</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <Link
              key={i}
              href={tool.href}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`group flex items-center gap-4 p-4 rounded-2xl border-2 border-transparent bg-white shadow-sm transition-all duration-200 ${tool.hoverBorder} hover:shadow-md hover:-translate-y-0.5`}
            >
              {/* Icon box */}
              <div className={`${tool.iconBg} ${tool.color} rounded-xl p-3 shrink-0 transition-transform duration-200 ${hovered === i ? 'scale-110' : ''}`}>
                {tool.icon}
              </div>

              {/* Text */}
              <div className="min-w-0">
                <h3 className="font-bold text-[#1a2e5a] text-sm leading-snug whitespace-pre-line group-hover:text-red-700 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5 leading-snug">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}