'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
   
  
import {
  AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp,
  Phone, MessageCircle, Building2, Home, Calculator, Layers,
  Ruler, FileText, TrendingUp
} from 'lucide-react';

// ─── RATES ───────────────────────────────────────────────────────────────────
const FULL_RATES: Record<string, Record<string, number>> = {
  economy:  { residential: 3500, commercial: 4200, basement: 2800 },
  standard: { residential: 5500, commercial: 6500, basement: 4200 },
  luxury:   { residential: 9000, commercial: 11000, basement: 7000 },
};
const GREY_RATES: Record<string, number>   = { economy: 2800, standard: 3500, luxury: 4500 };
const FINISH_RATES: Record<string, number> = { economy: 1500, standard: 2500, luxury: 4500 };

// ─── FLOOR OPTIONS ───────────────────────────────────────────────────────────
const FLOOR_OPTIONS = [
  { label: 'Ground Floor', count: 1 },
  { label: 'Ground + 1',   count: 2 },
  { label: 'Ground + 2',   count: 3 },
  { label: 'Ground + 3',   count: 4 },
  { label: 'Ground + 4',   count: 5 },
  { label: 'Ground + 5',   count: 6 },
  { label: 'Ground + 6',   count: 7 },
];

// ─── RULES ───────────────────────────────────────────────────────────────────
function getMaxFloorIdx(sqyd: number, type: string): number {
  if (type === 'residential') {
    if (sqyd <= 120)  return 2;
    if (sqyd <= 240)  return 2;
    if (sqyd <= 400)  return 3;
    if (sqyd <= 600)  return 3;
    return 4;
  }
  if (sqyd <= 120)  return 3;
  if (sqyd <= 240)  return 5;
  if (sqyd <= 400)  return 6;
  return 7;
}
type BasementStatus = 'not_allowed' | 'optional_warning' | 'allowed';
function getBasementStatus(sqyd: number): BasementStatus {
  if (sqyd < 240)  return 'not_allowed';
  if (sqyd < 400)  return 'optional_warning';
  return 'allowed';
}
function getCoverageRatio(sqyd: number): number {
  if (sqyd <= 120)  return 0.80;
  if (sqyd <= 240)  return 0.75;
  if (sqyd <= 400)  return 0.70;
  if (sqyd <= 600)  return 0.65;
  return 0.60;
}

