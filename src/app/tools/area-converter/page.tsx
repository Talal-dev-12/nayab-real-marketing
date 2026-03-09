'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const units = [
  { key: 'marla', label: 'Marla', toSqft: 272.25 },
  { key: 'kanal', label: 'Kanal', toSqft: 5445 },
  { key: 'sqft', label: 'Square Feet', toSqft: 1 },
  { key: 'sqyd', label: 'Square Yard', toSqft: 9 },
  { key: 'sqm', label: 'Square Meter', toSqft: 10.764 },
  { key: 'acre', label: 'Acre', toSqft: 43560 },
  { key: 'hectare', label: 'Hectare', toSqft: 107639 },
];

export default function AreaConverter() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('marla');

  const sqft = (parseFloat(value) || 0) * (units.find(u => u.key === from)?.toSqft || 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <span className="inline-block bg-violet-100 text-violet-600 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Free Tool</span>
          <h1 className="text-3xl font-extrabold text-[#1a2e5a]">Area Unit Converter</h1>
          <p className="text-slate-500 mt-2">Convert between Marla, Kanal, Sq. Ft and more — instantly</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Enter Value</label>
              <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. 5"
                className="w-full border-2 rounded-xl px-4 py-3 text-xl font-bold outline-none focus:border-violet-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">From Unit</label>
              <select value={from} onChange={e => setFrom(e.target.value)} className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400">
                {units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
              </select>
            </div>
          </div>

          {value && (
            <div className="grid grid-cols-1 gap-3 pt-2">
              {units.filter(u => u.key !== from).map(u => (
                <div key={u.key} className="flex items-center justify-between bg-violet-50 rounded-xl px-5 py-3.5 border border-violet-100">
                  <span className="text-slate-600 font-medium text-sm">{u.label}</span>
                  <span className="font-extrabold text-[#1a2e5a] text-lg">{(sqft / u.toSqft).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                </div>
              ))}
            </div>
          )}
          {!value && (
            <div className="text-center py-8 text-slate-300 text-sm">Enter a value above to see conversions</div>
          )}
        </div>

        {/* Reference table */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-5">
          <h3 className="font-bold text-[#1a2e5a] mb-4">Quick Reference — Pakistan Property Units</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50"><th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">Unit</th><th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">= Sq. Ft</th><th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">= Sq. Yard</th><th className="text-left px-3 py-2 text-xs font-semibold text-slate-500">= Sq. Meter</th></tr></thead>
              <tbody className="divide-y">
                {[['1 Marla','272.25','30.25','25.29'],['1 Kanal','5,445','605','505.9'],['1 Acre','43,560','4,840','4,046.9']].map(row => (
                  <tr key={row[0]} className="hover:bg-slate-50">
                    {row.map((cell, i) => <td key={i} className={`px-3 py-2.5 ${i === 0 ? 'font-bold text-[#1a2e5a]' : 'text-slate-600'}`}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}