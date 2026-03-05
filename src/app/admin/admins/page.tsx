'use client';
import { useState, useEffect } from 'react';
import { UserPlus, Eye, EyeOff, Save, Trash2, Shield, ShieldCheck, Clock } from 'lucide-react';
import { api } from '@/lib/api-client';

interface AdminUser { _id: string; name: string; email: string; role: 'superadmin' | 'admin'; createdAt: string; active: boolean; }

export default function AdminRegistrationPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' as 'admin' | 'superadmin' });

  useEffect(() => {
    api.get<AdminUser[]>('/api/admins').then(d => setAdmins(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setSaving(true);
    try {
      const newAdmin = await api.post<AdminUser>('/api/admins', { name: form.name, email: form.email, password: form.password, role: form.role });
      setAdmins(a => [newAdmin, ...a]);
      setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' });
      setShowForm(false);
      setSuccess(`Admin "${newAdmin.name}" registered successfully.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (e: any) { setError(e.message || 'Failed to create admin'); } finally { setSaving(false); }
  };

  const deleteAdmin = async (admin: AdminUser) => {
    if (!confirm('Delete this admin user?')) return;
    await api.delete(`/api/admins/${admin._id}`);
    setAdmins(as => as.filter(a => a._id !== admin._id));
  };

  const roleColors: Record<string, string> = { superadmin: 'bg-purple-100 text-purple-700', admin: 'bg-blue-100 text-blue-700' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-extrabold text-[#1a2e5a]">Admin Users</h2><p className="text-slate-500 text-sm">{admins.filter(a => a.active).length} active admins</p></div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm">
          <UserPlus size={18} /> Register Admin
        </button>
      </div>

      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2"><ShieldCheck size={18} /> {success}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
          <h3 className="font-bold text-[#1a2e5a] text-lg mb-6 pb-3 border-b flex items-center gap-2"><UserPlus size={20} className="text-red-700" /> Register New Admin</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Full Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" placeholder="Sara Ahmed" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" placeholder="sara@nayabrealestate.com" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="w-full border-2 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-red-500" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Confirm Password *</label>
              <input type="password" required value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" placeholder="Re-enter password" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Role *</label>
              <div className="grid grid-cols-2 gap-3">
                {(['admin', 'superadmin'] as const).map(role => (
                  <label key={role} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.role === role ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="role" value={role} checked={form.role === role} onChange={() => setForm(f => ({ ...f, role }))} className="accent-red-700" />
                    <div>
                      <p className="font-bold text-[#1a2e5a] text-sm capitalize">{role === 'superadmin' ? 'Super Admin' : 'Admin'}</p>
                      <p className="text-xs text-slate-400">{role === 'superadmin' ? 'Full access' : 'Manage content'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60">
                <Save size={16} /> {saving ? 'Registering...' : 'Register Admin'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr className="bg-slate-50 border-b">
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Admin</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Registered</th>
            <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {admins.map(admin => (
              <tr key={admin._id} className="hover:bg-slate-50/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${admin.role === 'superadmin' ? 'bg-purple-600' : 'bg-blue-600'}`}>{admin.name[0]}</div>
                    <div><p className="font-semibold text-[#1a2e5a] text-sm">{admin.name}</p><p className="text-slate-400 text-xs">{admin.email}</p></div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5"><Shield size={13} className="text-slate-400" />
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleColors[admin.role]}`}>{admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}</span>
                  </div>
                </td>
                <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${admin.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{admin.active ? 'Active' : 'Inactive'}</span></td>
                <td className="px-5 py-4"><div className="flex items-center gap-1.5 text-slate-500 text-xs"><Clock size={12} />{new Date(admin.createdAt).toLocaleDateString()}</div></td>
                <td className="px-5 py-4 text-right">
                  {admin.role !== 'superadmin' ? (
                    <button onClick={() => deleteAdmin(admin)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={15} /></button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Protected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}