'use client';
import { useState, useEffect } from 'react';
import { UserPlus, Eye, EyeOff, Save, Trash2, Shield, ShieldCheck, Clock } from 'lucide-react';
import { getFromStorage, saveToStorage } from '@/lib/data';

const ADMINS_KEY = 'nrm_admins';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  createdAt: string;
  lastLogin?: string;
  active: boolean;
}

const defaultAdmins: AdminUser[] = [
  {
    id: 'super-1',
    name: 'Super Admin',
    email: 'admin@nayabrealestate.com',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
    active: true,
  },
];

export default function AdminRegistrationPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'editor' as AdminUser['role'],
  });

  useEffect(() => {
    setAdmins(getFromStorage(ADMINS_KEY, defaultAdmins));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return alert('Please fill all required fields');
    if (form.password !== form.confirmPassword) return alert('Passwords do not match');
    if (form.password.length < 6) return alert('Password must be at least 6 characters');
    if (admins.find(a => a.email === form.email)) return alert('An admin with this email already exists');
    setSaving(true);
    const newAdmin: AdminUser = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      role: form.role,
      createdAt: new Date().toISOString(),
      active: true,
    };
    const updated = [newAdmin, ...admins];
    setAdmins(updated);
    saveToStorage(ADMINS_KEY, updated);
    setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'editor' });
    setShowForm(false);
    setSaving(false);
    setSuccess(`Admin "${newAdmin.name}" has been registered successfully.`);
    setTimeout(() => setSuccess(''), 4000);
  };

  const toggleActive = (id: string) => {
    if (id === 'super-1') return alert('Cannot deactivate super admin');
    const updated = admins.map(a => a.id === id ? { ...a, active: !a.active } : a);
    setAdmins(updated);
    saveToStorage(ADMINS_KEY, updated);
  };

  const deleteAdmin = (id: string) => {
    if (id === 'super-1') return alert('Cannot delete super admin');
    if (!confirm('Delete this admin user?')) return;
    const updated = admins.filter(a => a.id !== id);
    setAdmins(updated);
    saveToStorage(ADMINS_KEY, updated);
  };

  const roleColors: Record<string, string> = {
    super_admin: 'bg-purple-100 text-purple-700',
    admin: 'bg-blue-100 text-blue-700',
    editor: 'bg-amber-100 text-amber-700',
  };

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    editor: 'Editor',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Admin Users</h2>
          <p className="text-slate-500 text-sm">{admins.filter(a => a.active).length} active admins</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          <UserPlus size={18} /> Register Admin
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2">
          <ShieldCheck size={18} /> {success}
        </div>
      )}

      {/* Registration Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
          <h3 className="font-bold text-[#1a2e5a] text-lg mb-6 pb-3 border-b flex items-center gap-2">
            <UserPlus size={20} className="text-red-700" /> Register New Admin
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Sara Ahmed"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Email Address *</label>
              <input
                type="email"
                placeholder="sara@nayabrealestate.com"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border-2 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-red-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Confirm Password *</label>
              <input
                type="password"
                placeholder="Re-enter password"
                required
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Role *</label>
              <div className="grid grid-cols-3 gap-3">
                {(['super_admin', 'admin', 'editor'] as const).map(role => (
                  <label key={role} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.role === role ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="role" value={role} checked={form.role === role} onChange={() => setForm(f => ({ ...f, role }))} className="accent-red-700" />
                    <div>
                      <p className="font-bold text-[#1a2e5a] text-sm capitalize">{roleLabels[role]}</p>
                      <p className="text-xs text-slate-400">
                        {role === 'super_admin' ? 'Full access' : role === 'admin' ? 'Manage content' : 'Edit only'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors"
              >
                <Save size={16} /> {saving ? 'Registering...' : 'Register Admin'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Admin</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Registered</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {admins.map(admin => (
                <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${admin.role === 'super_admin' ? 'bg-purple-600' : admin.role === 'admin' ? 'bg-blue-600' : 'bg-amber-500'}`}>
                        {admin.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a2e5a] text-sm">{admin.name}</p>
                        <p className="text-slate-400 text-xs">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Shield size={13} className="text-slate-400" />
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleColors[admin.role]}`}>
                        {roleLabels[admin.role]}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${admin.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {admin.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Clock size={12} />
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {admin.id !== 'super-1' && (
                        <>
                          <button
                            onClick={() => toggleActive(admin.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${admin.active ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                          >
                            {admin.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteAdmin(admin.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                      {admin.id === 'super-1' && (
                        <span className="text-xs text-slate-400 italic">Protected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
