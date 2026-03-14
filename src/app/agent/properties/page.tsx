'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Pencil, Trash2, MapPin } from 'lucide-react';

export default function AgentPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading,    setLoading]     = useState(true);

  const load = () => {
    const token = localStorage.getItem('agent_token');
    const user  = JSON.parse(localStorage.getItem('agent_user') || '{}');
    fetch('/api/properties?limit=100', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setProperties((d.properties ?? []).filter((p: any) => p.agentId === user.id)))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property?')) return;
    const token = localStorage.getItem('agent_token');
    await fetch(`/api/properties/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setProperties(prev => prev.filter(p => p._id !== id));
  };

  const fmt = (price: number, type: string, period?: string) => {
    const f = price >= 10000000 ? `${(price/10000000).toFixed(1)} Cr` : `${(price/100000).toFixed(0)} L`;
    return `PKR ${f}${type === 'rent' ? `/${period || 'mo'}` : ''}`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-extrabold text-[#1a2e5a]">My Properties</h2><p className="text-slate-500 text-sm">{properties.length} total listings</p></div>
        <Link href="/agent/properties/new" className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm">
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="text-center py-16 text-slate-400">Loading...</div>
        : properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 font-semibold">No properties yet.</p>
            <Link href="/agent/properties/new" className="text-red-700 text-sm font-semibold hover:underline mt-2 inline-block">Add your first →</Link>
          </div>
        ) : (
          <div className="divide-y">
            {properties.map(p => (
              <div key={p._id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50">
                <img src={p.images?.[0]} alt={p.title} className="w-14 h-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a2e5a] line-clamp-1">{p.title}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {p.location}</p>
                  <p className="text-sm font-bold text-red-700 mt-0.5">{fmt(p.price, p.priceType, p.rentPeriod)}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mr-2"><Eye size={12} /> {p.views}</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.status === 'available' ? 'bg-emerald-100 text-emerald-700' : p.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                <div className="flex gap-2 ml-2">
                  <Link href={`/agent/properties/${p._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></Link>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
