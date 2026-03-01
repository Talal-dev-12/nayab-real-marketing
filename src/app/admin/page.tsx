'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Home, FileText, Users, MessageSquare, TrendingUp, Eye, Plus, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  defaultProperties, defaultBlogs, defaultAgents, defaultMessages,
  generateTrafficData, getFromStorage, saveToStorage, STORAGE_KEYS
} from '@/lib/data';
import { TrafficData } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ properties: 0, blogs: 0, agents: 0, messages: 0, unreadMessages: 0 });
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const properties = getFromStorage(STORAGE_KEYS.PROPERTIES, defaultProperties);
    const blogs = getFromStorage(STORAGE_KEYS.BLOGS, defaultBlogs);
    const agents = getFromStorage(STORAGE_KEYS.AGENTS, defaultAgents);
    const messages = getFromStorage(STORAGE_KEYS.MESSAGES, defaultMessages);
    
  let traffic: TrafficData[] = getFromStorage(
  STORAGE_KEYS.TRAFFIC,
  []
);

if (!traffic.length) {
  traffic = generateTrafficData();
  saveToStorage(STORAGE_KEYS.TRAFFIC, traffic);
}

    setStats({
      properties: properties.length,
      blogs: blogs.filter((b: any) => b.published).length,
      agents: agents.filter((a: any) => a.active).length,
      messages: messages.length,
      unreadMessages: messages.filter((m: any) => !m.read).length,
    });
    setTrafficData(traffic.slice(-14));

    const typeCount: Record<string, number> = {};
    properties.forEach((p: any) => {
      typeCount[p.type] = (typeCount[p.type] || 0) + 1;
    });
    setPropertyTypes(Object.entries(typeCount).map(([name, value]) => ({ name, value })));
    setRecentMessages(messages.slice(0, 5));
  }, []);

  const COLORS = ['#c0392b', '#1a2e5a', '#f39c12', '#27ae60'];

  const statCards = [
    { label: 'Total Properties', value: stats.properties, icon: Home, color: 'bg-blue-500', change: '+5%', up: true },
    { label: 'Published Blogs', value: stats.blogs, icon: FileText, color: 'bg-red-600', change: '+12%', up: true },
    { label: 'Active Agents', value: stats.agents, icon: Users, color: 'bg-emerald-500', change: '+2%', up: true },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageSquare, color: 'bg-amber-500', change: stats.unreadMessages > 0 ? 'New!' : '0 new', up: false },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ label, value, icon: Icon, color, change, up }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${color} w-14 h-14 rounded-xl flex items-center justify-center shrink-0`}>
              <Icon size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-sm">{label}</p>
              <p className="text-3xl font-extrabold text-[#1a2e5a]">{value}</p>
              <p className={`text-xs flex items-center gap-1 mt-1 ${up ? 'text-emerald-600' : 'text-amber-600'}`}>
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1a2e5a] text-lg">Website Traffic (Last 14 Days)</h2>
            <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full font-semibold">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c0392b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#c0392b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="visitors" stroke="#c0392b" fill="url(#colorVisitors)" strokeWidth={2} name="Visitors" />
              <Area type="monotone" dataKey="pageViews" stroke="#1a2e5a" fill="none" strokeWidth={2} strokeDasharray="4 4" name="Page Views" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Property Type Pie */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-[#1a2e5a] text-lg mb-4">Property Types</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={propertyTypes} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name">
                {propertyTypes.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions + Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-[#1a2e5a] text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Blog Post', href: '/admin/blogs/new', icon: FileText, color: 'bg-red-700' },
              { label: 'Add Property', href: '/admin/properties/new', icon: Home, color: 'bg-[#1a2e5a]' },
              { label: 'Add Agent', href: '/admin/agents/new', icon: Users, color: 'bg-emerald-600' },
              { label: 'View Analytics', href: '/admin/analytics', icon: TrendingUp, color: 'bg-amber-500' },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className={`${color} hover:opacity-90 text-white rounded-xl p-4 flex items-center gap-3 transition-opacity`}
              >
                <Icon size={20} />
                <span className="font-semibold text-sm">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1a2e5a] text-lg">Recent Messages</h2>
            <Link href="/admin/messages" className="text-red-700 text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg: any) => (
              <div key={msg.id} className={`flex items-start gap-3 p-3 rounded-lg ${msg.read ? 'bg-gray-50' : 'bg-red-50'}`}>
                <div className="w-8 h-8 bg-[#1a2e5a] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {msg.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1a2e5a] truncate">{msg.name}</p>
                  <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                </div>
                {!msg.read && <span className="w-2 h-2 bg-red-600 rounded-full mt-1.5 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
