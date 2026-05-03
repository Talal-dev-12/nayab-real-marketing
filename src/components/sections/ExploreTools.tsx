'use client';
import Link from 'next/link';
import { Calculator, Landmark, ArrowLeftRight, TrendingUp, Map, BarChart3, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

const tools = [
  {
    title: 'Construction Cost',
    desc: 'Estimate your build cost instantly',
    href: '/tools/construction-calculator',
    icon: Calculator,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    borderHover: 'hover:border-blue-500/30',
  },
  {
    title: 'Home Loan',
    desc: 'Find affordable loan packages',
    href: '/tools/loan-calculator',
    icon: Landmark,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    borderHover: 'hover:border-emerald-500/30',
  },
  {
    title: 'Area Converter',
    desc: 'Convert Marla, Kanal, Sqft easily',
    href: '/tools/area-converter',
    icon: ArrowLeftRight,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    borderHover: 'hover:border-violet-500/30',
  },
  {
    title: 'Property Trends',
    desc: 'Track price changes in Pakistan',
    href: '/tools/property-trends',
    icon: TrendingUp,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    borderHover: 'hover:border-rose-500/30',
  },
  {
    title: 'Plot Finder',
    desc: 'Find plots in top housing societies',
    href: '/properties?type=plot',
    icon: Map,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    borderHover: 'hover:border-teal-500/30',
  },
  {
    title: 'Property Index',
    desc: 'Compare property prices across cities',
    href: '/tools/property-index',
    icon: BarChart3,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    borderHover: 'hover:border-amber-500/30',
  },
  {
    title: 'New Projects',
    desc: 'Best investment opportunities',
    href: '/properties?status=available&featured=true',
    icon: Sparkles,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    borderHover: 'hover:border-orange-500/30',
  },
  {
    title: 'Area Guides',
    desc: 'Explore housing societies in depth',
    href: '/blog?category=Market+Analysis',
    icon: BookOpen,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    borderHover: 'hover:border-indigo-500/30',
  },
];

export default function ExploreTools() {
  return (
    <section className="py-12 md:py-16 bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1a2e5a] leading-tight">
              Calculate, Compare & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">
                Make Smarter Decisions
              </span>
            </h2>
          </div>
          <p className="text-slate-500 text-lg leading-relaxed md:max-w-md md:text-right">
            Empower your investment journey with our suite of free, professional-grade real estate tools.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <Link
                key={i}
                href={tool.href}
                className={`
                  group relative flex flex-col p-6 sm:p-8
                  bg-white rounded-3xl border-2 border-transparent
                  shadow-[0_4px_20px_rgb(0,0,0,0.03)]
                  transition-all duration-300 ease-out
                  hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                  hover:-translate-y-1
                  ${tool.borderHover}
                `}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>

                {/* Top row: Icon + Arrow */}
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className={`w-14 h-14 ${tool.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className={`w-7 h-7 ${tool.color}`} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#1a2e5a] transition-colors duration-300 shrink-0">
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:-rotate-45 transition-all duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-auto">
                  <h3 className="text-xl font-bold text-[#1a2e5a] mb-2 group-hover:text-red-700 transition-colors duration-300">
                    {tool.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}