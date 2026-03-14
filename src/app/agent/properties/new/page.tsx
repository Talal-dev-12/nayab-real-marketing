'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X, Loader2, Upload } from 'lucide-react';

function Field({ label, ...props }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">{label}</label>
      <input className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" {...props} />
    </div>
  );
}

export default function AgentNewPropertyPage() {
  const router   = useRouter();
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const [images,    setImages]    = useState<string[]>([]);
  const [urlInput,  setUrlInput]  = useState('');
  const [form, setForm] = useState({
    title: '', description: '', price: '', priceType: 'sale', rentPeriod: 'month',
    location: '', city: 'Karachi', area: '', bedrooms: '', bathrooms: '',
    type: 'residential', status: 'available', featured: false,
  });

  const f = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const token = localStorage.getItem('agent_token');
    try {
      const urls = await Promise.all(files.map(async file => {
        const fd = new FormData(); fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error);
        return d.url;
      }));
      setImages(p => [...p, ...urls]);
    } catch (err: any) { setError(err.message); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.location || !form.area) {
      setError('Please fill in all required fields.'); return;
    }
    setSaving(true); setError('');
    const token = localStorage.getItem('agent_token');
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price), area: Number(form.area), bedrooms: Number(form.bedrooms) || 0, bathrooms: Number(form.bathrooms) || 0, images }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || 'Failed to save'); return; }
      router.push('/agent/properties');
    } catch { setError('Connection error.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-4">
        <Link href="/agent/properties" className="p-2 text-slate-500 hover:bg-white rounded-lg"><ArrowLeft size={20} /></Link>
        <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Add New Property</h2>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-[#1a2e5a] border-b pb-2">Property Details</h3>
        <Field label="Title *" value={form.title} onChange={(e: any) => f('title', e.target.value)} placeholder="5 Marla House DHA Phase 6" />
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Description *</label>
          <textarea rows={4} value={form.description} onChange={e => f('description', e.target.value)}
            placeholder="Describe the property..." className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (PKR) *" type="number" value={form.price} onChange={(e: any) => f('price', e.target.value)} placeholder="25000000" />
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Listing Type</label>
            <select value={form.priceType} onChange={e => f('priceType', e.target.value)} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500">
              <option value="sale">For Sale</option><option value="rent">For Rent</option>
            </select>
          </div>
        </div>
        {form.priceType === 'rent' && (
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Rent Period</label>
            <select value={form.rentPeriod} onChange={e => f('rentPeriod', e.target.value)} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500">
              <option value="month">Per Month</option><option value="year">Per Year</option>
            </select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Location *" value={form.location} onChange={(e: any) => f('location', e.target.value)} placeholder="DHA Phase 6, Karachi" />
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">City</label>
            <select value={form.city} onChange={e => f('city', e.target.value)} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500">
              {['Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Area (sqft) *" type="number" value={form.area} onChange={(e: any) => f('area', e.target.value)} placeholder="1125" />
          <Field label="Bedrooms"      type="number" value={form.bedrooms} onChange={(e: any) => f('bedrooms', e.target.value)} placeholder="3" />
          <Field label="Bathrooms"     type="number" value={form.bathrooms} onChange={(e: any) => f('bathrooms', e.target.value)} placeholder="2" />
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Type</label>
            <select value={form.type} onChange={e => f('type', e.target.value)} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500">
              {['residential','commercial','office','plot'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Status</label>
          <select value={form.status} onChange={e => f('status', e.target.value)} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500">
            <option value="available">Available</option><option value="sold">Sold</option><option value="rented">Rented</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e => f('featured', e.target.checked)} className="w-4 h-4 accent-red-700" />
          <span className="text-sm font-medium text-slate-700">Mark as Featured</span>
        </label>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-[#1a2e5a] border-b pb-2">Property Images</h3>
        <div className="flex gap-3 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer bg-red-700 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
            {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : <><Upload size={16} /> Upload Images</>}
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          <div className="flex items-center gap-2 flex-1">
            <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Or paste image URL"
              className="flex-1 border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" />
            <button onClick={() => { if (urlInput.trim()) { setImages(p => [...p, urlInput.trim()]); setUrlInput(''); } }}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg"><Plus size={16} /></button>
          </div>
        </div>
        {images.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-24 h-20 object-cover rounded-lg border" />
                <button onClick={() => setImages(p => p.filter((_, j) => j !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Property</>}
        </button>
        <Link href="/agent/properties" className="px-6 py-3 bg-white border-2 rounded-xl font-semibold text-sm text-slate-700 hover:bg-slate-50">Cancel</Link>
      </div>
    </div>
  );
}
