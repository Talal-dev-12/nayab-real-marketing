'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const RATES: Record<string, Record<string, number>> = {
  economy:   { residential: 3500, commercial: 4200, basement: 2800 },
  standard:  { residential: 5500, commercial: 6500, basement: 4200 },
  luxury:    { residential: 9000, commercial: 11000, basement: 7000 },
};

export default function ConstructionCalculator() {
  const [area, setArea] = useState('');
  const [unit, setUnit] = useState('marla');
  const [type, setType] = useState('residential');
  const [quality, setQuality] = useState('standard');
  const [floors, setFloors] = useState('1');
  const [basement, setBasement] = useState(false);
  const [result, setResult] = useState<{ total: number; perSqft: number; breakdown: any } | null>(null);

  const toSqft = (val: number, u: string) => {
    if (u === 'marla') return val * 272.25;
    if (u === 'kanal') return val * 5445;
    if (u === 'sqyd') return val * 9;
    return val;
  };

  const calculate = () => {
    const sqft = toSqft(parseFloat(area) || 0, unit);
    const rate = RATES[quality][type];
    const mainCost = sqft * rate * parseInt(floors);
    const basementCost = basement ? sqft * RATES[quality].basement : 0;
    const totalCost = mainCost + basementCost;
    const labor = totalCost * 0.35;
    const material = totalCost * 0.50;
    const misc = totalCost * 0.15;
    setResult({ total: totalCost, perSqft: rate, breakdown: { labor, material, misc, basement: basementCost } });
  };

  const fmt = (n: number) => n >= 10000000 ? `PKR ${(n / 10000000).toFixed(2)} Crore` : n >= 100000 ? `PKR ${(n / 100000).toFixed(1)} Lac` : `PKR ${n.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <span className="inline-block bg-sky-100 text-sky-600 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Free Tool</span>
          <h1 className="text-3xl font-extrabold text-[#1a2e5a]">Construction Cost Calculator</h1>
          <p className="text-slate-500 mt-2">Estimate your building cost in Pakistan based on area, quality, and type</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Plot Area</label>
              <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. 5"
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Unit</label>
              <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400">
                <option value="marla">Marla</option>
                <option value="kanal">Kanal</option>
                <option value="sqft">Sq. Ft</option>
                <option value="sqyd">Sq. Yard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Construction Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400">
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Number of Floors</label>
              <select value={floors} onChange={e => setFloors(e.target.value)} className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Floor{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Construction Quality</label>
            <div className="grid grid-cols-3 gap-3">
              {[['economy','Economy','PKR 3,500/sqft'],['standard','Standard','PKR 5,500/sqft'],['luxury','Luxury','PKR 9,000/sqft']].map(([val, label, sub]) => (
                <label key={val} className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${quality === val ? 'border-sky-400 bg-sky-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="quality" value={val} checked={quality === val} onChange={() => setQuality(val)} className="hidden" />
                  <span className="font-bold text-[#1a2e5a] text-sm">{label}</span>
                  <span className="text-xs text-slate-400">{sub}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={basement} onChange={e => setBasement(e.target.checked)} className="w-5 h-5 accent-sky-500" />
            <span className="text-sm font-semibold text-slate-700">Include Basement</span>
          </label>

          <button onClick={calculate} disabled={!area}
            className="w-full bg-[#1a2e5a] hover:bg-[#0f1e3d] text-white py-3.5 rounded-xl font-bold text-base transition-colors disabled:opacity-50">
            Calculate Cost →
          </button>

          {result && (
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100 mt-2">
              <p className="text-xs font-semibold text-sky-600 uppercase mb-1">Estimated Total Cost</p>
              <p className="text-4xl font-extrabold text-[#1a2e5a] mb-4">{fmt(result.total)}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Materials (50%)', result.breakdown.material],
                  ['Labor (35%)', result.breakdown.labor],
                  ['Misc & Finishing (15%)', result.breakdown.misc],
                  ...(basement ? [['Basement', result.breakdown.basement]] : []),
                ].map(([label, val]) => (
                  <div key={label as string} className="bg-white rounded-xl p-3 shadow-sm">
                    <p className="text-xs text-slate-500">{label as string}</p>
                    <p className="font-bold text-[#1a2e5a] text-sm">{fmt(val as number)}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-4">* Estimates based on {quality} quality rates. Actual costs may vary by 10–20% depending on location and contractor.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}