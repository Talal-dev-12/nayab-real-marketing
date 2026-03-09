'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { area: 'DHA Karachi', avgPrice: 85000, type: 'Residential', city: 'Karachi' },
  { area: 'Bahria Town KHI', avgPrice: 45000, type: 'Residential', city: 'Karachi' },
  { area: 'Gulshan-e-Iqbal', avgPrice: 28000, type: 'Residential', city: 'Karachi' },
  { area: 'DHA Lahore', avgPrice: 72000, type: 'Residential', city: 'Lahore' },
  { area: 'Bahria Town LHR', avgPrice: 38000, type: 'Residential', city: 'Lahore' },
  { area: 'F-7 Islamabad', avgPrice: 110000, type: 'Residential', city: 'Islamabad' },
  { area: 'DHA ISB', avgPrice: 68000, type: 'Residential', city: 'Islamabad' },
];

const COLORS = ['#c0392b','#e74c3c','#1a2e5a','#2980b9','#16a085','#8e44ad','#f39c12'];

export default function PropertyIndex() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <span className="inline-block bg-amber-100 text-amber-600 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Market Data</span>
          <h1 className="text-3xl font-extrabold text-[#1a2e5a]">Property Price Index</h1>
          <p className="text-slate-500 mt-2">Compare average property prices per sqft across Pakistan's top areas</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-bold text-[#1a2e5a] mb-5">Average Price Per Sq. Ft by Area</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="area" tick={{ fontSize: 11 }} width={130} />
              <Tooltip formatter={(v: any) => `PKR ${v.toLocaleString()}/sqft`} />
              <Bar dataKey="avgPrice" radius={[0, 6, 6, 0]} name="Avg Price/sqft">
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-slate-50">
            <h3 className="font-bold text-[#1a2e5a]">Detailed Price Table</h3>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 border-b">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Area</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">City</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Avg Price/sqft</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Index Score</th>
            </tr></thead>
            <tbody className="divide-y">
              {[...data].sort((a, b) => b.avgPrice - a.avgPrice).map((row, i) => (
                <tr key={row.area} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-semibold text-[#1a2e5a]">{row.area}</td>
                  <td className="px-5 py-3 text-slate-500">{row.city}</td>
                  <td className="px-5 py-3 font-bold text-[#1a2e5a]">PKR {row.avgPrice.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-slate-100 rounded-full w-20"><div className="h-1.5 bg-red-600 rounded-full" style={{ width: `${(row.avgPrice / 110000) * 100}%` }} /></div>
                      <span className="text-xs font-semibold text-slate-500">{Math.round((row.avgPrice / 110000) * 100)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-400 p-5">* Prices are approximate averages based on current market data. Contact us for specific area valuations.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}