'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { defaultAgents, getFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/data';

// ✅ Moved OUTSIDE the parent component so it's never recreated on re-render
function Field({ label, required, ...props }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">
        {label}{required && ' *'}
      </label>
      <input
        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 transition-colors"
        {...props}
      />
    </div>
  );
}

export default function NewAgentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', bio: '', specialization: 'Residential & Commercial', active: true,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return alert('Please fill in required fields');
    setSaving(true);
    const agents = getFromStorage(STORAGE_KEYS.AGENTS, defaultAgents);
    const newAgent = {
      id: Date.now().toString(),
      ...form,
      image: imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=1a2e5a&color=fff&size=400`,
      properties: 0,
      createdAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.AGENTS, [newAgent, ...agents]);
    setTimeout(() => {
      setSaving(false);
      router.push('/admin/agents');
    }, 600);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/agents" className="p-2 rounded-lg hover:bg-white text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Add New Agent</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Agent'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Agent Information</h3>

            <Field
              label="Full Name"
              required
              placeholder="Muhammad Ali"
              value={form.name}
              onChange={(e: any) => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <Field
              label="Email Address"
              required
              type="email"
              placeholder="ali@nayabrealestate.com"
              value={form.email}
              onChange={(e: any) => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <Field
              label="Phone Number"
              required
              placeholder="+92-300-0000000"
              value={form.phone}
              onChange={(e: any) => setForm(f => ({ ...f, phone: e.target.value }))}
            />

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Specialization</label>
              <select
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 transition-colors"
                value={form.specialization}
                onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
              >
                <option>Residential & Commercial</option>
                <option>Luxury & Plots</option>
                <option>Commercial & Investment</option>
                <option>Rental Properties</option>
                <option>Industrial & Warehouse</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Bio / About</label>
              <textarea
                rows={4}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none transition-colors"
                placeholder="Brief description of the agent's experience and expertise..."
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Agent Photo</h3>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <button
                  onClick={() => setImagePreview('')}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-red-400 rounded-xl p-8 cursor-pointer transition-colors bg-slate-50 hover:bg-red-50">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <Upload size={24} className="text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-600">Upload Photo</p>
                <p className="text-xs text-slate-400">JPG, PNG, WEBP</p>
              </label>
            )}
            <p className="text-xs text-slate-400">If no photo uploaded, a placeholder will be generated automatically.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2 mb-4">Status</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                className="w-5 h-5 accent-red-700"
              />
              <span className="text-sm font-semibold text-slate-700">Active Agent</span>
            </label>
            <p className="text-xs text-slate-400 mt-2">Active agents are visible on the public agents page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}