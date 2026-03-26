'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus, Trash2, Phone, Mail, Pencil, X, Save, Loader2,
  Upload, Eye, Home, TrendingUp, BarChart3, Star, CheckCircle, AlertTriangle,
} from 'lucide-react';
import { api, uploadImage } from '@/lib/api-client';
import { AdminCardSkeleton } from '@/components/ui/Skeleton';
import type { Agent } from '@/types';

interface AgentWithStats extends Agent {
  _id: string;
  totalViews: number;
  listedCount: number;
  soldCount: number;
}

interface EditForm {
  name: string; email: string; phone: string;
  bio: string; specialization: string; image: string; active: boolean;
}

const SPECS = [
  'Residential & Commercial','Luxury & Plots','Commercial & Investment',
  'Rental Properties','Industrial & Warehouse','Overseas Investors',
  'New Projects & Bookings','DHA Specialist','Bahria Town Specialist',
];

export default function AdminAgents() {
  const [agents,    setAgents]    = useState<AgentWithStats[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState<'profiles'|'performance'>('profiles');
  const [editId,    setEditId]    = useState<string|null>(null);
  const [editForm,  setEditForm]  = useState<EditForm|null>(null);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId,  setDeleteId]  = useState<string|null>(null);
  const [success,   setSuccess]   = useState('');
  const [error,     setError]     = useState('');

  useEffect(() => {
    Promise.all([
      api.get<Agent[]>('/api/agents'),
      api.get<any>('/api/properties?limit=500'),
    ])
      .then(([agentList, propData]) => {
        const props: any[] = propData.properties ?? [];
        const enriched: AgentWithStats[] = (Array.isArray(agentList) ? agentList : []).map((a: any) => {
          const mine = props.filter(p => p.agentId === a._id);
          return {
            ...a,
            totalViews:  mine.reduce((s: number, p: any) => s + (p.views || 0), 0),
            listedCount: mine.filter(p => p.status === 'available').length,
            soldCount:   mine.filter(p => p.status === 'sold' || p.status === 'rented').length,
          };
        });
        setAgents(enriched);
      })
      .catch(() => setError('Failed to load agents'))
      .finally(() => setLoading(false));
  }, []);

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 4000); };

  const openEdit = (a: AgentWithStats) => {
    setEditId(a._id);
    setEditForm({ name: a.name, email: a.email, phone: a.phone, bio: a.bio, specialization: a.specialization, image: a.image, active: a.active });
    setError('');
  };
  const closeEdit = () => { setEditId(null); setEditForm(null); setError(''); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editForm) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditForm(f => f ? { ...f, image: url } : f);
    } catch (err: any) { setError(err.message || 'Upload failed'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSave = async () => {
    if (!editId || !editForm) return;
    if (!editForm.name || !editForm.email || !editForm.phone) { setError('Name, email, and phone are required.'); return; }
    setSaving(true); setError('');
    try {
      const updated = await api.put<any>(`/api/agents/${editId}`, editForm);
      setAgents(prev => prev.map(a => a._id === editId ? { ...a, ...updated } : a));
      closeEdit(); flash('Agent details updated successfully.');
    } catch (err: any) { setError(err.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (a: AgentWithStats) => {
    try {
      await api.delete(`/api/agents/${a._id}`);
      setAgents(prev => prev.filter(x => x._id !== a._id));
      setDeleteId(null); flash(`"${a.name}" removed.`);
    } catch (err: any) { setError(err.message || 'Delete failed'); setDeleteId(null); }
  };

  const toggleActive = async (a: AgentWithStats) => {
    try {
      const updated = await api.put<any>(`/api/agents/${a._id}`, { active: !a.active });
      setAgents(prev => prev.map(x => x._id === a._id ? { ...x, active: updated.active } : x));
    } catch (err: any) { setError(err.message || 'Update failed'); }
  };

  const totalViews  = agents.reduce((s, a) => s + a.totalViews, 0);
  const totalProps  = agents.reduce((s, a) => s + (a.properties || 0), 0);
  const activeCount = agents.filter(a => a.active).length;
  const sorted      = [...agents].sort((a, b) => b.totalViews - a.totalViews);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Agents</h2>
          <p className="text-slate-500 text-sm">{activeCount} active · {agents.length} total</p>
        </div>
        <Link href="/dashboard/agents/new" className="bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
          <Plus size={18} /> Add Agent
        </Link>
      </div>

      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2"><CheckCircle size={16} />{success}</div>}
      {error && !editId && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"><AlertTriangle size={16} />{error}</div>}

      {/* Summary */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Agents',   value: agents.length,                  icon: Star,       color: 'bg-blue-50 text-blue-700' },
            { label: 'Active',         value: activeCount,                    icon: CheckCircle,color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Total Listings', value: totalProps,                     icon: Home,       color: 'bg-amber-50 text-amber-700' },
            { label: 'Combined Views', value: totalViews.toLocaleString(),    icon: Eye,        color: 'bg-purple-50 text-purple-700' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}><Icon size={18} /></div>
              <div>
                <p className="text-xl font-extrabold text-[#1a2e5a]">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b">
        {(['profiles','performance'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${tab === t ? 'text-red-700 border-b-2 border-red-700' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'profiles' ? '👤 Agent Profiles' : '📊 Performance'}
          </button>
        ))}
      </div>

      {/* ── PROFILES ── */}
      {tab === 'profiles' && (
        loading ? <AdminCardSkeleton rows={6} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map(agent => (
              <div key={agent._id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="relative h-24 bg-gradient-to-r from-[#0f1e3d] to-[#1a2e5a]">
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${agent.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {agent.active ? 'Active' : 'Inactive'}
                  </div>
                  <img
                    src={agent.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=1a2e5a&color=fff`}
                    alt={agent.name}
                    className="absolute bottom-0 left-5 translate-y-1/2 w-20 h-20 rounded-full border-4 border-white object-cover shadow-md"
                  />
                </div>
                <div className="px-5 pb-5 pt-14 flex-1 flex flex-col">
                  <h3 className="font-bold text-[#1a2e5a] text-lg leading-tight">{agent.name}</h3>
                  <p className="text-red-700 text-sm font-semibold mb-1">{agent.specialization}</p>
                  <p className="text-slate-500 text-xs mb-3 line-clamp-2 flex-1">{agent.bio || 'No bio added yet.'}</p>
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-600"><Phone size={12} className="text-red-700 shrink-0" />{agent.phone}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 min-w-0"><Mail size={12} className="text-red-700 shrink-0" /><span className="truncate">{agent.email}</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-t border-b text-center">
                    <div><p className="text-base font-extrabold text-[#1a2e5a]">{agent.listedCount}</p><p className="text-[10px] text-slate-400 uppercase">Listed</p></div>
                    <div><p className="text-base font-extrabold text-[#1a2e5a]">{agent.soldCount}</p><p className="text-[10px] text-slate-400 uppercase">Sold</p></div>
                    <div><p className="text-base font-extrabold text-[#1a2e5a]">{agent.totalViews >= 1000 ? `${(agent.totalViews/1000).toFixed(1)}k` : agent.totalViews}</p><p className="text-[10px] text-slate-400 uppercase">Views</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(agent)} className="flex-1 flex items-center justify-center gap-1.5 bg-[#1a2e5a] hover:bg-[#243d6e] text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => toggleActive(agent)} className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${agent.active ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                      {agent.active ? 'Deactivate' : 'Activate'}
                    </button>
                    {deleteId === agent._id ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(agent)} className="px-2 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold">Yes</button>
                        <button onClick={() => setDeleteId(null)} className="px-2 py-2 bg-slate-100 rounded-lg text-xs font-semibold">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(agent._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {agents.length === 0 && (
              <div className="col-span-3 text-center py-20 text-slate-400">
                <Home size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="font-semibold">No agents yet.</p>
                <Link href="/admin/agents/new" className="text-red-700 text-sm font-semibold hover:underline mt-2 inline-block">Add the first agent →</Link>
              </div>
            )}
          </div>
        )
      )}

      {/* ── PERFORMANCE ── */}
      {tab === 'performance' && (
        loading ? <AdminCardSkeleton rows={6} /> : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2">
              <BarChart3 size={15} className="text-red-700" />
              <span className="text-xs font-semibold text-slate-500 uppercase">Agent Performance Rankings — sorted by total views</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {['#','Agent','Specialization','Total Listings','Available','Sold/Rented','Total Views','Status','Actions'].map(h => (
                      <th key={h} className={`px-5 py-3 text-xs font-semibold text-slate-500 uppercase ${h === 'Agent' || h === '#' || h === 'Specialization' || h === 'Actions' ? 'text-left' : 'text-center'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sorted.map((agent, i) => (
                    <tr key={agent._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'}`}>{i+1}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={agent.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=1a2e5a&color=fff`} alt={agent.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                          <div>
                            <p className="font-semibold text-[#1a2e5a] text-sm">{agent.name}</p>
                            <p className="text-xs text-slate-400">{agent.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">{agent.specialization}</span></td>
                      <td className="px-5 py-4 text-center font-bold text-[#1a2e5a]">{agent.properties}</td>
                      <td className="px-5 py-4 text-center font-semibold text-emerald-700">{agent.listedCount}</td>
                      <td className="px-5 py-4 text-center font-semibold text-amber-700">{agent.soldCount}</td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-purple-700 font-bold">
                          <Eye size={13} className="text-purple-400" />
                          {agent.totalViews >= 1000 ? `${(agent.totalViews/1000).toFixed(1)}k` : agent.totalViews}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${agent.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{agent.active ? '● Active' : '○ Inactive'}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => { openEdit(agent); setTab('profiles'); }} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a2e5a] hover:text-red-700 transition-colors">
                          <Pencil size={13} /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {agents.length === 0 && <tr><td colSpan={9} className="text-center py-16 text-slate-400 text-sm">No agents found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* ── EDIT MODAL ── */}
      {editId && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="font-extrabold text-[#1a2e5a] text-lg">Edit Agent Details</h3>
              <button onClick={closeEdit} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"><AlertTriangle size={15} />{error}</div>}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Agent Photo</label>
                <div className="flex items-center gap-4">
                  <img src={editForm.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(editForm.name)}&background=1a2e5a&color=fff`} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-slate-200 shrink-0" />
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    {uploading ? <><Loader2 size={15} className="animate-spin" />Uploading...</> : <><Upload size={15} />Change Photo</>}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {editForm.image && <button onClick={() => setEditForm(f => f ? { ...f, image: '' } : f)} className="text-xs text-red-600 hover:underline font-medium">Remove</button>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {([
                  { label: 'Full Name *',     key: 'name',  type: 'text',  placeholder: 'Muhammad Ali' },
                  { label: 'Email *',         key: 'email', type: 'email', placeholder: 'ali@nayabrealestate.com' },
                  { label: 'Phone *',         key: 'phone', type: 'tel',   placeholder: '+92-300-0000000' },
                ] as const).map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">{label}</label>
                    <input type={type} value={(editForm as any)[key]} placeholder={placeholder}
                      onChange={e => setEditForm(f => f ? { ...f, [key]: e.target.value } : f)}
                      className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Specialization</label>
                  <select value={editForm.specialization} onChange={e => setEditForm(f => f ? { ...f, specialization: e.target.value } : f)}
                    className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 transition-colors">
                    {SPECS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Bio / About</label>
                <textarea rows={4} value={editForm.bio} onChange={e => setEditForm(f => f ? { ...f, bio: e.target.value } : f)}
                  placeholder="Brief description of the agent's experience..." className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none transition-colors" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" id="activeToggle" checked={editForm.active} onChange={e => setEditForm(f => f ? { ...f, active: e.target.checked } : f)} className="w-4 h-4 accent-red-700" />
                <span className="text-sm font-semibold text-slate-700">Active Agent <span className="text-slate-400 font-normal">(visible on public agents page)</span></span>
              </label>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t bg-slate-50 sticky bottom-0">
              <button onClick={handleSave} disabled={saving || uploading} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-60 transition-colors">
                {saving ? <><Loader2 size={15} className="animate-spin" />Saving...</> : <><Save size={15} />Save Changes</>}
              </button>
              <button onClick={closeEdit} className="px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-600 bg-white border-2 hover:bg-slate-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}