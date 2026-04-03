'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Search, MapPin, Eye, Pencil } from 'lucide-react';
import { api } from '@/lib/api-client';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { can } from '@/lib/rbac';
import type { Property } from '@/types';
import type { UserRole } from '@/lib/jwt';

function useCurrentUser() {
  const [user, setUser] = useState<{ id: string; role: UserRole } | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    if (raw) try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  return user;
}

export default function DashboardProperties() {
  const currentUser = useCurrentUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Sellers only see their own; admins see all
    const url = can(currentUser.role, 'manageAllProperties')
      ? '/api/properties?limit=200'
      : `/api/properties?submittedBy=${currentUser.id}&limit=200`;

    api.get<any>(url)
      .then(d => setProperties(d.properties ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser]);

  const deleteProperty = async (p: Property) => {
    if (!confirm('Delete this property?')) return;
    await api.delete(`/api/properties/${(p as any)._id}`);
    setProperties(ps => ps.filter(x => (x as any)._id !== (p as any)._id));
  };

  const toggleFeatured = async (p: Property) => {
    const updated = await api.put<Property>(`/api/properties/${(p as any)._id}`, { featured: !p.featured });
    setProperties(ps => ps.map(x => (x as any)._id === (updated as any)._id ? updated : x));
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000)   return `${(price / 100000).toFixed(0)} Lac`;
    return price.toLocaleString();
  };

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  if (!currentUser) return null;
  const role       = currentUser.role;
  const canFeature = can(role, 'markFeatured');
  const canDelete  = can(role, 'deleteAnyProperty');
  const isSeller   = role === 'seller';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">
            {isSeller ? 'My Properties' : 'Properties'}
          </h2>
          <p className="text-slate-500 text-sm">{properties.length} total listings</p>
        </div>
        <Link href="/dashboard/properties/new"
          className="bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2">
          <Plus size={18} /> Add Property
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 max-w-sm">
          <Search size={16} className="text-slate-400" />
          <input type="text" placeholder="Search properties..." className="outline-none text-sm flex-1"
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Property</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Price</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Type</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Views</th>
              {canFeature && <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Featured</th>}
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <TableRowSkeleton cols={canFeature ? 7 : 6} rows={8} />
            ) : filtered.map(p => (
              <tr key={(p as any)._id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0]} className="w-12 h-10 rounded-lg object-cover" alt="" />
                    <div>
                      <p className="font-semibold text-[#1a2e5a] line-clamp-1 max-w-xs">{p.title}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} /> {p.city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="font-semibold text-[#1a2e5a]">PKR {formatPrice(p.price)}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${p.priceType === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.priceType}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold capitalize">{p.type}</span></td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'available' ? 'bg-emerald-100 text-emerald-700' : p.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell text-slate-500">{p.views}</td>
                {canFeature && (
                  <td className="px-5 py-4">
                    <button onClick={() => toggleFeatured(p)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${p.featured ? 'bg-amber-400 text-amber-900' : 'bg-gray-100 text-gray-500 hover:bg-amber-100'}`}>
                      {p.featured ? '★ Featured' : '☆ Feature'}
                    </button>
                  </td>
                )}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/properties/${p.slug}`} target="_blank" className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Eye size={16} /></Link>
                    <Link href={`/dashboard/properties/${(p as any)._id}/edit`} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil size={16} /></Link>
                    {canDelete && (
                      <button onClick={() => deleteProperty(p)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
