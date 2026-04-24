'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, LineChart, Activity, MapPin } from 'lucide-react';

const trendData = [
  { month: 'Jan 24', karachi: 14200, lahore: 12800, islamabad: 18500 },
  { month: 'Feb 24', karachi: 14500, lahore: 13100, islamabad: 18900 },
  { month: 'Mar 24', karachi: 14800, lahore: 13400, islamabad: 19200 },
  { month: 'Apr 24', karachi: 15100, lahore: 13600, islamabad: 19800 },
  { month: 'May 24', karachi: 15400, lahore: 14000, islamabad: 20200 },
  { month: 'Jun 24', karachi: 15800, lahore: 14300, islamabad: 20800 },
  { month: 'Jul 24', karachi: 16200, lahore: 14700, islamabad: 21300 },
  { month: 'Aug 24', karachi: 16600, lahore: 15100, islamabad: 21900 },
  { month: 'Sep 24', karachi: 17000, lahore: 15500, islamabad: 22400 },
  { month: 'Oct 24', karachi: 17500, lahore: 15900, islamabad: 23000 },
  { month: 'Nov 24', karachi: 17900, lahore: 16400, islamabad: 23500 },
  { month: 'Dec 24', karachi: 18200, lahore: 16800, islamabad: 24200 },
];

const cities = [
  { key: 'karachi', label: 'Karachi', color: '#f43f5e', change: '+28.2%', up: true },
  { key: 'lahore', label: 'Lahore', color: '#1a2e5a', change: '+31.3%', up: true },
  { key: 'islamabad', label: 'Islamabad', color: '#10b981', change: '+30.8%', up: true },
];

export default function PropertyTrends() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="primary-gradient py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide border border-white/30 backdrop-blur-sm">
            <Activity size={14} /> Market Data
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Pakistan Property Price Trends
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            Interactive analysis of average property prices per square foot across major cities in Pakistan for 2024-2025.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cities.map(c => (
            <div key={c.key} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col justify-center items-center text-center transform transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} color={c.color} />
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">{c.label}</p>
              </div>
              <p className="text-3xl font-extrabold text-[#1a2e5a] mb-2">
                PKR {trendData[trendData.length - 1][c.key as keyof typeof trendData[0]].toLocaleString()}
                <span className="text-sm font-semibold text-slate-400">/sqft</span>
              </p>
              <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${c.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {c.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {c.change} YTD Growth
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
              <LineChart size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-[#1a2e5a] text-xl">Price Per Sqft Evolution</h3>
              <p className="text-sm text-slate-500">Jan to Dec 2024</p>
            </div>
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {cities.map(c => (
                    <linearGradient key={c.key} id={`g-${c.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={c.color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={c.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value: number) => [`PKR ${value.toLocaleString()}`, 'Price/sqft']} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 600, fontSize: '14px' }} />
                {cities.map(c => (
                  <Area key={c.key} type="monotone" dataKey={c.key} stroke={c.color} fill={`url(#g-${c.key})`} strokeWidth={3} name={c.label} activeDot={{ r: 6, strokeWidth: 0 }} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs font-medium text-slate-400 mt-6 text-center bg-slate-50 py-3 rounded-lg border border-slate-100">
            * Data is indicative and based on aggregate market averages. Actual transaction prices may vary depending on exact location, property condition, and market volatility.
          </p>
        </div>

        {/* Market Analysis Commentary */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
          <h3 className="font-extrabold text-[#1a2e5a] text-xl mb-6 pb-4 border-b border-slate-100">Market Analysis & Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Islamabad: Consistent Premium Growth
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Islamabad continues to command the highest per-square-foot prices, driven by high demand in established sectors (F and E series) and secure gated communities like DHA Islamabad. The city's status as the capital ensures steady foreign remittances and investment from overseas Pakistanis.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1a2e5a]"></span>
                Lahore: The Hub of Infrastructure
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Lahore showed the most aggressive YTD growth (+31.3%). Rapid expansion of the Ring Road and massive infrastructural developments in areas like DHA Phase 6 to 9 and Bahria Town have catalyzed sharp price appreciations, making it the most active trading market in 2024.
              </p>
            </div>

            <div className="space-y-4 md:col-span-2 border-t border-slate-100 pt-6 mt-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Karachi: Steady Commercial Expansion
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                While Karachi's growth (+28.2%) is slightly lower in percentage terms compared to Lahore, its sheer volume of transactions remains unparalleled. Areas like DHA Phase 8, Clifton, and Scheme 33 continue to see steady residential appreciation, while the commercial sector remains the strongest in the country due to the city's status as Pakistan's economic backbone.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}