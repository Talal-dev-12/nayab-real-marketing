'use client';
import { useState } from 'react';
import { Calculator, ArrowRightLeft, Info } from 'lucide-react';
import Select from '@/components/ui/Select';

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
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="primary-gradient py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide border border-white/30 backdrop-blur-sm">
            <Calculator size={14} /> Free Tool
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Area Unit Converter
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            Accurately convert property areas between Marla, Kanal, Square Feet, and Square Yards — instantly tailored for Pakistan's real estate market.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Enter Value</label>
              <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="e.g. 5"
                className="w-full border-2 rounded-xl px-5 py-4 text-2xl font-bold text-[#1a2e5a] outline-none focus:border-red-500 transition-colors bg-slate-50 focus:bg-white" />
            </div>
            <div className="hidden md:flex absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 rounded-full items-center justify-center text-slate-400 z-10 shadow-sm">
              <ArrowRightLeft size={18} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">From Unit</label>
              <Select
                value={from}
                onChange={setFrom}
                className="w-full border-2 rounded-xl px-5 py-3 text-lg font-semibold text-[#1a2e5a] outline-none focus:border-red-500 focus-within:border-red-500 transition-colors bg-slate-50 focus:bg-white"
                options={units.map(u => ({ value: u.key, label: u.label }))}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            {value ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {units.filter(u => u.key !== from).map(u => (
                  <div key={u.key} className="flex flex-col justify-center bg-slate-50 hover:bg-blue-50 rounded-xl px-5 py-4 border border-slate-100 hover:border-blue-200 transition-colors">
                    <span className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">{u.label}</span>
                    <span className="font-extrabold text-[#1a2e5a] text-xl truncate" title={(sqft / u.toSqft).toLocaleString(undefined, { maximumFractionDigits: 4 })}>
                      {(sqft / u.toSqft).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Enter a numerical value above to see conversions</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                <Info size={20} />
              </div>
              <h3 className="font-extrabold text-[#1a2e5a] text-xl">Understanding Units</h3>
            </div>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                <strong className="text-[#1a2e5a]">Marla</strong> is a traditional unit of area that is commonly used in Pakistan, India, and Bangladesh. In Pakistan, the measurement of a Marla varies by region:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-slate-700">Lahore / Punjab:</strong> 1 Marla is generally equivalent to <strong>225 Sq. Ft</strong>.</li>
                <li><strong className="text-slate-700">Karachi / Islamabad:</strong> 1 Marla is officially standardized as <strong>272.25 Sq. Ft</strong> (used in this tool).</li>
              </ul>
              <p>
                <strong className="text-[#1a2e5a]">Kanal</strong> is another traditional unit widely used for larger properties and agricultural land. Standardized as exactly 20 Marlas, 1 Kanal equals 5,445 Sq. Ft.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <h3 className="font-extrabold text-[#1a2e5a] text-xl mb-5">Standard Reference Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Unit</th>
                    <th className="py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">= Sq. Ft</th>
                    <th className="py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">= Sq. Yard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    ['1 Marla', '272.25', '30.25'],
                    ['1 Kanal', '5,445', '605'],
                    ['1 Acre', '43,560', '4,840'],
                    ['1 Hectare', '107,639', '11,960'],
                  ].map(row => (
                    <tr key={row[0]} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-[#1a2e5a]">{row[0]}</td>
                      <td className="py-3 text-slate-600 font-medium">{row[1]}</td>
                      <td className="py-3 text-slate-600 font-medium">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
