'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Plus, Eye, TrendingUp, CheckCircle, Clock, MapPin } from 'lucide-react';

export default function AgentDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading,    setLoading]     = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('agent_token');
    const user  = JSON.parse(localStorage.getItem('agent_user') || '{}');
    fetch('/api/properties?limit=100', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        // Only show own properties
        const all = d.properties ?? [];
        setProperties(all.filter((p: any) => p.agentId === user.id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total     = properties.length;
  const available = properties.filter(p => p.status === 'available').length;
  const sold      = properties.filter(p => p.status === 'sold').length;
  const totalViews= properties.reduce((s, p) => s + (p.views || 0), 0);

  const stats = [
    { label: 'My Listings',      value: total,      icon: Home,       color: 'bg-blue-50 text-blue-700'    },
    { label: 'Available',        value: available,  icon: CheckCircle,color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Sold / Rented',    value: sold,       icon: TrendingUp, color: 'bg-amber-50 text-amber-700'  },
    { label: 'Total Views',      value: totalViews, icon: Eye,        color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-extrabold text-[#1a2e5a]">My Dashboard</h2><p className="text-slate-500 text-sm">Manage your property listings</p></div>
        <Link href="/agent/properties/new" className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors">
          <Plus size={16} /> Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}><Icon size={20} /></div>
            <div className="text-2xl font-extrabold text-[#1a2e5a]">{loading ? '—' : value.toLocaleString()}</div>
            <div className="text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent listings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="font-extrabold text-[#1a2e5a]">My Properties</h3>
          <Link href="/agent/properties" className="text-sm text-red-700 font-semibold hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center">
            <Home size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="font-semibold text-slate-500">No properties yet</p>
            <Link href="/agent/properties/new" className="text-red-700 text-sm font-semibold hover:underline mt-2 inline-block">Add your first property</Link>
          </div>
        ) : (
          <div className="divide-y">
            {properties.slice(0, 8).map(p => (
              <div key={p._id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50">
                <img src={p.images?.[0]} alt={p.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a2e5a] line-clamp-1">{p.title}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {p.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.status === 'available' ? 'bg-emerald-100 text-emerald-700' : p.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 justify-end"><Eye size={10} /> {p.views}</div>
                </div>
                <Link href={`/agent/properties/${p._id}`} className="text-xs text-red-700 font-semibold hover:underline ml-2">Edit</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