// ─── SOCIETIES ───────────────────────────────────────────────────────────────
const SOCIETIES = [
  { id: 'general',  label: 'General / Other',         multiplier: 1.00, note: '' },
  { id: 'dha',      label: 'DHA Karachi',              multiplier: 1.20, note: 'DHA requires approved builders, premium finishes & NOC compliance — adds ~20% to base cost.' },
  { id: 'bahria',   label: 'Bahria Town Karachi',      multiplier: 1.15, note: 'Bahria Town has strict façade guidelines and material standards — adds ~15% to base cost.' },
  { id: 'gulshan',  label: 'Gulshan-e-Iqbal',          multiplier: 1.05, note: 'Standard SBCA rules apply. Urban density adds a slight cost premium.' },
  { id: 'clifton',  label: 'Clifton / Bath Island',    multiplier: 1.25, note: 'Premium land + contractor rates in Clifton — adds ~25% to base cost.' },
  { id: 'defence',  label: 'Defence Housing (DHS)',    multiplier: 1.18, note: 'DHS requires architectural approvals and premium material requirements.' },
  { id: 'saddar',   label: 'Saddar / Old City',        multiplier: 1.10, note: 'Old city structural constraints may increase cost by ~10%.' },
  { id: 'malir',    label: 'Malir / Scheme 33',        multiplier: 0.95, note: 'Lower contractor rates in these areas reduce cost slightly.' },
  { id: 'surjani',  label: 'Surjani / North Karachi',  multiplier: 0.92, note: 'Economy zone — labour and material costs slightly lower.' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const toSqyd = (v: number, u: string) => {
  if (u === 'marla') return v * 30.25;
  if (u === 'kanal') return v * 605;
  if (u === 'sqft')  return v / 9;
  return v; // sqyd
};
const fmt = (n: number) =>
  n >= 10000000 ? `PKR ${(n / 10000000).toFixed(2)} Crore`
  : n >= 100000 ? `PKR ${(n / 100000).toFixed(1)} Lac`
  : `PKR ${Math.round(n).toLocaleString()}`;

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function ConstructionCalculator() {
  const [area,      setArea]      = useState('');
  const [unit,      setUnit]      = useState('sqyd');
  const [type,      setType]      = useState('residential');
  const [quality,   setQuality]   = useState('standard');
  const [floorIdx,  setFloorIdx]  = useState(2); // G+1 default
  const [basement,  setBasement]  = useState(false);
  const [society,   setSociety]   = useState('general');
  const [result,    setResult]    = useState<any>(null);
  const [showDocs,  setShowDocs]  = useState(false);
  const [activeTab, setActiveTab] = useState<'full'|'grey'|'coverage'>('full');

  const sqyd  = useMemo(() => toSqyd(parseFloat(area) || 0, unit), [area, unit]);
  const sqft  = useMemo(() => sqyd * 9, [sqyd]);
  const maxFloorIdx    = useMemo(() => sqyd > 0 ? getMaxFloorIdx(sqyd, type) : 7, [sqyd, type]);
  const basementStatus = useMemo(() => getBasementStatus(sqyd), [sqyd]);
  const coverageRatio  = useMemo(() => getCoverageRatio(sqyd), [sqyd]);
  const societyData    = SOCIETIES.find(s => s.id === society)!;

  useEffect(() => {
    if (floorIdx > maxFloorIdx) setFloorIdx(maxFloorIdx);
  }, [maxFloorIdx]);

  useEffect(() => {
    if (basementStatus === 'not_allowed') setBasement(false);
  }, [basementStatus]);

  const floorCount = FLOOR_OPTIONS[floorIdx - 1]?.count ?? floorIdx;
  const floorLabel = FLOOR_OPTIONS[floorIdx - 1]?.label ?? `${floorIdx} floors`;
  const maxLabel   = FLOOR_OPTIONS[maxFloorIdx - 1]?.label ?? '';

  const handleCalculate = () => {
    if (sqyd <= 0) return;
    const rate         = FULL_RATES[quality][type];
    const mult         = societyData.multiplier;
    const coveredSqft  = sqft * coverageRatio;
    const mainCost     = coveredSqft * rate * floorCount * mult;
    const baseCost     = basement ? coveredSqft * FULL_RATES[quality].basement * mult : 0;
    const total        = mainCost + baseCost;
    const greyCost     = coveredSqft * GREY_RATES[quality] * floorCount * mult
                        + (basement ? coveredSqft * GREY_RATES[quality] * mult : 0);
    const finishCost   = coveredSqft * FINISH_RATES[quality] * floorCount * mult;
    const totalArea    = coveredSqft * floorCount + (basement ? coveredSqft : 0);
    setResult({
      sqyd, sqft, coveredSqft, totalArea, floorCount, floorLabel, rate, mult,
      mainCost, baseCost, total,
      labor: total * 0.35, material: total * 0.50, misc: total * 0.15,
      greyCost, finishCost, totalProject: greyCost + finishCost,
      coverageRatio,
    });
  };

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Hero */}
      <div className="primary-gradient py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-sky-400/20 text-sky-300 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide border border-sky-400/30">
            Free Professional Tool
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Pakistan Construction Cost Calculator
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Professional estimation for Karachi residential &amp; commercial projects — with SBCA floor rules, society premiums, grey structure, finishing, and coverage calculations.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-sky-600">Home</Link>
          <span>/</span>
          <span className="text-sky-600 font-semibold">Construction Calculator</span>
        </nav>

        {/* ═══════════ INPUT CARD ═══════════ */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
          <h2 className="text-lg font-extrabold text-[#1a2e5a] flex items-center gap-2">
            <Calculator size={20} className="text-sky-500" /> Project Details
          </h2>

          {/* Area + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Plot Area</label>
              <input
                type="number" value={area} onChange={e => setArea(e.target.value)}
                placeholder="e.g. 120"
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Unit</label>
              <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400">
                <option value="sqyd">Sq. Yards</option>
                <option value="marla">Marla</option>
                <option value="kanal">Kanal</option>
                <option value="sqft">Sq. Feet</option>
              </select>
            </div>
          </div>

          {/* Converted pills */}
          {sqyd > 0 && (
            <div className="flex gap-2 flex-wrap">
              {[`${sqyd.toFixed(1)} Sq. Yards`, `${sqft.toFixed(0)} Sq. Ft`, `${(sqyd / 30.25).toFixed(2)} Marla`].map(v => (
                <span key={v} className="bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full border border-sky-100">{v}</span>
              ))}
            </div>
          )}

          {/* Type + Society */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Building Type</label>
              <select value={type} onChange={e => { setType(e.target.value); setFloorIdx(1); }} className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400">
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">
                Area / Society <span className="text-slate-400 font-normal normal-case">(affects cost)</span>
              </label>
              <select value={society} onChange={e => setSociety(e.target.value)} className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400">
                {SOCIETIES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Society note */}
          {societyData.note && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
              <Info size={14} className="shrink-0 mt-0.5 text-amber-500" />
              <span>{societyData.note} Cost multiplier: <strong>{societyData.multiplier}×</strong></span>
            </div>
          )}

          {/* Floor selector — dynamic max */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">
              Number of Floors
              {sqyd > 0 && <span className="ml-2 text-slate-400 font-normal normal-case">(max allowed: {maxLabel})</span>}
            </label>
            <select
              value={floorIdx}
              onChange={e => setFloorIdx(parseInt(e.target.value))}
              className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-400"
            >
              {FLOOR_OPTIONS.slice(0, maxFloorIdx).map((f, i) => (
                <option key={i} value={i + 1}>{f.label}</option>
              ))}
            </select>
            {sqyd > 0 && floorIdx > maxFloorIdx && (
              <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-700">
                <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                {type === 'residential' ? 'Residential' : 'Commercial'} buildings on this plot size typically allow up to {maxLabel}.
              </div>
            )}
          </div>

          {/* Quality */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Construction Quality</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['economy',  'Economy',  'PKR 3,500/sqft'],
                ['standard', 'Standard', 'PKR 5,500/sqft'],
                ['luxury',   'Luxury',   'PKR 9,000/sqft'],
              ].map(([val, label, sub]) => (
                <label key={val} className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${quality === val ? 'border-sky-400 bg-sky-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="quality" value={val} checked={quality === val} onChange={() => setQuality(val)} className="hidden" />
                  <span className="font-bold text-[#1a2e5a] text-sm">{label}</span>
                  <span className="text-xs text-slate-400">{sub}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Basement — context-aware */}
          <div>
            {basementStatus === 'not_allowed' ? (
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl opacity-60 cursor-not-allowed">
                <input type="checkbox" disabled className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-500">Include Basement</p>
                  <p className="text-xs text-slate-400 mt-0.5">Not allowed for plots under 240 sq yards (SBCA guideline)</p>
                </div>
              </div>
            ) : basementStatus === 'optional_warning' ? (
              <label className="flex items-center gap-3 p-3.5 border-2 border-amber-200 bg-amber-50 rounded-xl cursor-pointer">
                <input type="checkbox" checked={basement} onChange={e => setBasement(e.target.checked)} className="w-5 h-5 accent-amber-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Include Basement</p>
                  <p className="text-xs text-amber-700 mt-0.5">⚠ 240–399 sq yd plots — basement sometimes allowed, requires SBCA approval</p>
                </div>
              </label>
            ) : (
              <label className="flex items-center gap-3 p-3.5 border-2 border-emerald-200 bg-emerald-50 rounded-xl cursor-pointer">
                <input type="checkbox" checked={basement} onChange={e => setBasement(e.target.checked)} className="w-5 h-5 accent-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Include Basement</p>
                  <p className="text-xs text-emerald-700 mt-0.5">✓ Basement mostly allowed for plots 400+ sq yards</p>
                </div>
              </label>
            )}
          </div>

          <button
            onClick={handleCalculate}
            disabled={!area || sqyd <= 0}
            className="w-full bg-[#1a2e5a] hover:bg-[#0f1e3d] text-white py-3.5 rounded-xl font-bold text-base transition-colors disabled:opacity-50"
          >
            Calculate All Costs →
          </button>
        </div>

        {/* ═══════════ RESULTS ═══════════ */}
        {result && (
          <div className="space-y-5">
            {/* Tab bar */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {([
                ['full',     'Full Construction', Building2],
                ['grey',     'Grey + Finishing',  Layers],
                ['coverage', 'Plot Coverage',     Ruler],
              ] as const).map(([key, label, Icon]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === key ? 'bg-white shadow text-[#1a2e5a]' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* ── Full Cost ── */}
            {activeTab === 'full' && (
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100">
                <p className="text-xs font-semibold text-sky-600 uppercase mb-1">Total Full Construction Cost</p>
                <p className="text-4xl font-extrabold text-[#1a2e5a] mb-1">{fmt(result.total)}</p>
                {society !== 'general' && (
                  <p className="text-xs text-slate-500 mb-4">Includes {societyData.label} premium ({societyData.multiplier}×)</p>
                )}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {([
                    ['Materials (50%)', result.material],
                    ['Labor (35%)',     result.labor],
                    ['Misc (15%)',      result.misc],
                    ...(basement ? [['Basement', result.baseCost]] : []),
                  ] as [string, number][]).map(([label, val]) => (
                    <div key={label} className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="font-bold text-[#1a2e5a] text-sm">{fmt(val)}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400">
                  * Based on {quality} quality, {result.floorLabel}, {result.coveredSqft.toFixed(0)} sq ft covered area/floor.
                  Actual costs may vary ±15%.
                </p>
              </div>
            )}

            {/* ── Grey + Finishing ── */}
            {activeTab === 'grey' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                        <Building2 size={16} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1a2e5a] text-sm">Grey Structure</p>
                        <p className="text-xs text-slate-400">PKR {GREY_RATES[quality].toLocaleString()}/sqft</p>
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-[#1a2e5a] mb-3">{fmt(result.greyCost)}</p>
                    <div className="space-y-1">
                      {['Foundation & columns','Beams & slabs','Brick walls','Plaster','Plumbing rough-in','Electrical wiring'].map(i => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                          <CheckCircle size={10} className="text-slate-400 shrink-0" /> {i}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center">
                        <Home size={16} className="text-amber-700" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1a2e5a] text-sm">Finishing</p>
                        <p className="text-xs text-slate-400">PKR {FINISH_RATES[quality].toLocaleString()}/sqft</p>
                      </div>
                    </div>
                    <p className="text-3xl font-extrabold text-[#1a2e5a] mb-3">{fmt(result.finishCost)}</p>
                    <div className="space-y-1">
                      {['Tiles & flooring','Paint & putty','Doors & windows','Electrical fittings','Kitchen cabinets','Bathroom fixtures'].map(i => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                          <CheckCircle size={10} className="text-amber-500 shrink-0" /> {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#1a2e5a] to-[#0f1e3d] rounded-2xl p-6 text-white">
                  <p className="text-xs font-semibold text-sky-300 uppercase mb-1">Total Project Cost</p>
                  <p className="text-4xl font-extrabold mb-4">{fmt(result.totalProject)}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      ['Grey Structure', result.greyCost,     'text-sky-300'],
                      ['Finishing',      result.finishCost,   'text-amber-300'],
                      ['Combined Total', result.totalProject, 'text-emerald-300'],
                    ] as [string, number, string][]).map(([label, val, cls]) => (
                      <div key={label} className="bg-white/10 rounded-xl p-3">
                        <p className="text-xs text-white/60">{label}</p>
                        <p className={`font-bold text-sm ${cls}`}>{fmt(val)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Coverage ── */}
            {activeTab === 'coverage' && (
              <div className="bg-white border-2 border-teal-200 rounded-2xl p-6">
                <h3 className="font-bold text-[#1a2e5a] mb-4 flex items-center gap-2">
                  <Ruler size={16} className="text-teal-500" /> Plot Coverage Estimate
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {([
                    ['Plot Area',               `${result.sqyd.toFixed(1)} sq yd / ${result.sqft.toFixed(0)} sq ft`],
                    ['Coverage Ratio',          `${(result.coverageRatio * 100).toFixed(0)}%`],
                    ['Covered Area / Floor',    `${result.coveredSqft.toFixed(0)} sq ft`],
                    ['No. of Floors',           result.floorLabel],
                    ['Total Construction Area', `${result.totalArea.toFixed(0)} sq ft`],
                    ...(basement ? [['+ Basement Area', `${result.coveredSqft.toFixed(0)} sq ft`]] : []),
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="bg-teal-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="font-bold text-[#1a2e5a] text-sm">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>Open/Setbacks ({(100 - result.coverageRatio * 100).toFixed(0)}%)</span>
                  <span>Covered ({(result.coverageRatio * 100).toFixed(0)}%)</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-4 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" style={{ width: `${result.coverageRatio * 100}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-3">* Coverage estimates based on typical Karachi SBCA practices. Actual setbacks depend on road width and zoning.</p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ SOCIETY PREMIUM TABLE ═══════════ */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-[#1a2e5a] mb-1 flex items-center gap-2">
            <TrendingUp size={18} className="text-red-600" /> High-Demand Area Cost Premiums
          </h3>
          <p className="text-xs text-slate-400 mb-4">Select your area above — the calculator automatically applies the correct premium to all estimates</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50">
                <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Society / Area</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Multiplier</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Premium Over Base</th>
              </tr></thead>
              <tbody className="divide-y">
                {SOCIETIES.filter(s => s.id !== 'general').map(s => (
                  <tr key={s.id} className={`hover:bg-slate-50 ${society === s.id ? 'bg-sky-50 font-semibold' : ''}`}>
                    <td className="px-3 py-2.5 text-[#1a2e5a] text-sm font-medium">{s.label}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.multiplier >= 1.2 ? 'bg-red-100 text-red-700' : s.multiplier >= 1.1 ? 'bg-amber-100 text-amber-700' : s.multiplier < 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {s.multiplier}×
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-500">
                      {s.multiplier >= 1 ? '+' : ''}{((s.multiplier - 1) * 100).toFixed(0)}% over base rate
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════ DOCUMENTATION SECTION ═══════════ */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setShowDocs(!showDocs)}
            className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-sky-500" />
              <div className="text-left">
                <p className="font-bold text-[#1a2e5a]">Karachi Construction Guidelines (SBCA Simplified)</p>
                <p className="text-xs text-slate-400">Floor limits, basement rules, setbacks & SBCA conditions</p>
              </div>
            </div>
            {showDocs ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
          </button>

          {showDocs && (
            <div className="px-6 pb-6 border-t space-y-5 pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Residential */}
                <div>
                  <h3 className="font-bold text-[#1a2e5a] text-sm mb-3 flex items-center gap-2"><Home size={14} className="text-sky-500" /> Residential Plot Rules</h3>
                  <table className="w-full text-xs">
                    <thead><tr className="bg-sky-50">
                      <th className="text-left px-3 py-2 font-semibold text-slate-500">Plot Size</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-500">Max Floors</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-500">Basement</th>
                    </tr></thead>
                    <tbody className="divide-y">
                      {[
                        ['80–120 sq yards',  'Ground + 1', 'Not allowed'],
                        ['121–240 sq yards', 'Ground + 1', 'Not allowed'],
                        ['241–400 sq yards', 'Ground + 2', 'Sometimes (approval req.)'],
                        ['401–600 sq yards', 'Ground + 2', 'Sometimes (approval req.)'],
                        ['600+ sq yards',    'Ground + 3', 'Mostly allowed'],
                      ].map(([sz, fl, bs]) => (
                        <tr key={sz} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-medium text-[#1a2e5a]">{sz}</td>
                          <td className="px-3 py-2 text-slate-600">{fl}</td>
                          <td className="px-3 py-2 text-slate-500">{bs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Commercial */}
                <div>
                  <h3 className="font-bold text-[#1a2e5a] text-sm mb-3 flex items-center gap-2"><Building2 size={14} className="text-emerald-500" /> Commercial Plot Rules</h3>
                  <table className="w-full text-xs">
                    <thead><tr className="bg-emerald-50">
                      <th className="text-left px-3 py-2 font-semibold text-slate-500">Plot Size</th>
                      <th className="text-left px-3 py-2 font-semibold text-slate-500">Max Floors</th>
                    </tr></thead>
                    <tbody className="divide-y">
                      {[
                        ['80–120 sq yards',  'Ground + 2'],
                        ['121–240 sq yards', 'Ground + 4'],
                        ['241–400 sq yards', 'Ground + 5'],
                        ['400+ sq yards',    'Ground + 6'],
                      ].map(([sz, fl]) => (
                        <tr key={sz} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-medium text-[#1a2e5a]">{sz}</td>
                          <td className="px-3 py-2 text-slate-600">{fl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Typical practice table from screenshot */}
              <div>
                <h3 className="font-bold text-[#1a2e5a] text-sm mb-3">Typical Practice (Residential Houses)</h3>
                <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead><tr className="bg-slate-100">
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Plot Size</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Basement</th>
                  </tr></thead>
                  <tbody className="divide-y">
                    {[
                      ['80–120 yards',  'Normally NOT allowed'],
                      ['120–240 yards', 'Rare / usually not approved'],
                      ['240–400 yards', 'Sometimes allowed'],
                      ['400+ yards',    'Mostly allowed'],
                    ].map(([sz, bs]) => (
                      <tr key={sz} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-medium text-[#1a2e5a]">{sz}</td>
                        <td className="px-4 py-2.5 text-slate-500">{bs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SBCA Basement Conditions */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-bold text-[#1a2e5a] text-sm mb-2">📋 SBCA Basement Conditions (Simplified)</h3>
                <p className="text-xs text-slate-500 mb-2">When constructing a basement, SBCA requires:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Ventilation shafts required','Waterproofing system','Structural design approval','Drainage system','NOC from SBCA','Ground water depth assessment'].map(c => (
                    <div key={c} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle size={11} className="text-emerald-500 shrink-0" /> {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic SBCA */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="font-bold text-blue-800 text-sm mb-2">Basic SBCA Guidelines</h3>
                <div className="space-y-1">
                  {[
                    'Building plan approval required before construction',
                    'Structural design approval required',
                    'Residential building height ~33–35 ft (G+1)',
                    'Setbacks must be maintained as per road width',
                    'NOC required from SITE, KDA, or relevant authority',
                    'Fire safety plan mandatory for commercial buildings',
                  ].map(g => (
                    <div key={g} className="flex items-start gap-1.5 text-xs text-blue-700">
                      <Info size={11} className="shrink-0 mt-0.5 text-blue-500" /> {g}
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Disclaimer:</strong> These rules are simplified guidelines based on common Karachi construction practices and SBCA regulations.
                  Actual approvals depend on zoning, road width, and official SBCA permissions. Always consult a licensed architect and SBCA before starting construction.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════ CTA ═══════════ */}
        <div className="bg-gradient-to-br from-[#1a2e5a] to-[#0f1e3d] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Planning to Build Your House?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6 leading-relaxed">
            If you are planning to build a house in Karachi, our team can help you with construction planning, cost estimation, and finding the right contractors and approved builders.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/923212869000"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <MessageCircle size={18} /> WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 bg-white text-[#1a2e5a] hover:bg-slate-100 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <Phone size={18} /> Contact Us
            </Link>
          </div>
          <p className="text-xs text-white/40 mt-4">Free consultation · No obligation</p>
        </div>

      </div>
    </div>
  );
}
