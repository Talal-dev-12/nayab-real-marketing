'use client';
import { useState, useMemo } from 'react';
import { Calculator, Landmark, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function LoanCalculator() {
  const [amount, setAmount] = useState('5000000');
  const [rate, setRate] = useState('18');
  const [years, setYears] = useState('10');

  const { emi, totalPayment, totalInterest, P } = useMemo(() => {
    const principal = parseFloat(amount) || 0;
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(years) * 12;
    if (principal === 0 || n === 0) return { emi: 0, totalPayment: 0, totalInterest: 0, P: principal };
    
    const e = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPmt = e * n;
    return {
      emi: e,
      totalPayment: totalPmt,
      totalInterest: totalPmt - principal,
      P: principal
    };
  }, [amount, rate, years]);

  const fmt = (n: number) => n >= 10000000 ? `PKR ${(n / 10000000).toFixed(2)} Crore` : `PKR ${(n / 100000).toFixed(1)} Lac`;
  const formatCompact = (n: number) => {
    if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `${(n / 100000).toFixed(1)} L`;
    return n.toLocaleString();
  };

  const chartData = [
    { name: 'Principal Amount', value: P, color: '#10b981' },
    { name: 'Total Interest', value: totalInterest, color: '#f43f5e' }
  ];

  const banks = [
    { name: 'HBL Home Finance', rate: '17–20%', max: '10 Crore', tenure: '20 yrs' },
    { name: 'Meezan Bank (Islamic)', rate: '18–22%', max: '15 Crore', tenure: '20 yrs' },
    { name: 'UBL Home Loan', rate: '18–21%', max: '8 Crore', tenure: '15 yrs' },
    { name: 'Allied Bank', rate: '16–19%', max: '5 Crore', tenure: '20 yrs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero */}
      <div className="primary-gradient py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide border border-white/30 backdrop-blur-sm">
            <Calculator size={14} /> Professional Tool
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Home Loan EMI Calculator
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            Plan your property investment confidently. Calculate your monthly mortgage payments, visual breakdowns, and explore top financing options in Pakistan.
          </p>
        </div>
      </div>
       
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Calculator Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
            <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-6 flex items-center gap-2">
              <Calculator className="text-emerald-600" size={24} /> Input Loan Details
            </h2>
            <div className="space-y-8">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Loan Amount (PKR)</span>
                  <span className="text-emerald-600 font-extrabold text-sm">{fmt(P)}</span>
                </label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000000"
                  className="w-full border-2 rounded-xl px-5 py-4 text-xl font-bold text-[#1a2e5a] outline-none focus:border-emerald-500 transition-colors bg-slate-50 focus:bg-white" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Annual Interest Rate (%)</span>
                  <span className="text-emerald-600 font-extrabold text-sm">{rate}%</span>
                </label>
                <input type="range" min="10" max="30" step="0.5" value={rate} onChange={e => setRate(e.target.value)} 
                  className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium"><span>10%</span><span>30%</span></div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                  <span>Loan Tenure (Years)</span>
                  <span className="text-emerald-600 font-extrabold text-sm">{years} Years</span>
                </label>
                <input type="range" min="1" max="25" value={years} onChange={e => setYears(e.target.value)} 
                  className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium"><span>1 yr</span><span>25 yrs</span></div>
              </div>
            </div>
          </div>

          {/* Visualization & Results */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 flex flex-col">
            <h2 className="font-extrabold text-[#1a2e5a] text-xl mb-6">Payment Breakdown</h2>
            
            {P > 0 ? (
              <>
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 text-center mb-6">
                  <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">Monthly EMI</p>
                  <p className="text-4xl font-extrabold text-[#1a2e5a]">{fmt(emi)}</p>
                </div>

                <div className="h-48 w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <RechartsTooltip formatter={(value: number) => `PKR ${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]" /><span className="text-sm font-semibold text-slate-600">Principal</span></div>
                    <span className="font-extrabold text-[#1a2e5a] text-sm">{formatCompact(P)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f43f5e]" /><span className="text-sm font-semibold text-slate-600">Interest</span></div>
                    <span className="font-extrabold text-[#1a2e5a] text-sm">{formatCompact(totalInterest)}</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">Total Payment</span>
                    <span className="font-extrabold text-[#1a2e5a] text-sm">{formatCompact(totalPayment)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Enter a loan amount to view the breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-extrabold text-[#1a2e5a] text-xl">Home Financing in Pakistan</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Getting a home loan in Pakistan requires meeting certain eligibility criteria. Banks typically look at your credit history (eCIB report), monthly income, and the property's legal status.
            </p>
            <ul className="space-y-3 mb-5">
              {[
                'Down payment ranges from 20% to 30%',
                'Interest rates are linked to KIBOR + Bank Margin',
                'Maximum tenure is usually 20-25 years',
                'Property must have clear Title & approved maps'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex gap-3 text-sm text-amber-800">
              <Info size={20} className="shrink-0 mt-0.5 text-amber-600" />
              <p><strong>Note:</strong> Islamic banking alternatives (like Diminishing Musharakah) offer Shariah-compliant financing instead of conventional interest-based loans.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center shrink-0">
                <Landmark size={20} />
              </div>
              <h3 className="font-extrabold text-[#1a2e5a] text-xl">Popular Loan Packages</h3>
            </div>
            <div className="space-y-4">
              {banks.map(b => (
                <div key={b.name} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <p className="font-bold text-[#1a2e5a] mb-2">{b.name}</p>
                  <div className="grid grid-cols-3 gap-2 divide-x divide-slate-200">
                    <div className="px-2 first:pl-0"><p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Rate</p><p className="text-sm font-semibold text-slate-700">{b.rate}</p></div>
                    <div className="px-2"><p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Max Loan</p><p className="text-sm font-semibold text-slate-700">{b.max}</p></div>
                    <div className="px-2"><p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Tenure</p><p className="text-sm font-semibold text-slate-700">{b.tenure}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">* Indicative rates. Consult banks for the latest KIBOR rates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
