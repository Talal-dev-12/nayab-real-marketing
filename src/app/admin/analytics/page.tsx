'use client';
import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { TrendingUp, Users, Eye, MousePointer, ArrowUpRight } from 'lucide-react';
import { getFromStorage, saveToStorage, STORAGE_KEYS, generateTrafficData, defaultBlogs, defaultProperties } from '@/lib/data';
import { TrafficData } from '@/src/types';

export default function AdminAnalytics() {
  const [traffic, setTraffic] = useState<any[]>([]);
  const [topBlogs, setTopBlogs] = useState<any[]>([]);
  const [topProperties, setTopProperties] = useState<any[]>([]);
  const [period, setPeriod] = useState<7 | 14 | 30>(30);

  useEffect(() => {
   let data: TrafficData[] = getFromStorage(
  STORAGE_KEYS.TRAFFIC,
  []
);
    setTraffic(data);
    
    const blogs = getFromStorage(STORAGE_KEYS.BLOGS, defaultBlogs);
    setTopBlogs([...blogs].sort((a: any, b: any) => b.views - a.views).slice(0, 5));
    
    const props = getFromStorage(STORAGE_KEYS.PROPERTIES, defaultProperties);
    setTopProperties([...props].sort((a: any, b: any) => b.views - a.views).slice(0, 5));
  }, []);

  const periodData = traffic.slice(-period);
  const totalVisitors = periodData.reduce((s: number, d: any) => s + d.visitors, 0);
  const totalPageViews = periodData.reduce((s: number, d: any) => s + d.pageViews, 0);
  const avgBounce = periodData.length ? Math.round(periodData.reduce((s: number, d: any) => s + d.bounceRate, 0) / periodData.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Analytics</h2>
          <p className="text-slate-500 text-sm">Track your website performance</p>
        </div>
        <div className="flex gap-2">
          {([7, 14, 30] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                period === p ? 'bg-red-700 text-white' : 'bg-white text-slate-600 hover:bg-gray-100'
              }`}
            >
              {p}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Visitors', value: totalVisitors.toLocaleString(), icon: Users, change: '+8.2%', color: 'text-blue-600' },
          { label: 'Page Views', value: totalPageViews.toLocaleString(), icon: Eye, change: '+12.4%', color: 'text-emerald-600' },
          { label: 'Avg. Bounce Rate', value: `${avgBounce}%`, icon: MousePointer, change: '-2.1%', color: 'text-amber-600' },
          { label: 'Avg. Daily Visitors', value: Math.round(totalVisitors / period).toLocaleString(), icon: TrendingUp, change: '+5.7%', color: 'text-red-600' },
        ].map(({ label, value, icon: Icon, change, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 text-sm">{label}</p>
              <Icon size={18} className={color} />
            </div>
            <p className="text-3xl font-extrabold text-[#1a2e5a]">{value}</p>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <ArrowUpRight size={12} /> {change} vs previous period
            </p>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-[#1a2e5a] mb-4">Visitors & Page Views ({period} days)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={periodData}>
            <defs>
              <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c0392b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#c0392b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a2e5a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1a2e5a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="visitors" stroke="#c0392b" fill="url(#v)" strokeWidth={2} name="Visitors" />
            <Area type="monotone" dataKey="pageViews" stroke="#1a2e5a" fill="url(#pv)" strokeWidth={2} name="Page Views" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bounce Rate Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-[#1a2e5a] mb-4">Bounce Rate Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={periodData.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Line type="monotone" dataKey="bounceRate" stroke="#f39c12" strokeWidth={2} dot={false} name="Bounce Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Blog Posts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-[#1a2e5a] mb-4">Top Blog Posts</h3>
          <div className="space-y-3">
            {topBlogs.map((blog: any, i) => (
              <div key={blog.id} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-red-700 rounded-full text-white text-xs flex items-center justify-center font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a2e5a] truncate">{blog.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 bg-gray-100 rounded-full flex-1">
                      <div
                        className="h-1.5 bg-red-600 rounded-full"
                        style={{ width: `${Math.min(100, (blog.views / (topBlogs[0]?.views || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">{blog.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Properties */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-[#1a2e5a] mb-4">Top Viewed Properties</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 rounded-lg">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProperties.map((p: any, i) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500 font-semibold">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-[#1a2e5a]">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">{p.city}</td>
                  <td className="px-4 py-3"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold capitalize">{p.type}</span></td>
                  <td className="px-4 py-3 text-slate-700 font-semibold">{p.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
