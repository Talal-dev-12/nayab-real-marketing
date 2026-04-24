'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Map, BarChart2, TrendingUp, Lightbulb, ChevronRight } from 'lucide-react';

const data = [
  { area: 'E-7, Islamabad', avgPrice: 155000, type: 'Residential', city: 'Islamabad' },
  { area: 'F-7, Islamabad', avgPrice: 130000, type: 'Residential', city: 'Islamabad' },
  { area: 'DHA Phase 8, Karachi', avgPrice: 110000, type: 'Residential', city: 'Karachi' },
  { area: 'DHA Phase 6, Lahore', avgPrice: 95000, type: 'Residential', city: 'Lahore' },
  { area: 'Clifton, Karachi', avgPrice: 88000, type: 'Residential', city: 'Karachi' },
  { area: 'Bahria Town, Islamabad', avgPrice: 82000, type: 'Residential', city: 'Islamabad' },
  { area: 'DHA Phase 5, Lahore', avgPrice: 78000, type: 'Residential', city: 'Lahore' },
  { area: 'Gulshan-e-Iqbal, Karachi', avgPrice: 65000, type: 'Residential', city: 'Karachi' },
  { area: 'Bahria Town, Lahore', avgPrice: 58000, type: 'Residential', city: 'Lahore' },
  { area: 'Johar Town, Lahore', avgPrice: 52000, type: 'Residential', city: 'Lahore' },
];

const COLORS = ['#10b981', '#34d399', '#f43f5e', '#1a2e5a', '#fb7185', '#6ee7b7', '#3b82f6', '#fca5a5', '#60a5fa', '#93c5fd'];
const maxPrice = Math.max(...data.map(d => d.avgPrice));

export default function PropertyIndex() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="primary-gradient py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide border border-white/30 backdrop-blur-sm">
            <Map size={14} /> Market Rates
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Property Price Index
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            Comprehensive benchmarking of average property prices per square foot across Pakistan's most sought-after housing societies and sectors.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        
        {/* Executive Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Lightbulb size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-[#1a2e5a] text-lg mb-2">Executive Summary — Q2 2024</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              The property index reveals that Islamabad's premium sectors (E-7, F-7) remain the most expensive real estate in the country, largely due to extremely limited supply and high security. Karachi's DHA Phase 8 leads the southern market, acting as a highly liquid asset class for overseas investors. Meanwhile, Lahore's DHA Phase 6 represents the sweet spot for modern infrastructure and rapid capital appreciation.
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                <TrendingUp size={14} /> Peak Area: E-7 Islamabad (155k/sqft)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                <BarChart2 size={14} /> Most Liquid: DHA Karachi & Lahore
              </span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
              <BarChart2 size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-[#1a2e5a] text-xl">Average Price Per Sq. Ft</h3>
              <p className="text-sm text-slate-500">Top 10 Tier-1 Locations</p>
            </div>
          </div>
          
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="area" tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 600 }} width={160} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(v: any) => [`PKR ${v.toLocaleString()}/sqft`, 'Average Price']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                />
                <Bar dataKey="avgPrice" radius={[0, 8, 8, 0]} barSize={24}>
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-extrabold text-[#1a2e5a] text-lg">Detailed Market Index</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sorted by Price</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Housing Area / Scheme</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">City</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Price/sqft</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Market Index Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[...data].sort((a, b) => b.avgPrice - a.avgPrice).map((row) => (
                  <tr key={row.area} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#1a2e5a] flex items-center gap-2">
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-red-500 transition-colors" /> {row.area}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${row.city === 'Karachi' ? 'bg-rose-50 text-rose-700' : row.city === 'Lahore' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {row.city}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-[#1a2e5a]">PKR {row.avgPrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 bg-slate-100 rounded-full w-24 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${row.city === 'Karachi' ? 'bg-rose-500' : row.city === 'Lahore' ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${(row.avgPrice / maxPrice) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-8">{Math.round((row.avgPrice / maxPrice) * 100)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              * The Market Index Score normalizes prices against the highest recorded area ({maxPrice.toLocaleString()} PKR/sqft = 100 score). Prices are indicative averages and subject to market volatility.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
