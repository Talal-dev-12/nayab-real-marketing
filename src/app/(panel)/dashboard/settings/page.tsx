'use client';
import { useState } from 'react';
import { Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    siteName: 'Nayab Real Marketing',
    tagline: 'Your Trusted Real Estate Partner in Pakistan',
    phone: '+92-300-1234567',
    email: 'nayabrealmarketing.official@gmail.com',
    address: 'Office 301, XYZ Plaza, Shahrah-e-Faisal, Karachi',
    currentPassword: '',
    newPassword: '',
    whatsapp: '+923001234567',
    facebook: '',
    instagram: '',
    adminEmail: 'admin@nayabrealestate.com',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const F = ({ label, ...props }: any) => (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">{label}</label>
      <input className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" {...props} />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Settings</h2>
          <p className="text-slate-500 text-sm">Configure your website settings</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
          {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Business Information</h3>
        <F label="Business Name" value={form.siteName} onChange={(e: any) => setForm(f => ({ ...f, siteName: e.target.value }))} />
        <F label="Tagline" value={form.tagline} onChange={(e: any) => setForm(f => ({ ...f, tagline: e.target.value }))} />
        <F label="Phone Number" value={form.phone} onChange={(e: any) => setForm(f => ({ ...f, phone: e.target.value }))} />
        <F label="Email" value={form.email} type="email" onChange={(e: any) => setForm(f => ({ ...f, email: e.target.value }))} />
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Office Address</label>
          <textarea rows={2} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none"
            value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Social Media & Contact</h3>
        <F label="WhatsApp Number" placeholder="+923001234567" value={form.whatsapp} onChange={(e: any) => setForm(f => ({ ...f, whatsapp: e.target.value }))} />
        <F label="Facebook Page URL" placeholder="https://facebook.com/..." value={form.facebook} onChange={(e: any) => setForm(f => ({ ...f, facebook: e.target.value }))} />
        <F label="Instagram URL" placeholder="https://instagram.com/..." value={form.instagram} onChange={(e: any) => setForm(f => ({ ...f, instagram: e.target.value }))} />
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Security</h3>
        <p className="text-xs text-slate-500 bg-amber-50 p-3 rounded-lg">
          Default login: <strong>admin / admin123</strong>. Change your password regularly for security.
        </p>
        <F label="Admin Email" type="email" value={form.adminEmail} onChange={(e: any) => setForm(f => ({ ...f, adminEmail: e.target.value }))} />
        <F label="Current Password" type={showPass ? 'text' : 'password'} value={form.currentPassword}
          onChange={(e: any) => setForm(f => ({ ...f, currentPassword: e.target.value }))} />
        <div className="relative">
          <F label="New Password" type={showPass ? 'text' : 'password'} value={form.newPassword}
            onChange={(e: any) => setForm(f => ({ ...f, newPassword: e.target.value }))} />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 bottom-3 text-slate-400">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold">
          <CheckCircle size={18} /> Settings saved successfully!
        </div>
      )}
    </div>
  );
}
