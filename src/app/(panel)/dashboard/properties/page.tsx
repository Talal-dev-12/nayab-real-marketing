'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Search, MapPin, Eye, Pencil, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { can } from '@/lib/rbac';
import { formatArea } from '@/lib/areaUtils';
import type { UserRole } from '@/lib/jwt';
import type { AreaUnit } from '@/lib/areaUtils';

function useCurrentUser() {
  const [user, setUser] = useState<{ id: string; role: UserRole } | null>(null);
  useEffect(() => {
    let parsed: any = null;
    const raw = localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user');
    if (raw) try { parsed = JSON.parse(raw); } catch { /* ignore */ }
    
    const token = localStorage.getItem('auth_token') ?? localStorage.getItem('admin_token');
    if (token && parsed && !parsed.id && !parsed._id) {
      try {
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr);
        if (payload.id) parsed.id = payload.id;
      } catch { /* ignore */ }
    }
    
    setUser(parsed);
  }, []);
  return user;
}

const APPROVAL_BADGE: Record<string, { label: string; cls: string }> = {
  pending:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-700'     },
  approved: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700'         },
};

export default function DashboardProperties() {
  const currentUser = useCurrentUser();
  const [properties, setProperties] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 8;

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const t = p.get('tab');
      if (t && ['all', 'pending', 'approved', 'rejected'].includes(t)) {
        setActiveTab(t);
      }
    }
  }, []);

  // Review Modal state
  const [reviewProperty, setReviewProperty] = useState<any | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  const fetchProperties = async () => {
    if (!currentUser) return;
    setLoading(true);
    let url = `/api/properties?dashboard=true&page=${page}&limit=${limit}&_t=${Date.now()}`;
    
    const uid = currentUser.id || (currentUser as any)._id;

    if (currentUser.role === 'seller') {
      url += `&submittedBy=${uid}`;
    } else if (currentUser.role === 'agent') {
      url += `&agentId=${uid}`; // Optional: Agents only view assigned properties. But currently we use manageAllProperties.
    }

    if (!can(currentUser.role, 'manageAllProperties') && currentUser.role !== 'seller') {
      // agent scoping
      url += `&agentId=${uid}`;
    }

    if (activeTab !== 'all') {
      url += `&approvalStatus=${activeTab}`;
    }

    try {
      const data = await api.get<any>(url);
      setProperties(data.properties ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [currentUser, page, activeTab]);

  const deleteProperty = async (p: any) => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    try {
      await api.delete(`/api/properties/${p._id}`);
      fetchProperties(); // re-fetch to keep the table full at 8 rows
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  const toggleFeatured = async (p: any) => {
    const updated = await api.put<any>(`/api/properties/${p._id}`, { featured: !p.featured });
    setProperties(ps => ps.map(x => x._id === updated._id ? updated : x));
  };

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!reviewProperty) return;
    if (status === 'rejected' && !rejectionNote.trim()) {
      alert('A rejection reason is required.');
      return;
    }
    try {
      const updated = await api.put<any>(`/api/properties/${reviewProperty._id}`, { 
        approvalStatus: status,
        rejectionNote: status === 'rejected' ? rejectionNote : ''
      });
      setProperties(ps => ps.map(x => x._id === updated._id ? updated : x));
      setReviewProperty(null);
      setRejectionNote('');
    } catch (e: any) {
      alert(e.message || 'Update failed');
    }
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
  const uid        = currentUser.id || (currentUser as any)._id;
  const role       = currentUser.role;
  const canFeature = can(role, 'markFeatured');
  const isSeller   = role === 'seller';
  const canManage  = can(role, 'manageAllProperties');
  const canDelete  = (p: any) => can(role, 'deleteAnyProperty') || (isSeller && p.submittedBy === uid);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">
            {isSeller ? 'My Properties' : 'Properties'}
          </h2>
          <p className="text-slate-500 text-sm">{total} total listings</p>
        </div>
        <Link href="/dashboard/properties/new"
          className="bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Property
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm text-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['all', 'pending', 'approved', 'rejected'].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`px-4 py-1.5 rounded-md font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#1a2e5a]' : 'text-slate-500 hover:text-[#1a2e5a]'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5 max-w-sm ml-4 basis-1/3">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search properties..." className="outline-none text-sm flex-1 min-w-0"
              onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Property</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Price</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Area</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Review</th>
                {canFeature && <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Featured</th>}
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <TableRowSkeleton cols={canFeature ? 7 : 6} rows={8} />
              ) : filtered.map(p => {
                const ab = APPROVAL_BADGE[p.approvalStatus] || APPROVAL_BADGE.pending;
                const areaDisplay = p.area ? formatArea(p.area, (p.areaUnit as AreaUnit) || 'sqft') : '—';
                return (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0] || '/images/placeholder-property.jpg'} className="w-12 h-10 rounded-lg object-cover bg-slate-200" alt="" />
                        <div>
                          <p className="font-semibold text-[#1a2e5a] line-clamp-1 max-w-[200px]">{p.title}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} /> {p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="font-semibold text-[#1a2e5a]">PKR {formatPrice(p.price)}</span>
                      <span className={`ml-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${p.priceType === 'sale' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.priceType}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-slate-600 text-xs font-medium">{areaDisplay}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'available' ? 'bg-emerald-100 text-emerald-700' : p.status === 'sold' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      {p.approvalStatus === 'pending' && canManage ? (
                        <button onClick={() => setReviewProperty(p)} className="px-3 py-1 text-xs font-bold bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors">
                          Review Request
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold ${ab.cls}`}>{ab.label}</span>
                          {p.approvalStatus === 'rejected' && p.rejectionNote && isSeller && (
                             <span className="text-xs text-red-600 truncate max-w-[120px]" title={p.rejectionNote}>Reason: {p.rejectionNote}</span>
                          )}
                        </div>
                      )}
                    </td>
                    {canFeature && (
                      <td className="px-5 py-4">
                        <button onClick={() => toggleFeatured(p)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${p.featured ? 'bg-amber-400 text-amber-900 border border-amber-500' : 'bg-gray-100 text-gray-500 hover:bg-amber-100'}`}>
                          {p.featured ? '★ Featured' : '☆ Feature'}
                        </button>
                      </td>
                    )}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/properties/${p.slug}`} target="_blank" className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Eye size={16} /></Link>
                        <Link href={`/dashboard/properties/${p._id}/edit`} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil size={16} /></Link>
                        {canDelete(p) && (
                          <button onClick={() => deleteProperty(p)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm">No properties found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t bg-slate-50">
          <p className="text-xs text-slate-500">Showing page {page} of {pages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded bg-white border shadow-sm disabled:opacity-50 hover:bg-slate-50">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-1 rounded bg-white border shadow-sm disabled:opacity-50 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-bold text-[#1a2e5a]">Review Property</h3>
              <button onClick={() => { setReviewProperty(null); setRejectionNote(''); }} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"><XCircle size={20}/></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 mb-4">You are reviewing <strong>{reviewProperty.title}</strong> submitted for approval.</p>
              
              <div className="mb-5">
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Rejection Note (Optional for Approval)</label>
                <textarea 
                  className="w-full border-2 rounded-lg p-3 text-sm focus:border-red-500 min-h-[80px]" 
                  placeholder="If rejecting, explain why here..."
                  value={rejectionNote}
                  onChange={e => setRejectionNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleReview('approved')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold">
                  <CheckCircle size={18}/> Approve
                </button>
                <button onClick={() => handleReview('rejected')} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold">
                  <XCircle size={18}/> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
