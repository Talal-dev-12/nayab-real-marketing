'use client';

import { useState } from 'react';
import { Eye, Users, TrendingUp, Clock, Globe, Monitor, Smartphone, Tablet } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  day: `Nov ${i + 1}`,
  visitors: Math.floor(800 + Math.random() * 1200),
  pageviews: Math.floor(2000 + Math.random() * 3000),
  bounceRate: Math.floor(35 + Math.random() * 25),
}));

const topPages = [
  { page: '/properties', views: 8420, percentage: 28 },
  { page: '/', views: 6230, percentage: 21 },
  { page: '/blog', views: 4180, percentage: 14 },
  { page: '/contact', views: 2940, percentage: 10 },
  { page: '/about', views: 2100, percentage: 7 },
];

const topCities = [
  { city: 'Karachi', visitors: 12400, color: '#CC0000' },
  { city: 'Lahore', visitors: 8200, color: '#0A1628' },
  { city: 'Islamabad', visitors: 5600, color: '#C9A84C' },
  { city: 'Rawalpindi', visitors: 3200, color: '#6B7280' },
  { city: 'Faisalabad', visitors: 2100, color: '#10B981' },
];

const deviceData = [
  { name: 'Mobile', value: 62, color: '#CC0000' },
  { name: 'Desktop', value: 30, color: '#0A1628' },
  { name: 'Tablet', value: 8, color: '#C9A84C' },
];

const trafficSources = [
  { source: 'Organic Search', visitors: 14200, percentage: 47 },
  { source: 'Direct', visitors: 8400, percentage: 28 },
  { source: 'Social Media', visitors: 4200, percentage: 14 },
  { source: 'Referral', visitors: 2100, percentage: 7 },
  { source: 'Email', visitors: 1100, percentage: 4 },
];

export default function AdminTrafficPage() {
  const [period, setPeriod] = useState('30d');

  const summaryStats = [
    { label: 'Total Visitors', value: '34,820', change: '+18%', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Page Views', value: '98,400', change: '+22%', icon: Eye, color: 'bg-green-50 text-green-600' },
    { label: 'Avg. Session', value: '3m 42s', change: '+8%', icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Bounce Rate', value: '42%', change: '-5%', icon: TrendingUp, color: 'bg-red-50 text-primary' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-navy">Analytics & Traffic</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor your website performance and visitor insights</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white text-navy"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 3 Months</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <div className="font-heading text-2xl font-bold text-navy">{stat.value}</div>
            <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
            <div className={`text-xs font-semibold mt-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change} vs last period
            </div>
          </div>
        ))}
      </div>

      {/* Main Traffic Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading font-bold text-navy text-lg">Visitor Trend</h3>
            <p className="text-gray-400 text-xs">Daily visitors and page views for the last 30 days</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={dailyData.slice(-14)}>
            <defs>
              <linearGradient id="gVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#CC0000" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#CC0000" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gPageviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A1628" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0A1628" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Area type="monotone" dataKey="visitors" stroke="#CC0000" strokeWidth={2.5} fill="url(#gVisitors)" name="Visitors" />
            <Area type="monotone" dataKey="pageviews" stroke="#0A1628" strokeWidth={2.5} fill="url(#gPageviews)" name="Page Views" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Three columns */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Top Pages */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-heading font-bold text-navy text-lg mb-5">Top Pages</h3>
          <div className="space-y-4">
            {topPages.map((page) => (
              <div key={page.page}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-mono text-xs">{page.page}</span>
                  <span className="font-semibold text-navy text-xs">{page.views.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${page.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-heading font-bold text-navy text-lg mb-5">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {deviceData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-3">
            {deviceData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    {d.name === 'Mobile' && <Smartphone size={13} />}
                    {d.name === 'Desktop' && <Monitor size={13} />}
                    {d.name === 'Tablet' && <Tablet size={13} />}
                    {d.name}
                  </span>
                </div>
                <span className="font-bold text-navy text-sm">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-heading font-bold text-navy text-lg mb-5">Traffic Sources</h3>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 text-xs">{source.source}</span>
                  <span className="font-semibold text-navy text-xs">{source.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-navy h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Cities */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-heading font-bold text-navy text-lg mb-6 flex items-center gap-2">
          <Globe size={18} /> Top Cities
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={topCities} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
            <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
            <Bar dataKey="visitors" name="Visitors" radius={[6, 6, 0, 0]}>
              {topCities.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
