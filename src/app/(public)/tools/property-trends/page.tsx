'use client';
import { useEffect, useState } from 'react';
   
  
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
  { key: 'karachi', label: 'Karachi', color: '#c0392b', change: '+28.2%', up: true },
  { key: 'lahore', label: 'Lahore', color: '#1a2e5a', change: '+31.3%', up: true },
  { key: 'islamabad', label: 'Islamabad', color: '#27ae60', change: '+30.8%', up: true },
];

export default function PropertyTrends() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <span className="inline-block bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Market Data</span>
          <h1 className="text-3xl font-extrabold text-[#1a2e5a]">Pakistan Property Price Trends</h1>
          <p className="text-slate-500 mt-2">Average price per sqft across major cities — 2024</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {cities.map(c => (
            <div key={c.key} className="bg-white rounded-2xl shadow-sm p-5 text-center">
              <p className="text-slate-500 text-sm">{c.label}</p>
              <p className="text-2xl font-extrabold text-[#1a2e5a] mt-1">PKR {trendData[trendData.length - 1][c.key as keyof typeof trendData[0]].toLocaleString()}<span className="text-xs font-normal text-slate-400">/sqft</span></p>
              <div className={`flex items-center justify-center gap-1 mt-1 text-sm font-bold ${c.up ? 'text-emerald-600' : 'text-red-600'}`}>
                {c.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {c.change} YTD
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-[#1a2e5a] mb-5">Price Per Sqft — Jan to Dec 2024</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                {cities.map(c => (
                  <linearGradient key={c.key} id={`g-${c.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={c.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v.toLocaleString()}`} />
              <Tooltip formatter={(v: any) => `PKR ${v.toLocaleString()}/sqft`} />
              <Legend />
              {cities.map(c => (
                <Area key={c.key} type="monotone" dataKey={c.key} stroke={c.color} fill={`url(#g-${c.key})`} strokeWidth={2} name={c.label} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-400 mt-4 text-center">* Data is indicative based on market averages. Actual prices vary by area and property type.</p>
        </div>
      </div>
    </div>
  );
}