'use client';
import { useState, useEffect } from 'react';
import {
  UserPlus, Eye, EyeOff, Save, Trash2, PenTool, FileText,
  Clock, Mail, CheckCircle, XCircle, AlertTriangle, BarChart3,
  TrendingUp, Home,
} from 'lucide-react';
import { api } from '@/lib/api-client';

interface PortalUser {
  _id: string; name: string; email: string;
  role: 'agent' | 'writer'; createdAt: string;
  active: boolean; lastLogin?: string;
}
interface PortalUserWithStats extends PortalUser {
  itemCount: number;
  totalViews: number;
  avgViews: number;
}

function validateEmail(email: string) {
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) return 'Invalid email format';
  const banned = ['@example.com','@test.com','@fake.com','@placeholder.com','@domain.com','@email.com'];
  if (banned.some(b => email.toLowerCase().endsWith(b))) return 'Please use a real email address';
  return '';
}

export default function AdminWritersPage() {
  const [users,       setUsers]      = useState<PortalUserWithStats[]>([]);
  const [loading,     setLoading]    = useState(true);
  const [tab,         setTab]        = useState<'writer'|'agent'>('writer');
  const [viewMode,    setViewMode]   = useState<'list'|'performance'>('list');
  const [showForm,    setShowForm]   = useState(false);
  const [showPass,    setShowPass]   = useState(false);
  const [saving,      setSaving]     = useState(false);
  const [success,     setSuccess]    = useState('');
  const [error,       setError]      = useState('');
  const [emailError,  setEmailError] = useState('');
  const [delConfirm,  setDelConfirm] = useState<string|null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'writer' as 'writer'|'agent' });

  useEffect(() => {
    Promise.all([
      api.get<PortalUser[]>('/api/admins'),
      api.get<any>('/api/blogs?limit=500'),
      api.get<any>('/api/properties?limit=500'),
    ])
      .then(([adminList, blogData, propData]) => {
        const portalUsers = (Array.isArray(adminList) ? adminList : []).filter(u => u.role === 'writer' || u.role === 'agent') as PortalUser[];
        const blogs: any[] = blogData.blogs ?? [];
        const props: any[] = propData.properties ?? [];

        const enriched: PortalUserWithStats[] = portalUsers.map(u => {
          if (u.role === 'writer') {
            const mine = blogs.filter(b => b.authorId === u._id);
            const totalViews = mine.reduce((s, b) => s + (b.views || 0), 0);
            return { ...u, itemCount: mine.length, totalViews, avgViews: mine.length ? Math.round(totalViews / mine.length) : 0 };
          } else {
            // agent role in AdminUser — match by email to Agent model isn't reliable here;
            // we show the portal account's property ownership via agentId = adminUser._id
            const mine = props.filter(p => p.agentId === u._id);
            const totalViews = mine.reduce((s, p) => s + (p.views || 0), 0);
            return { ...u, itemCount: mine.length, totalViews, avgViews: mine.length ? Math.round(totalViews / mine.length) : 0 };
          }
        });
        setUsers(enriched);
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => u.role === tab);
  const sorted   = [...filtered].sort((a, b) => b.totalViews - a.totalViews);

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 5000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    const emailErr = validateEmail(form.email);
    if (emailErr) { setEmailError(emailErr); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!/[A-Z]/.test(form.password)) { setError('Password must contain an uppercase letter'); return; }
    if (!/[0-9]/.test(form.password)) { setError('Password must contain a number'); return; }
    setSaving(true);
    try {
      const newUser = await api.post<PortalUser>('/api/admins', { name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password, role: form.role });
      setUsers(prev => [{ ...newUser, itemCount: 0, totalViews: 0, avgViews: 0 }, ...prev]);
      setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'writer' });
      setShowForm(false);
      flash(`${form.role === 'writer' ? 'Writer' : 'Agent'} "${form.name}" created.`);
    } catch (err: any) { setError(err.message || 'Failed to create user'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (u: PortalUserWithStats) => {
    try {
      await api.delete(`/api/admins/${u._id}`);
      setUsers(prev => prev.filter(x => x._id !== u._id));
      setDelConfirm(null); flash(`"${u.name}" removed.`);
    } catch (err: any) { setError(err.message || 'Failed to delete'); setDelConfirm(null); }
  };

  const handleToggle = async (u: PortalUserWithStats) => {
    try {
      const updated = await api.put<PortalUser>(`/api/admins/${u._id}`, { active: !u.active });
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, active: updated.active } : x));
    } catch (err: any) { setError(err.message || 'Update failed'); }
  };

  const writerCount = users.filter(u => u.role === 'writer').length;
  const agentCount  = users.filter(u => u.role === 'agent').length;
  const totalWriterViews = users.filter(u => u.role === 'writer').reduce((s, u) => s + u.totalViews, 0);
  const totalAgentViews  = users.filter(u => u.role === 'agent').reduce((s, u) => s + u.totalViews, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Portal Users</h2>
          <p className="text-slate-500 text-sm">Manage content writers and agent accounts</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(''); }}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
          <UserPlus size={18} /> Add User
        </button>
      </div>

      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2"><CheckCircle size={16} />{success}</div>}
      {error   && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"><AlertTriangle size={16} />{error}</div>}

      {/* Summary cards */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Content Writers', value: writerCount,                         icon: FileText,   color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Agent Accounts',  value: agentCount,                          icon: Home,       color: 'bg-blue-50 text-blue-700'       },
            { label: 'Writer Views',    value: totalWriterViews.toLocaleString(),    icon: Eye,        color: 'bg-purple-50 text-purple-700'   },
            { label: 'Agent Views',     value: totalAgentViews.toLocaleString(),     icon: TrendingUp, color: 'bg-amber-50 text-amber-700'     },
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

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="font-bold text-[#1a2e5a] text-lg mb-4 flex items-center gap-2"><UserPlus size={18} className="text-red-700" /> Create Portal Account</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Full Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Sara Ahmed" className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Email *</label>
              <div className="relative">
                <input type="email" required value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setEmailError(e.target.value ? validateEmail(e.target.value) : ''); }}
                  placeholder="sara@gmail.com" className={`w-full border-2 rounded-lg px-3 py-2.5 pr-9 text-sm outline-none ${emailError ? 'border-red-400' : form.email && !emailError ? 'border-emerald-400' : 'focus:border-red-500'}`} />
                {form.email && <span className="absolute right-3 top-1/2 -translate-y-1/2">{emailError ? <XCircle size={15} className="text-red-500" /> : <CheckCircle size={15} className="text-emerald-500" />}</span>}
              </div>
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min 8 chars, 1 uppercase, 1 number" className="w-full border-2 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-red-500" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input type="password" required value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Re-enter password" className={`w-full border-2 rounded-lg px-3 py-2.5 pr-9 text-sm outline-none ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-400' : form.confirmPassword && form.password === form.confirmPassword ? 'border-emerald-400' : 'focus:border-red-500'}`} />
                {form.confirmPassword && <span className="absolute right-3 top-1/2 -translate-y-1/2">{form.password === form.confirmPassword ? <CheckCircle size={15} className="text-emerald-500" /> : <XCircle size={15} className="text-red-500" />}</span>}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Portal Role *</label>
              <div className="grid grid-cols-2 gap-3">
                {(['writer','agent'] as const).map(role => (
                  <label key={role} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.role === role ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="portalRole" value={role} checked={form.role === role} onChange={() => setForm(f => ({ ...f, role }))} className="accent-red-700" />
                    <div>
                      <p className="font-bold text-[#1a2e5a] text-sm">{role === 'writer' ? 'Content Writer' : 'Agent'}</p>
                      <p className="text-xs text-slate-400">{role === 'writer' ? 'Create & manage blog articles' : 'List & manage properties'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2 border-t">
              <button type="submit" disabled={saving || !!emailError} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors">
                <Save size={16} /> {saving ? 'Creating...' : 'Create Account'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setError(''); setEmailError(''); }} className="px-6 py-2.5 rounded-lg font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Main panel */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Role tabs + view toggle */}
        <div className="flex items-center justify-between border-b px-2">
          <div className="flex">
            {(['writer','agent'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-3.5 text-sm font-semibold transition-colors ${tab === t ? 'text-red-700 border-b-2 border-red-700 bg-red-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                {t === 'writer' ? `✍️ Content Writers (${writerCount})` : `🏠 Agents (${agentCount})`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 pr-4">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${viewMode === 'list' ? 'bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}>List</button>
            <button onClick={() => setViewMode('performance')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${viewMode === 'performance' ? 'bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}>
              <BarChart3 size={13} /> Performance
            </button>
          </div>
        </div>

        {loading ? <div className="py-16 text-center text-slate-400">Loading...</div>
        : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <PenTool size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-500 font-semibold">No {tab === 'writer' ? 'writers' : 'agents'} yet</p>
            <button onClick={() => { setForm(f => ({ ...f, role: tab })); setShowForm(true); }} className="text-red-700 text-sm font-semibold hover:underline mt-2 inline-block">Create one →</button>
          </div>
        ) : viewMode === 'list' ? (
          /* ── LIST VIEW ── */
          <div className="divide-y">
            {filtered.map(u => (
              <div key={u._id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm ${tab === 'writer' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                  {u.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a2e5a] text-sm">{u.name}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><Mail size={10} />{u.email}</div>
                </div>
                {/* Quick stats */}
                <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 mr-2">
                  <div className="text-center">
                    <p className="font-bold text-[#1a2e5a] text-sm">{u.itemCount}</p>
                    <p className="text-[10px] uppercase">{tab === 'writer' ? 'Articles' : 'Props'}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-purple-700 text-sm">{u.totalViews >= 1000 ? `${(u.totalViews/1000).toFixed(1)}k` : u.totalViews}</p>
                    <p className="text-[10px] uppercase">Views</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mr-2"><Clock size={11} />{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</div>
                <button onClick={() => handleToggle(u)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${u.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {u.active ? '● Active' : '○ Inactive'}
                </button>
                {delConfirm === u._id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600 font-medium">Delete?</span>
                    <button onClick={() => handleDelete(u)} className="text-xs bg-red-600 text-white px-2 py-1 rounded font-semibold">Yes</button>
                    <button onClick={() => setDelConfirm(null)} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold">No</button>
                  </div>
                ) : (
                  <button onClick={() => setDelConfirm(u._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* ── PERFORMANCE VIEW ── */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase">{tab === 'writer' ? 'Articles' : 'Properties'}</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Total Views</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Avg Views</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Last Login</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sorted.map((u, i) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400'}`}>{i+1}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${tab === 'writer' ? 'bg-emerald-600' : 'bg-blue-600'}`}>{u.name[0]?.toUpperCase()}</div>
                        <span className="font-semibold text-[#1a2e5a] text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{u.email}</td>
                    <td className="px-5 py-4 text-center font-bold text-[#1a2e5a]">{u.itemCount}</td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-purple-700">
                        <Eye size={13} className="text-purple-400" />
                        {u.totalViews >= 1000 ? `${(u.totalViews/1000).toFixed(1)}k` : u.totalViews}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center text-sm font-semibold text-slate-600">{u.avgViews.toLocaleString()}</td>
                    <td className="px-5 py-4 text-center text-xs text-slate-500">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{u.active ? '● Active' : '○ Inactive'}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => handleToggle(u)} className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${u.active ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}>
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>
                        {delConfirm === u._id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(u)} className="text-xs bg-red-600 text-white px-2 py-1 rounded font-semibold">Yes</button>
                            <button onClick={() => setDelConfirm(null)} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold">No</button>
                          </div>
                        ) : (
                          <button onClick={() => setDelConfirm(u._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}