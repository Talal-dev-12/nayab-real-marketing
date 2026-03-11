'use client';
import { useState, useEffect } from 'react';
import { UserPlus, Eye, EyeOff, Save, Trash2, Shield, ShieldCheck, Clock, Mail, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { AdminCardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api-client';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
  active: boolean;
  lastLogin?: string;
}

function validateEmail(email: string) {
  // Strict email format — rejects fake/placeholder emails
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) return 'Invalid email format';
  const banned = ['@example.com', '@test.com', '@fake.com', '@placeholder.com', '@domain.com', '@email.com'];
  if (banned.some(b => email.toLowerCase().endsWith(b))) return 'Please use a real email address';
  return '';
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'admin' as 'admin' | 'superadmin',
  });

  useEffect(() => {
    api.get<AdminUser[]>('/api/admins')
      .then(d => setAdmins(Array.isArray(d) ? d : []))
      .catch(() => setError('Failed to load admin users'))
      .finally(() => setLoading(false));
  }, []);

  const handleEmailChange = (email: string) => {
    setForm(f => ({ ...f, email }));
    setEmailError(email ? validateEmail(email) : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailErr = validateEmail(form.email);
    if (emailErr) { setEmailError(emailErr); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!/[A-Z]/.test(form.password)) { setError('Password must contain at least one uppercase letter'); return; }
    if (!/[0-9]/.test(form.password)) { setError('Password must contain at least one number'); return; }

    setSaving(true);
    try {
      const newAdmin = await api.post<AdminUser>('/api/admins', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });
      setAdmins(prev => [newAdmin, ...prev]);
      setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' });
      setShowForm(false);
      setSuccess(`Admin "${newAdmin.name}" registered. They can now log in with their email and password, or via Google if their account uses that email.`);
      setTimeout(() => setSuccess(''), 6000);
    } catch (e: any) {
      setError(e.message || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    try {
      await api.delete(`/api/admins/${admin._id}`);
      setAdmins(prev => prev.filter(a => a._id !== admin._id));
      setDeleteConfirm(null);
      setSuccess(`Admin "${admin.name}" has been removed.`);
      setTimeout(() => setSuccess(''), 4000);
    } catch (e: any) {
      setError(e.message || 'Failed to delete admin');
      setDeleteConfirm(null);
    }
  };

  const handleToggleActive = async (admin: AdminUser) => {
    try {
      const updated = await api.put<AdminUser>(`/api/admins/${admin._id}`, { active: !admin.active });
      setAdmins(prev => prev.map(a => a._id === admin._id ? { ...a, active: updated.active } : a));
    } catch (e: any) {
      setError(e.message || 'Failed to update admin');
    }
  };

  const roleColors: Record<string, string> = {
    superadmin: 'bg-purple-100 text-purple-700 border border-purple-200',
    admin: 'bg-blue-100 text-blue-700 border border-blue-200',
  };

  if (loading) return <div className="space-y-5"><div className="h-10 bg-slate-200 rounded-xl animate-pulse w-48" /><AdminCardSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Admin Users</h2>
          <p className="text-slate-500 text-sm">{admins.filter(a => a.active).length} active · {admins.length} total</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(''); }}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
          <UserPlus size={18} /> Add Admin
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl text-sm flex items-start gap-2">
          <CheckCircle size={18} className="shrink-0 mt-0.5 text-emerald-600" />{success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm flex items-start gap-2">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />{error}
        </div>
      )}

      {/* Register form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-[#1a2e5a] text-lg mb-1 flex items-center gap-2">
            <UserPlus size={20} className="text-red-700" /> Register New Admin
          </h3>
          <p className="text-slate-400 text-xs mb-6">The admin will receive notifications for new property inquiries at this email.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Full Name *</label>
              <input type="text" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                placeholder="Sara Ahmed" />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">
                Email Address * <span className="text-slate-400 font-normal normal-case">(must be a real email — used for notifications)</span>
              </label>
              <div className="relative">
                <input type="email" required value={form.email}
                  onChange={e => handleEmailChange(e.target.value)}
                  className={`w-full border-2 rounded-lg px-3 py-2.5 pr-9 text-sm outline-none transition-colors ${emailError ? 'border-red-400 bg-red-50' : form.email && !emailError ? 'border-emerald-400' : 'focus:border-red-500'}`}
                  placeholder="sara@gmail.com" />
                {form.email && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailError
                      ? <XCircle size={15} className="text-red-500" />
                      : <CheckCircle size={15} className="text-emerald-500" />}
                  </span>
                )}
              </div>
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              {form.email && !emailError && <p className="text-emerald-600 text-xs mt-1">✓ Notifications will be sent to this email</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border-2 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-red-500"
                  placeholder="Min. 8 chars, 1 uppercase, 1 number" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {[
                    { ok: form.password.length >= 8, label: '8+ chars' },
                    { ok: /[A-Z]/.test(form.password), label: 'Uppercase' },
                    { ok: /[0-9]/.test(form.password), label: 'Number' },
                  ].map(({ ok, label }) => (
                    <span key={label} className={`text-xs px-2 py-0.5 rounded-full font-medium ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                      {ok ? '✓' : '·'} {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input type="password" required value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className={`w-full border-2 rounded-lg px-3 py-2.5 pr-9 text-sm outline-none transition-colors ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-400' : form.confirmPassword && form.password === form.confirmPassword ? 'border-emerald-400' : 'focus:border-red-500'}`}
                  placeholder="Re-enter password" />
                {form.confirmPassword && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <CheckCircle size={15} className="text-emerald-500" />
                      : <XCircle size={15} className="text-red-500" />}
                  </span>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-2">Role *</label>
              <div className="grid grid-cols-2 gap-3">
                {(['admin', 'superadmin'] as const).map(role => (
                  <label key={role} className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.role === role ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="role" value={role} checked={form.role === role}
                      onChange={() => setForm(f => ({ ...f, role }))} className="accent-red-700" />
                    <div>
                      <p className="font-bold text-[#1a2e5a] text-sm">{role === 'superadmin' ? 'Super Admin' : 'Admin'}</p>
                      <p className="text-xs text-slate-400">{role === 'superadmin' ? 'Full access + manage other admins' : 'Manage blogs, properties, agents, messages'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 flex items-center gap-3 pt-2 border-t">
              <button type="submit" disabled={saving || !!emailError}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors">
                <Save size={16} /> {saving ? 'Registering...' : 'Register Admin'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setError(''); setEmailError(''); }}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b bg-slate-50 flex items-center gap-2">
          <Shield size={15} className="text-red-700" />
          <span className="text-xs font-semibold text-slate-500 uppercase">Registered Admins</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Admin</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Last Login</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {admins.map(admin => (
                <tr key={admin._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${admin.role === 'superadmin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                        {admin.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a2e5a] text-sm">{admin.name}</p>
                        <div className="flex items-center gap-1 text-slate-400 text-xs">
                          <Mail size={10} />
                          <span>{admin.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${roleColors[admin.role]}`}>
                      {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => admin.role !== 'superadmin' && handleToggleActive(admin)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${admin.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'} ${admin.role === 'superadmin' ? 'cursor-default' : 'cursor-pointer'}`}>
                      {admin.active ? '● Active' : '○ Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <Clock size={11} />
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {admin.role === 'superadmin' ? (
                      <span className="text-xs text-slate-400 italic flex items-center gap-1 justify-end">
                        <ShieldCheck size={12} /> Protected
                      </span>
                    ) : deleteConfirm === admin._id ? (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-red-600 font-medium">Confirm?</span>
                        <button onClick={() => handleDelete(admin)} className="text-xs bg-red-600 text-white px-2 py-1 rounded font-semibold hover:bg-red-700">Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-semibold hover:bg-slate-200">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(admin._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No admin users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email notification info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Mail size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 text-sm">Email Notifications</p>
            <p className="text-blue-700 text-xs mt-1 leading-relaxed">
              All active admins automatically receive an email notification whenever a client submits a property inquiry through the contact form. Make sure every admin has a real, working email address.
              To enable this, add <code className="bg-blue-100 px-1 rounded">SMTP_USER</code> and <code className="bg-blue-100 px-1 rounded">SMTP_PASS</code> to your <code className="bg-blue-100 px-1 rounded">.env.local</code> file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}