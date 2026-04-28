'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X, Loader2 } from 'lucide-react';
import { api, uploadImage } from '@/lib/api-client';
import Select from '@/components/ui/Select';

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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(''); // single source of truth — Cloudinary URL
  const [form, setForm] = useState({
    name: '', email: '', phone: '', bio: '',
    specialization: 'Residential & Commercial',
    active: true,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file); // uploads to Cloudinary, returns CDN URL
      setImage(url);                       // same state used for preview AND saved to DB
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.phone) {
      setError('Name, email, and phone are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.post('/api/agents', {
        ...form,
        image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=1a2e5a&color=fff&size=400`,
        properties: 0,
      });
      router.push('/dashboard/agents');
    } catch (e: any) {
      setError(e.message || 'Failed to save agent');
    } finally {
      setSaving(false);
    }
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
          disabled={saving || uploading}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Agent'}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — form fields */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Agent Information</h3>
            <Field label="Full Name" required placeholder="Muhammad Ali"
              value={form.name} onChange={(e: any) => setForm(f => ({ ...f, name: e.target.value }))} />
            <Field label="Email Address" required type="email" placeholder="ali@nayabrealestate.com"
              value={form.email} onChange={(e: any) => setForm(f => ({ ...f, email: e.target.value }))} />
            <Field label="Phone Number" required placeholder="+92-300-0000000"
              value={form.phone} onChange={(e: any) => setForm(f => ({ ...f, phone: e.target.value }))} />
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Specialization</label>
              <Select
                value={form.specialization}
                onChange={val => setForm(f => ({ ...f, specialization: val }))}
                className="w-full border-2 rounded-lg px-3 py-2 text-sm outline-none focus-within:border-red-500 bg-white"
                options={[
                  { value: 'Residential & Commercial', label: 'Residential & Commercial' },
                  { value: 'Luxury & Plots', label: 'Luxury & Plots' },
                  { value: 'Commercial & Investment', label: 'Commercial & Investment' },
                  { value: 'Rental Properties', label: 'Rental Properties' },
                  { value: 'Industrial & Warehouse', label: 'Industrial & Warehouse' },
                ]}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1.5 block">Bio / About</label>
              <textarea rows={4}
                className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none"
                placeholder="Brief description of the agent's experience..."
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Right — photo + status */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2 mb-4">Agent Photo</h3>

            {image ? (
              /* Preview — shows the uploaded Cloudinary image */
              <div className="relative group">
                <img
                  src={image}
                  alt="Agent photo"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                  <label className="bg-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-slate-100">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    Replace
                  </label>
                  <button
                    onClick={() => setImage('')}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              /* Upload dropzone */
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-red-400 rounded-xl h-48 cursor-pointer bg-slate-50 hover:bg-red-50 transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                {uploading ? (
                  <><Loader2 size={24} className="animate-spin text-red-700 mb-2" /><p className="text-sm text-slate-500">Uploading...</p></>
                ) : (
                  <><Upload size={24} className="text-slate-400 mb-2" /><p className="text-sm font-semibold text-slate-600">Upload Photo</p><p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP · max 5MB</p></>
                )}
              </label>
            )}

            <p className="text-xs text-slate-400 mt-3">
              If no photo uploaded, a placeholder avatar will be generated automatically.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2 mb-4">Status</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.active}
                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                className="w-5 h-5 accent-red-700" />
              <span className="text-sm font-semibold text-slate-700">Active Agent</span>
            </label>
            <p className="text-xs text-slate-400 mt-2">Active agents appear on the public agents page.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
