'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { TrendingUp, Users, Eye, MessageSquare, ArrowUpRight, RefreshCw, FileText, Home } from 'lucide-react';
import { api } from '@/lib/api-client';

interface AnalyticsData {
  traffic: { date: string; visitors: number; pageViews: number; messages: number; bounceRate: number }[];
  topBlogs: { _id: string; title: string; views: number; category: string }[];
  topProperties: { _id: string; title: string; views: number; city: string; type: string }[];
  propertyTypes: { name: string; value: number }[];
  blogCategories: { name: string; value: number }[];
  summary: {
    totalBlogs: number; totalProperties: number; totalAgents: number;
    totalViews: number; messagesInPeriod: number; unreadMessages: number; totalMessages: number;
  };
}

const COLORS = ['#c0392b', '#1a2e5a', '#f39c12', '#27ae60', '#8e44ad', '#16a085'];

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<7 | 14 | 30>(30);

  const fetchData = useCallback(async (p = period) => {
    setRefreshing(true);
    try {
      const res = await api.get<AnalyticsData>(`/api/analytics?days=${p}`);
      setData(res);
    } catch (e) {
      console.error('Failed to load analytics', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => { fetchData(period); }, [period]);

  if (loading) return (
    <div className="flex items-center justify-center h-80">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Loading analytics from database...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="text-center py-20 text-slate-400">Failed to load analytics. Check your database connection.</div>
  );

  const { traffic, topBlogs, topProperties, propertyTypes, blogCategories, summary } = data;
  const periodData = traffic.slice(-period);
  const totalVisitors = periodData.reduce((s, d) => s + d.visitors, 0);
  const totalPageViews = periodData.reduce((s, d) => s + d.pageViews, 0);
  const avgBounce = periodData.length
    ? Math.round(periodData.reduce((s, d) => s + d.bounceRate, 0) / periodData.length)
    : 0;

  const kpis = [
    { label: 'Total Visitors', value: totalVisitors.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: `${period} days` },
    { label: 'Page Views', value: totalPageViews.toLocaleString(), icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: `${period} days` },
    { label: 'Content Views', value: summary.totalViews.toLocaleString(), icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50', sub: 'blogs + properties' },
    { label: 'New Messages', value: summary.messagesInPeriod.toLocaleString(), icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50', sub: `${summary.unreadMessages} unread` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Analytics</h2>
          <p className="text-slate-500 text-sm">Real-time data from your MongoDB database</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchData(period)} disabled={refreshing}
            className="p-2 rounded-lg border hover:bg-white transition-colors text-slate-500 disabled:opacity-50">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          {([7, 14, 30] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${period === p ? 'bg-red-700 text-white' : 'bg-white text-slate-600 hover:bg-gray-100 border'}`}>
              {p}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-500 text-sm font-medium">{label}</p>
              <div className={`${bg} p-2 rounded-lg`}><Icon size={16} className={color} /></div>
            </div>
            <p className="text-3xl font-extrabold text-[#1a2e5a]">{value}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <ArrowUpRight size={11} className="text-emerald-500" /> {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Published Blogs', value: summary.totalBlogs, icon: FileText },
          { label: 'Properties', value: summary.totalProperties, icon: Home },
          { label: 'Active Agents', value: summary.totalAgents, icon: Users },
          { label: 'Total Messages', value: summary.totalMessages, icon: MessageSquare },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <Icon size={18} className="text-red-700 shrink-0" />
            <div><p className="text-xs text-slate-500">{label}</p><p className="text-xl font-extrabold text-[#1a2e5a]">{value}</p></div>
          </div>
        ))}
      </div>

      {/* Visitors & Page Views */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-[#1a2e5a] mb-1">Visitors & Page Views</h3>
        <p className="text-xs text-slate-400 mb-5">Derived from real content views + contact submissions in your database</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={periodData}>
            <defs>
              <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c0392b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#c0392b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gpv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a2e5a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1a2e5a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip labelFormatter={v => `Date: ${v}`} />
            <Legend />
            <Area type="monotone" dataKey="visitors" stroke="#c0392b" fill="url(#gv)" strokeWidth={2} name="Visitors" />
            <Area type="monotone" dataKey="pageViews" stroke="#1a2e5a" fill="url(#gpv)" strokeWidth={2} name="Page Views" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Messages per day */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-[#1a2e5a] mb-1">Messages Per Day</h3>
          <p className="text-xs text-slate-400 mb-4">Real contact form submissions</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={periodData.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="messages" fill="#c0392b" name="Messages" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property types */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-[#1a2e5a] mb-1">Property Types</h3>
          <p className="text-xs text-slate-400 mb-4">Breakdown of your listings</p>
          {propertyTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={propertyTypes} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {propertyTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">No properties yet</div>
          )}
        </div>

        {/* Blog categories */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-[#1a2e5a] mb-1">Blog Categories</h3>
          <p className="text-xs text-slate-400 mb-4">Published article breakdown</p>
          {blogCategories.length > 0 ? (
            <div className="space-y-2.5 mt-2">
              {blogCategories.map(({ name, value }, i) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-600 flex-1 truncate">{name}</span>
                  <div className="h-1.5 bg-slate-100 rounded-full w-20">
                    <div className="h-1.5 rounded-full" style={{ width: `${(value / Math.max(...blogCategories.map(b => b.value))) * 100}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 w-4">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">No blogs yet</div>
          )}
        </div>
      </div>

      {/* Top Blogs */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-[#1a2e5a] mb-4">Top Blog Posts by Views</h3>
        {topBlogs.length > 0 ? (
          <div className="space-y-3">
            {topBlogs.map((blog, i) => (
              <div key={blog._id} className="flex items-center gap-3">
                <span className="w-7 h-7 bg-red-700 rounded-full text-white text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a2e5a] truncate">{blog.title}</p>
                  <span className="text-xs text-slate-400">{blog.category}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="h-1.5 bg-slate-100 rounded-full w-24 mb-1">
                    <div className="h-1.5 bg-red-600 rounded-full"
                      style={{ width: `${Math.min(100, ((blog.views || 0) / Math.max(topBlogs[0]?.views || 1, 1)) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{blog.views} views</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">No published blogs yet. Create your first blog post!</p>
        )}
      </div>

      {/* Top Properties */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-[#1a2e5a] mb-4">Top Viewed Properties</h3>
        {topProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 rounded-lg">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">City</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProperties.map((p, i) => (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-500 font-semibold">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-[#1a2e5a] max-w-xs truncate">{p.title}</td>
                    <td className="px-4 py-3 text-slate-500">{p.city}</td>
                    <td className="px-4 py-3"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold capitalize">{p.type}</span></td>
                    <td className="px-4 py-3 font-bold text-[#1a2e5a]">{p.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-8">No properties yet. Add your first property listing!</p>
        )}
      </div>
    </div>
  );
}
