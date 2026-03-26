'use client';
import { useState } from 'react';
   
  

export default function LoanCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const P = parseFloat(amount) || 0;
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(years) * 12;
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    setResult({ emi, totalPayment, totalInterest });
  };

  const fmt = (n: number) => n >= 10000000 ? `PKR ${(n / 10000000).toFixed(2)} Crore` : `PKR ${(n / 100000).toFixed(1)} Lac`;

  const banks = [
    { name: 'HBL Home Finance', rate: '17–20%', max: '10 Crore', tenure: '20 yrs' },
    { name: 'Meezan Bank (Islamic)', rate: '18–22%', max: '15 Crore', tenure: '20 yrs' },
    { name: 'UBL Home Loan', rate: '18–21%', max: '8 Crore', tenure: '15 yrs' },
    { name: 'Allied Bank', rate: '16–19%', max: '5 Crore', tenure: '20 yrs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">


       {/* Hero */}
      <div className="primary-gradient py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-sky-400/20 text-sky-300 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide border border-sky-400/30">
            Free Professional Tool
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Home Loan Calculator
          </h1>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Calculate your monthly EMI for home loans in Pakistan
          </p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Loan Amount (PKR)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000000"
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Annual Interest Rate: <span className="text-emerald-600 font-bold">{rate}%</span></label>
              <input type="range" min="10" max="30" step="0.5" value={rate} onChange={e => setRate(e.target.value)} className="w-full accent-emerald-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>10%</span><span>30%</span></div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Loan Tenure: <span className="text-emerald-600 font-bold">{years} years</span></label>
              <input type="range" min="1" max="25" value={years} onChange={e => setYears(e.target.value)} className="w-full accent-emerald-500" />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1 yr</span><span>25 yrs</span></div>
            </div>
            <button onClick={calculate} disabled={!amount}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-colors disabled:opacity-50">
              Calculate EMI →
            </button>

            {result && (
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <p className="text-xs text-emerald-600 font-semibold uppercase mb-1">Monthly EMI</p>
                <p className="text-3xl font-extrabold text-[#1a2e5a] mb-3">{fmt(result.emi)}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Total Payment</span><span className="font-bold text-[#1a2e5a]">{fmt(result.totalPayment)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Total Interest</span><span className="font-bold text-red-600">{fmt(result.totalInterest)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Principal</span><span className="font-bold text-emerald-600">{fmt(parseFloat(amount))}</span></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-[#1a2e5a] mb-4">Popular Home Loan Packages</h3>
            <div className="space-y-3">
              {banks.map(b => (
                <div key={b.name} className="border rounded-xl p-4 hover:border-emerald-300 transition-colors">
                  <p className="font-bold text-[#1a2e5a] text-sm">{b.name}</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div><p className="text-xs text-slate-400">Rate</p><p className="text-xs font-semibold text-slate-700">{b.rate}</p></div>
                    <div><p className="text-xs text-slate-400">Max</p><p className="text-xs font-semibold text-slate-700">{b.max}</p></div>
                    <div><p className="text-xs text-slate-400">Tenure</p><p className="text-xs font-semibold text-slate-700">{b.tenure}</p></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">* Rates are approximate and subject to change. Contact the bank directly for exact figures.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
