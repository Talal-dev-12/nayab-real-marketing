'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X, Loader2, Upload } from 'lucide-react';
import { api, uploadImage } from '@/lib/api-client';

function F({ label, ...props }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">{label}</label>
      <input className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500" {...props} />
    </div>
  );
}

export default function NewPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [agents, setAgents] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', price: '', priceType: 'sale', rentPeriod: 'month',
    location: '', city: 'Karachi', area: '', bedrooms: '', bathrooms: '',
    type: 'residential', status: 'available', featured: false, agentId: '',
  });

  useEffect(() => {
    api.get<any[]>('/api/agents?active=true').then(d => setAgents(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true); setError('');
    try {
      const urls = await Promise.all(files.map(file => uploadImage(file)));
      setImages(prev => [...prev, ...urls]);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (url) { setImages(prev => [...prev, url]); setUrlInput(''); }
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.location || !form.area || !form.agentId) {
      setError('Please fill in all required fields including an agent.'); return;
    }
    setSaving(true); setError('');
    try {
      await api.post('/api/properties', {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        images,
      });
      router.push('/dashboard/properties');
    } catch (e: any) { setError(e.message || 'Failed to save property'); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/properties" className="p-2 rounded-lg hover:bg-white text-slate-500"><ArrowLeft size={20} /></Link>
          <h2 className="text-2xl font-extrabold text-[#1a2e5a]">Add New Property</h2>
        </div>
        <button onClick={handleSave} disabled={saving || uploading}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-60 transition-colors">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Property'}
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Basic Information</h3>
            <F label="Property Title *" placeholder="e.g. 5 Marla House in DHA Phase 6"
              value={form.title} onChange={(e: any) => setForm(f => ({ ...f, title: e.target.value }))} />
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Description</label>
              <textarea rows={4} className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500 resize-none"
                placeholder="Describe the property..." value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <F label="Location / Address *" placeholder="e.g. DHA Phase 6, Karachi"
              value={form.location} onChange={(e: any) => setForm(f => ({ ...f, location: e.target.value }))} />
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">City</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                <option>Karachi</option><option>Lahore</option><option>Islamabad</option>
                <option>Rawalpindi</option><option>Faisalabad</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Assign Agent *</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                value={form.agentId} onChange={e => setForm(f => ({ ...f, agentId: e.target.value }))}>
                <option value="">-- Select Agent --</option>
                {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Property Type</label>
                <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
                  <option value="plot">Plot</option>
                </select>
              </div>
              <F label="Area (sqft) *" type="number" placeholder="1125"
                value={form.area} onChange={(e: any) => setForm(f => ({ ...f, area: e.target.value }))} />
              {form.type !== 'plot' && (
                <>
                  <F label="Bedrooms" type="number" placeholder="3"
                    value={form.bedrooms} onChange={(e: any) => setForm(f => ({ ...f, bedrooms: e.target.value }))} />
                  <F label="Bathrooms" type="number" placeholder="2"
                    value={form.bathrooms} onChange={(e: any) => setForm(f => ({ ...f, bathrooms: e.target.value }))} />
                </>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Property Images</h3>

            {/* Upload zone */}
            <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${uploading ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-red-400 bg-slate-50 hover:bg-red-50'}`}>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
              {uploading ? (
                <><Loader2 size={24} className="text-red-700 animate-spin mb-2" /><p className="text-sm text-slate-500">Uploading to Cloudinary...</p></>
              ) : (
                <><Upload size={24} className="text-slate-400 mb-2" /><p className="font-semibold text-slate-600 text-sm">Click to upload images</p><p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP — multiple files allowed</p></>
              )}
            </label>

            {/* URL input */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Or Add Image URL</label>
              <div className="flex gap-2">
                <input type="url" className="flex-1 border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  placeholder="https://..." value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())} />
                <button onClick={addUrl} className="bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600">Add</button>
              </div>
            </div>

            {/* Preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-video">
                    <img src={img} className="w-full h-full object-cover rounded-lg"
                      alt="" onError={e => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')} />
                    <button onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex">
                      <X size={12} />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 bg-red-700 text-white text-xs px-1.5 py-0.5 rounded font-semibold">Main</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Pricing</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Listing Type</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                value={form.priceType} onChange={e => setForm(f => ({ ...f, priceType: e.target.value }))}>
                <option value="sale">For Sale</option><option value="rent">For Rent</option>
              </select>
            </div>
            <F label="Price (PKR) *" type="number" placeholder="25000000"
              value={form.price} onChange={(e: any) => setForm(f => ({ ...f, price: e.target.value }))} />
            {form.priceType === 'rent' && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Rent Period</label>
                <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  value={form.rentPeriod} onChange={e => setForm(f => ({ ...f, rentPeriod: e.target.value }))}>
                  <option value="month">Per Month</option><option value="year">Per Year</option>
                </select>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-[#1a2e5a] border-b pb-2">Status</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Property Status</label>
              <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
                value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured}
                onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-5 h-5 accent-red-700" />
              <span className="text-sm font-semibold text-slate-700">Mark as Featured</span>
            </label>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-700 mb-2">Images: {images.length} uploaded</p>
            <p>First image will be used as the main cover.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
