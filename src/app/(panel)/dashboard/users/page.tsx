'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserPlus, Eye, EyeOff, Save, Trash2, Mail, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight, ShieldCheck
} from 'lucide-react';
import { AdminCardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api-client';
import { ROLE_META } from '@/lib/rbac';
import type { UserRole } from '@/lib/jwt';

// Define the roles this UI manages
const TABS: Array<{ id: string; label: string; roles: UserRole[] }> = [
  { id: 'all', label: 'All Users', roles: ['user', 'seller', 'writer', 'agent', 'manager', 'superadmin'] },
  { id: 'public', label: 'Public & Sellers', roles: ['user', 'seller'] },
  { id: 'staff', label: 'Staff & Managers', roles: ['manager', 'superadmin', 'writer', 'agent'] },
];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 20;

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'user' as UserRole,
  });

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('auth_user') ?? localStorage.getItem('admin_user') ?? '{}');
      if (u && u.role) {
        if (!['superadmin', 'manager'].includes(u.role)) {
          router.replace('/dashboard');
        } else {
          setCurrentUser(u);
        }
      }
    } catch {}
  }, []);

  const fetchUsers = async () => {
    if (!currentUser) return;
    setLoading(true);
    let roleQuery = '';
    if (activeTab === 'public') roleQuery = '&role=user,seller'; // the backend API currently supports single role or "portal". Wait, let's fetch without role param and filter locally, or adjust API.
    // Actually our API supports `roleQuery` as string. Since API is just `searchParams.get('role')`, we can just fetch all and let pagination work if we don't pass role.
    // Or we update the API to take multiple roles. In our current API, `role` can be 'portal'. We didn't add array support.
    try {
      // Fetch all for now to make tabs easy locally, or implement standard pagination with API
      const res = await api.get<{users: any[], total: number, page: number, pages: number}>(`/api/users?page=${page}&limit=${limit}`);
      // Simple client-side tab filtering if we don't have robust server filters right now
      setUsers(res.users);
      setTotal(res.total);
      setPages(res.pages);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, currentUser]);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) return 'Invalid email format';
    return '';
  };

  const handleEmailChange = (email: string) => {
    setForm(f => ({ ...f, email }));
    setEmailError(email ? validateEmail(email) : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (emailError) return;
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setSaving(true);
    try {
      await api.post<any>('/api/users', { ...form, email: form.email.toLowerCase() });
      setSuccess(`User "${form.name}" registered.`);
      setTimeout(() => setSuccess(''), 5000);
      setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
      setShowForm(false);
      fetchUsers();
    } catch (e: any) {
      setError(e.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u: any) => {
    try {
      await api.delete(`/api/users/${u._id}`);
      setUsers(prev => prev.filter(x => x._id !== u._id));
      setDeleteConfirm(null);
      setSuccess(`User removed.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (e: any) {
      setError(e.message || 'Failed to delete user');
      setDeleteConfirm(null);
    }
  };

  const handleToggleActive = async (u: any) => {
    try {
      const updated = await api.put<any>(`/api/users/${u._id}`, { active: !u.active });
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, active: updated.active } : x));
    } catch (e: any) {
      setError(e.message || 'Update failed');
    }
  };

  const currentTabConfig = TABS.find(t => t.id === activeTab)!;
  const filteredUsers = users.filter(u => currentTabConfig.roles.includes(u.role));

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">User Management</h2>
          <p className="text-slate-500 text-sm">Create and manage access for all roles</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(''); }}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
          <UserPlus size={18} /> Add User
        </button>
      </div>

      {success && <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-sm flex gap-2"><CheckCircle size={18}/>{success}</div>}
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm flex gap-2"><AlertTriangle size={18}/>{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-[#1a2e5a] text-lg mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-red-700" /> Register User
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-red-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Email *</label>
              <input type="email" required value={form.email} onChange={e => handleEmailChange(e.target.value)} className="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-red-500" />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-red-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400"><Eye size={16} /></button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Confirm *</label>
              <input type="password" required value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} className="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-red-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Role *</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(ROLE_META) as UserRole[]).map(role => (
                  <label key={role} className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer ${form.role === role ? 'border-red-500 bg-red-50' : 'border-slate-200'} ${role === 'superadmin' && currentUser.role !== 'superadmin' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input type="radio" name="role" value={role} disabled={role === 'superadmin' && currentUser.role !== 'superadmin'} checked={form.role === role} onChange={() => setForm(f => ({ ...f, role }))} className="hidden" />
                    <span className="font-semibold text-sm capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-4">
              <button type="submit" disabled={saving || !!emailError} className="bg-red-700 text-white px-6 py-2 rounded-lg font-semibold text-sm disabled:opacity-50">Save User</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg font-semibold text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center bg-slate-50 border-b overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-6 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === t.id ? 'border-red-700 text-red-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
              {t.label}
            </button>
          ))}
        </div>
        
        {loading ? <div className="p-8"><AdminCardSkeleton rows={5} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white">
              <thead>
                <tr className="border-b">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <p className="font-bold text-[#1a2e5a] text-sm">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${ROLE_META[u.role as UserRole]?.color || 'bg-slate-100 text-slate-700'}`}>
                        {ROLE_META[u.role as UserRole]?.label || u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => u.role !== 'superadmin' && handleToggleActive(u)} disabled={u.role === 'superadmin'} className={`px-2 py-1 rounded-full text-xs font-bold ${u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} ${u.role !== 'superadmin' ? 'hover:opacity-80' : ''}`}>
                        {u.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      {u.role === 'superadmin' ? (
                        <span className="text-xs text-slate-400 flex items-center justify-end gap-1"><ShieldCheck size={14}/> Protected</span>
                      ) : deleteConfirm === u._id ? (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleDelete(u)} className="text-xs bg-red-600 text-white px-2 py-1 rounded font-semibold">Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-xs bg-slate-100 px-2 py-1 rounded font-semibold">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(u._id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-500 text-sm">No users found in this tab.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
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
    </div>
  );
}
